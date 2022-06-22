import { ValidateProps } from '@/api-lib/constants';
import { deleteUser, findUserByEmail, findUserByUsername, insertUser, putUser } from '@/api-lib/db';
import { auths, database, validateBody } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import { slugUsername } from '@/lib/user';
import nc from 'next-connect';
import isEmail from 'validator/lib/isEmail';
import normalizeEmail from 'validator/lib/normalizeEmail';

const handler = nc(ncOpts);

handler.use(database);

handler.post(
  validateBody({
    type: 'object',
    properties: {
      username: ValidateProps.user.username,
      name: ValidateProps.user.name,
      password: ValidateProps.user.password,
      email: ValidateProps.user.email,
      create: ValidateProps.user.create,
    },
    required: ['username', 'name', 'password', 'email'],
    additionalProperties: false,
  }),
  ...auths,
  async (req, res) => {
    let { username, name, email, password, create } = req.body;
    username = slugUsername(req.body.username);
    email = normalizeEmail(req.body.email);
    if (!isEmail(email)) {
      res
        .status(400)
        .json({ error: { message: 'The email you entered is invalid.' } });
      return;
    }
    if (await findUserByEmail(req.db, email)) {
      res
        .status(403)
        .json({ error: { message: 'The email has already been used.' } });
      return;
    }
    if (await findUserByUsername(req.db, username)) {
      res
        .status(403)
        .json({ error: { message: 'The username has already been taken.' } });
      return;
    }
    const user = await insertUser(req.db, {
      email,
      originalPassword: password,
      bio: '',
      name,
      username,
    });

    if (!create) {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.status(201).json({
          user,
        });
      });
    } else {
      return res.json(user);
    }
  }
);

handler.delete(
  ...auths,
  validateBody({
    type: 'object',
    properties: {
      id: ValidateProps.user.id,
    },
    required: ['id'],
    additionalProperties: true,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    const result = await deleteUser(req.db, {
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
      id: ValidateProps.user.id,
      role_id: ValidateProps.user.role_id,
    },
    required: ['id', 'role_id'],
    additionalProperties: true,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    const result = await putUser(req.db, {
      id: req.body.id,
      role_id: req.body.role_id,
    });

    return res.json(result);
  }
);

export default handler;
