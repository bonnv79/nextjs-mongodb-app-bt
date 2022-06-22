import { UserManager } from '@/page-components/UserManager';
import Head from 'next/head';

const UserManagerPage = () => {
  return (
    <>
      <Head>
        <title>User Manager</title>
      </Head>
      <UserManager />
    </>
  );
};

export default UserManagerPage;
