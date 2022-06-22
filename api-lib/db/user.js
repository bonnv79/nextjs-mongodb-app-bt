import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import normalizeEmail from 'validator/lib/normalizeEmail';

export async function findUserWithEmailAndPassword(db, email, password) {
  email = normalizeEmail(email);
  const user = await db.collection('users').findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    return { ...user, password: undefined }; // filtered out password
  }
  return null;
}

export async function findUserForAuth(db, userId) {
  return db
    .collection('users')
    .findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } })
    .then(async (user) => {
      // const permission = await db.collection('permission').findOne({ role_id: user.role_id });
      // user.roles = permission?.roles;

      // let notify = await db.collection('notifications').aggregate([
      //   { $match: { postCreatorId: new ObjectId(user._id) } },
      //   {
      //     $sort: {
      //       createdAt: -1
      //     }
      //   },
      //   { $limit: 10 },
      // ]).toArray();
      // const notifyRes = [];
      // for (let i = 0; i < notify?.length; i++) {
      //   const { creatorId, postId, commentId } = notify[i];
      //   const commentUser = await db.collection('users').findOne({ _id: new ObjectId(creatorId) });
      //   const commentPost = await db.collection('posts').findOne({ _id: new ObjectId(postId) });
      //   const commentRes = await db.collection('comments').findOne({ _id: new ObjectId(commentId) });
      //   notifyRes.push({
      //     ...notify[i],
      //     creator: commentUser,
      //     post: commentPost,
      //     comment: commentRes
      //   })
      // }
      // user.notify = notifyRes;

      return user || null;
    });
}

export async function findUsers(db, { page, pageSize, searchKey }) {
  return db
    .collection('users')
    .aggregate([
      {
        $match: {
          ...(searchKey && { role_id: { '$regex': searchKey, '$options': 'i' } }),
        },
      },
      { $sort: { _id: -1 } },
      // { $limit: pageSize }, // TODO
      { $project: { password: 0 } },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page, pageSize } }],
          data: [{ $skip: page * pageSize }, { $limit: pageSize }]
        }
      }
    ])
    .toArray();
}

export async function findUserById(db, userId) {
  return db
    .collection('users')
    .findOne({ _id: new ObjectId(userId) })
    .then((user) => user || null);
}

export async function findUserByUsername(db, username) {
  return db
    .collection('users')
    .findOne({ username }, { projection: dbProjectionUsers() })
    .then((user) => user || null);
}

export async function findUserByEmail(db, email) {
  email = normalizeEmail(email);
  return db
    .collection('users')
    .findOne({ email }, { projection: dbProjectionUsers() })
    .then((user) => user || null);
}

export async function updateUserById(db, id, data) {
  return db
    .collection('users')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after', projection: { password: 0 } }
    )
    .then(({ value }) => value);
}

export async function insertUser(
  db,
  { email, originalPassword, bio = '', name, profilePicture, username }
) {
  const user = {
    emailVerified: false,
    profilePicture,
    email,
    name,
    username,
    bio,
    role_id: 'USER' // TODO
  };
  const password = await bcrypt.hash(originalPassword, 10);
  const { insertedId } = await db
    .collection('users')
    .insertOne({ ...user, password });
  user._id = insertedId;
  return user;
}

export async function updateUserPasswordByOldPassword(
  db,
  id,
  oldPassword,
  newPassword
) {
  const user = await db.collection('users').findOne(new ObjectId(id));
  if (!user) return false;
  const matched = await bcrypt.compare(oldPassword, user.password);
  if (!matched) return false;
  const password = await bcrypt.hash(newPassword, 10);
  await db
    .collection('users')
    .updateOne({ _id: new ObjectId(id) }, { $set: { password } });
  return true;
}

export async function UNSAFE_updateUserPassword(db, id, newPassword) {
  const password = await bcrypt.hash(newPassword, 10);
  await db
    .collection('users')
    .updateOne({ _id: new ObjectId(id) }, { $set: { password } });
}

export function dbProjectionUsers(prefix = '') {
  return {
    [`${prefix}password`]: 0,
    [`${prefix}email`]: 0,
    [`${prefix}emailVerified`]: 0,
  };
}

export async function deleteUser(db, { id }) {
  const res = await db.collection('users').deleteOne({ _id: new ObjectId(id) });
  return res;
}

export async function putUser(db, { id, role_id }) {
  const newPost = {};

  if (role_id) {
    newPost.role_id = role_id;
  }

  const newValues = {
    $set: newPost
  };

  const res = await db.collection('users').updateOne({ _id: new ObjectId(id) }, newValues);
  return res ? newPost : res;
}
