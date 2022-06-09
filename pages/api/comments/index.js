import { ValidateProps } from '@/api-lib/constants';
import { deleteComment, putComment } from '@/api-lib/db/comment';
import { auths, database, validateBody } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database);

handler.delete(
  ...auths,
  validateBody({
    type: 'object',
    properties: {
      id: ValidateProps.comment.id,
    },
    required: ['id'],
    additionalProperties: false,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    const result = await deleteComment(req.db, {
      id: req.body.id
    });

    return res.json({ ...result, id: req.body.id });
  }
);

handler.put(
  ...auths,
  validateBody({
    type: 'object',
    properties: {
      id: ValidateProps.post.id,
      content: ValidateProps.post.content,
    },
    required: ['id', 'content'],
    additionalProperties: false,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    const result = await putComment(req.db, {
      id: req.body.id,
      content: req.body.content,
    });

    return res.json({ ...result, id: req.body.id });
  }
);

export default handler;
