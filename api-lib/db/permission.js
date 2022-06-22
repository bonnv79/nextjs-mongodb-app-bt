import { ObjectId } from "mongodb";
import { arrayToObject } from "utils/array";

export const COLLECTION_NAME = 'permission';

export async function findPermissionByRoleId(db, role_id) {
  return db
    .collection(COLLECTION_NAME)
    .findOne({ role_id })
    .then((res) => res || null);
}

export async function findPermission(db, limit, searchKey) {
  return db
    .collection(COLLECTION_NAME)
    .aggregate([
      {
        $match: {
          ...(searchKey && { role_id: { '$regex': searchKey, '$options': 'i' } }),
        },
      },
      { $sort: { _id: -1 } },
      { $limit: limit },
    ])
    .toArray();
}

export async function insertPermission(db, { role_id, roles }) {
  const createTime = new Date();
  const permission = {
    role_id,
    roles: arrayToObject(roles),
    createdAt: createTime,
    updateAt: createTime,
  };
  const { insertedId } = await db.collection(COLLECTION_NAME).insertOne(permission);
  permission._id = insertedId;

  return permission;
}

export async function deletePermission(db, { id }) {
  const res = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
  return res;
}

export async function putPermission(db, { role_id, roles }) {
  const newPost = { updateAt: new Date() };

  if (roles) {
    newPost.roles = arrayToObject(roles);
  }

  const newValues = {
    $set: newPost
  };
  const res = await db.collection(COLLECTION_NAME).updateOne({ role_id }, newValues);
  return res ? newPost : res;
}
