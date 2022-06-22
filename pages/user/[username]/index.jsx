import { useUserByUsername } from '@/lib/user';
import { User } from '@/page-components/User';
import { Spin } from 'antd';
import Head from 'next/head';

export default function UserPage({ username }) {
  const { user, isReachingEnd } = useUserByUsername(username);

  return (
    <>
      <Head>
        <title>
          {user.name} (@{user.username})
        </title>
      </Head>
      <Spin spinning={!isReachingEnd}>
        <User user={user} />
      </Spin>
    </>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      username: context?.params?.username
    }
  }
}
