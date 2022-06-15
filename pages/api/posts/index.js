import { ValidateProps } from '@/api-lib/constants';
import { deletePost, findPosts, insertPost, putPost } from '@/api-lib/db';
import { auths, database, validateBody } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { IMG_CONFIG } from 'constants';

const upload = multer({ dest: '/tmp' });

const handler = nc(ncOpts);

handler.use(database, ...auths);

if (process.env.CLOUDINARY_URL) {
  const {
    hostname: cloud_name,
    username: api_key,
    password: api_secret,
  } = new URL(process.env.CLOUDINARY_URL);

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
  });
}

handler.get(async (req, res) => {
  const posts = await findPosts(
    req.db,
    req.query.before ? new Date(req.query.before) : undefined,
    req.query.by,
    req.query.limit ? parseInt(req.query.limit, 10) : undefined,
    req.query.published,
    req.query.searchKey,
    req.query.sortDate,
  );

  res.json({ posts });
});

handler.post(
  // ...auths,
  upload.single('img'),
  validateBody({
    type: 'object',
    properties: {
      title: ValidateProps.post.title,
      content: ValidateProps.post.content,
    },
    required: ['content'],
    additionalProperties: true,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    let img;
    if (req.file) {
      const image = await cloudinary.uploader.upload(req.file.path, IMG_CONFIG);
      img = image.secure_url;
    }

    const post = await insertPost(req.db, {
      title: req.body.title,
      content: req.body.content,
      creatorId: req.user._id,
      img
    });

    return res.json({ post });
  }
);

handler.delete(
  // ...auths,
  upload.single('img'),
  validateBody({
    type: 'object',
    properties: {
      id: ValidateProps.post.id,
    },
    required: ['id'],
    additionalProperties: true,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    const result = await deletePost(req.db, {
      id: req.body.id
    });

    return res.json({ ...result, id: req.body.id });
  }
);

handler.put(
  // ...auths,
  upload.single('img'),
  validateBody({
    type: 'object',
    properties: {
      id: ValidateProps.post.id,
      title: ValidateProps.post.title,
      content: ValidateProps.post.content,
      published: ValidateProps.post.published,
    },
    required: ['id'],
    additionalProperties: true,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    let img;
    if (req.file) {
      const image = await cloudinary.uploader.upload(req.file.path, IMG_CONFIG);
      img = image.secure_url;
    }

    const result = await putPost(req.db, {
      id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      published: req.body.published !== undefined ? req.body.published == 'true' : undefined,
      img
    });

    return res.json(result);
  }
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
