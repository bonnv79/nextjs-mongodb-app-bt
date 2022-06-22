import { findUsers } from '@/api-lib/db';
import { auths, database } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database, ...auths);

handler.get(async (req, res) => {
  if (!req.user) {
    return res.json({ users: null })
  };

  const users = await findUsers(req.db, {
    page: Number(req.query.page),
    pageSize: Number(req.query.pageSize),
  });

  res.json({ users });
});

export default handler;
