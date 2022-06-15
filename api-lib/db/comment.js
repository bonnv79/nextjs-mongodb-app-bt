import { ObjectId } from 'mongodb';
import { dbProjectionUsers } from '.';

export async function findComments(db, postId, before, limit = 10) {
  return db
    .collection('comments')
    .aggregate([
      {
        $match: {
          postId: new ObjectId(postId),
          ...(before && { createdAt: { $lt: before } }),
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

export async function insertComment(db, postId, { content, creatorId, postCreatorId }) {
  const timeDate = new Date();
  const comment = {
    content,
    postId: new ObjectId(postId),
    creatorId,
    createdAt: timeDate,
    updatedAt: timeDate,
  };
  const { insertedId } = await db.collection('comments').insertOne(comment);

  if (!new ObjectId(creatorId).equals(new ObjectId(postCreatorId))) {
    await db.collection('notifications').insertOne({
      createdAt: timeDate,
      postCreatorId: new ObjectId(postCreatorId),
      postId: new ObjectId(postId),
      creatorId: new ObjectId(creatorId),
      commentId: new ObjectId(insertedId),
    });
  }

  comment._id = insertedId;
  return comment;
}

export async function deleteComment(db, { id }) {
  const res = await db.collection('comments').deleteOne({ _id: new ObjectId(id) });
  await db.collection('notifications').deleteOne({ commentId: new ObjectId(id) });
  return res;
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
