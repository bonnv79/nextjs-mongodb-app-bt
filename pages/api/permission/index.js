import { ValidateProps } from '@/api-lib/constants';
import { deletePermission, findPermission, findPermissionByRoleId, insertPermission, putPermission } from '@/api-lib/db/permission';
import { auths, database, validateBody } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  const permission = await findPermission(
    req.db,
    req.query.limit ? parseInt(req.query.limit, 10) : undefined,
    req.query.searchKey,
  );

  res.json({ data: permission });
});

handler.post(
  ...auths,
  validateBody({
    type: 'object',
    properties: {
      title: ValidateProps.permission.role_id,
      content: ValidateProps.permission.roles,
    },
    required: ['role_id', 'roles'],
    additionalProperties: true,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    const role_id = req.body.role_id?.trim();
    const exits = await findPermissionByRoleId(req.db, role_id);
    if (exits) {
      return res.status(409).json({
        error: { message: 'User group name already exists.' },
      }).end();
    }

    const permission = await insertPermission(req.db, {
      role_id,
      roles: req.body.roles,
    });

    return res.json({ permission });
  }
);

handler.delete(
  ...auths,
  validateBody({
    type: 'object',
    properties: {
      id: ValidateProps.permission.id,
    },
    required: ['id'],
    additionalProperties: false,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    const result = await deletePermission(req.db, {
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
      role_id: ValidateProps.permission.role_id,
      roles: ValidateProps.permission.roles,
    },
    required: ['role_id', 'roles'],
    additionalProperties: true,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }
    const role_id = req.body.role_id?.trim();

    const result = await putPermission(req.db, {
      role_id,
      roles: req.body.roles,
    });

    return res.json(result);
  }
);

export default handler;
