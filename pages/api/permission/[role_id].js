import { findPermissionByRoleId } from '@/api-lib/db/permission';
import { database } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  const permission = await findPermissionByRoleId(req.db, req.query.role_id);
  res.json({ permission });
});

export default handler;
