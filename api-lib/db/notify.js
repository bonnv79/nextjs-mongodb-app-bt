import { ObjectId } from 'mongodb';

export async function findNotify(db, userId, before, limit = 10) {
  let notify = await db.collection('notifications').aggregate([
    {
      $match: {
        postCreatorId: new ObjectId(userId),
        ...(before && { createdAt: { $lt: before } }),
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    },
    { $limit: limit },
  ]).toArray();

  const notifyRes = [];

  for (let i = 0; i < notify?.length; i++) {
    const { creatorId, postId, commentId } = notify[i];
    const commentUser = await db.collection('users').findOne({ _id: new ObjectId(creatorId) });
    const commentRes = await db.collection('comments').findOne({ _id: new ObjectId(commentId) });
    const commentPost = await db.collection('posts').findOne({ _id: new ObjectId(postId) });
    const creator = await db.collection('users').findOne({ _id: new ObjectId(commentPost?.creatorId) });
    commentPost.creator = creator;

    notifyRes.push({
      ...notify[i],
      creator: commentUser,
      post: commentPost,
      comment: commentRes
    })
  }

  return notifyRes;
}

export async function deleteNotify(db, { id }) {
  const res = await db.collection('notifications').deleteOne({ _id: new ObjectId(id) });
  return res;
}