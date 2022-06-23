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
  const { params } = req.query;
  const requestBody = JSON.parse(params);

  const users = await findUsers(req.db, {
    page: Number(requestBody?.page),
    pageSize: Number(requestBody?.pageSize),
    searchKey: requestBody?.searchKey,
  });

  res.json(users);
});

export default handler;
