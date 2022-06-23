import { database } from '@/api-lib/middlewares';
import { usePostById } from '@/lib/post';
import { UserPost } from '@/page-components/UserPost';
import nc from 'next-connect';
import Head from 'next/head';
import { Result } from '@/components/Result';
import { ROUTER_PATH } from 'constants/routerPath';
import { useRouter } from 'next/router';

export default function UserPostPage({ postId, username }) {
  const { post, isReachingEnd, notExists } = usePostById(postId);
  const router = useRouter();

  if (!notExists && username !== post?.creator?.username) {
    router.push(`/user/${post?.creator?.username}/post/${post._id}`);
  }

  if (notExists) {
    return (
      <Result
        code={404}
        loading={!isReachingEnd}
        href={ROUTER_PATH.POST}
        label="Back Post Page"
      />
    )
  }

  if (typeof post.createdAt !== 'string') {
    post.createdAt = new Date(post.createdAt);
  }

  return (
    <>
      <Head>
        <title>
          Post Detail
        </title>
      </Head>
      {post?._id && <UserPost post={post} />}
    </>
  );
}

export async function getServerSideProps(context) {
  await nc().use(database).run(context.req, context.res);

  return {
    props: {
      postId: context.params.postId,
      username: context.params.username
    }
  };
}
