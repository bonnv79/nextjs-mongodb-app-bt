import { findUserByUsername } from '@/api-lib/db';
import { database } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  const user = await findUserByUsername(req.db, req.query.username);
  res.json({ user });
});

export default handler;
