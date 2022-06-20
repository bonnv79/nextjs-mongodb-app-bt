import { ObjectId } from 'mongodb';
import { dbProjectionUsers } from '.';

export async function findCommentById(db, id) {
  try {
    const posts = await db
      .collection('comments')
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        { $limit: 1 },
      ])
      .toArray();
    if (!posts[0]) return null;
    return posts[0];
  } catch (error) {
    return null;
  }
}

export async function findComments(db, postId, before, limit = 10, parentId) {
  return db
    .collection('comments')
    .aggregate([
      {
        $match: {
          postId: new ObjectId(postId),
          ...(before && { createdAt: { $lt: before } }),
          parentId: parentId ? new ObjectId(parentId) : undefined,
        },
      },
      { $sort: { _id: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'creator',
        },
      },
      { $unwind: '$creator' },
      { $project: dbProjectionUsers('creator.') },
    ])
    .toArray();
}

export async function insertComment(db, postId, { content, creatorId, postCreatorId, parentId }) {
  const timeDate = new Date();
  const comment = {
    content,
    postId: new ObjectId(postId),
    creatorId,
    createdAt: timeDate,
    updatedAt: timeDate,
    parentId: parentId && new ObjectId(parentId),
  };
  const { insertedId } = await db.collection('comments').insertOne(comment);

  if (!new ObjectId(creatorId).equals(new ObjectId(postCreatorId))) {
    await db.collection('notifications').insertOne({
      createdAt: timeDate,
      postCreatorId: new ObjectId(postCreatorId),
      postId: new ObjectId(postId),
      creatorId: new ObjectId(creatorId),
      commentId: new ObjectId(insertedId),
      parentId: parentId && new ObjectId(parentId),
    });
  }

  comment._id = insertedId;
  return comment;
}

const filterChildren = async (db, id, res = []) => {
  if (!id) {
    return;
  }
  res.push(id);
  const data = await db
    .collection('comments')
    .aggregate([
      {
        $match: {
          parentId: id,
        },
      }
    ])
    .toArray();
  while (data && data?.length > 0) {
    const item = data.pop();
    await filterChildren(db, item._id, res);
  }
}

export async function deleteComment(db, { id }) {
  // const res = await db.collection('comments').deleteOne({ _id: new ObjectId(id) });
  // await db.collection('notifications').deleteOne({ commentId: new ObjectId(id) });
  const idList = [];
  await filterChildren(db, new ObjectId(id), idList);
  await db.collection('comments').deleteMany({
    _id: {
      $in: idList
    }
  });
  await db.collection('notifications').deleteMany({
    commentId: {
      $in: idList
    }
  });
  return idList;
}

export async function putComment(db, { id, content }) {
  const newData = { updatedAt: new Date() };
  if (content) {
    newData.content = content;
  }
  const newValues = {
    $set: newData
  };
  const res = await db.collection('comments').updateOne({ _id: new ObjectId(id) }, newValues);
  return res;
}
