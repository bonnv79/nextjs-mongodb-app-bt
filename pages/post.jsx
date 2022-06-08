import { Post } from '@/page-components/Post';
import Head from 'next/head';

const PostPage = () => {
  return (
    <>
      <Head>
        <title>Manage Posts</title>
      </Head>
      <Post />
    </>
  );
};

export default PostPage;
