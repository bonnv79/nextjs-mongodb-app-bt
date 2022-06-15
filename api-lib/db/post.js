import { ObjectId } from 'mongodb';
import { dbProjectionUsers } from './user';

export async function findPostById(db, id) {
  try {
    const posts = await db
      .collection('posts')
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        { $limit: 1 },
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
    if (!posts[0]) return null;
    return posts[0];
  } catch (error) {
    return null;
  }
}

export async function findPosts(db, before, by, limit = 10, published = null, searchKey, sortDate = -1) {
  return db
    .collection('posts')
    .aggregate([
      {
        $match: {
          ...(by && { creatorId: new ObjectId(by) }),
          ...(before && { createdAt: { $lt: before } }),
          ...(published !== null && { published: published === 'true' }),
          ...(searchKey && { title: { '$regex': searchKey, '$options': 'i' } }),
        },
      },
      {
        $sort: {
          ...(sortDate && { createdAt: Number(sortDate) })
        }
      }, //  updateAt: -1, _id: -1,
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

export async function insertPost(db, { title, content, creatorId, img }) {
  const createTime = new Date();
  const post = {
    title,
    content,
    creatorId,
    createdAt: createTime,
    updateAt: createTime,
    img
  };
  const { insertedId } = await db.collection('posts').insertOne(post);
  post._id = insertedId;
  return post;
}

export async function deletePost(db, { id }) {
  const postRes = await db.collection('posts').deleteOne({ _id: new ObjectId(id) });
  const commentRes = await db.collection('comments').deleteMany({ postId: new ObjectId(id) });
  const notifyRes = await db.collection('notifications').deleteMany({ postId: new ObjectId(id) });
  return {
    post: postRes,
    comment: commentRes,
    notify: notifyRes
  };
}

export async function putPost(db, { id, title, content, published, img }) {
  const newPost = { updateAt: new Date() };
  if (title) {
    newPost.title = title;
  }

  if (content) {
    newPost.content = content;
  }

  if (typeof published === 'boolean') {
    newPost.published = published;
  }

  if (img) {
    newPost.img = img;
  }

  const newValues = {
    $set: newPost
  };
  const res = await db.collection('posts').updateOne({ _id: new ObjectId(id) }, newValues);
  return res ? newPost : res;
}
