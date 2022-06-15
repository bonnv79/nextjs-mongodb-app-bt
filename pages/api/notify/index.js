import { ValidateProps } from '@/api-lib/constants';
import { deleteNotify } from '@/api-lib/db/notify';
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
      id: ValidateProps.notify.id,
    },
    required: ['id'],
    additionalProperties: false,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    const result = await deleteNotify(req.db, {
      id: req.body.id
    });

    return res.json({ ...result, id: req.body.id });
  }
);

export default handler;
