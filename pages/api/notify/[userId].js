import { findUserById } from '@/api-lib/db';
import { findNotify } from '@/api-lib/db/notify';
import { database } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  const user = await findUserById(req.db, req.query.userId);

  if (!user) {
    return res.status(404).json({ error: { message: 'User is not found.' } });
  }

  const notify = await findNotify(
    req.db,
    req.query.userId,
    req.query.before ? new Date(req.query.before) : undefined,
    req.query.limit ? parseInt(req.query.limit, 10) : undefined
  );

  return res.json({ notify });
});

export default handler;
