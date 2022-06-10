import { findPostById } from '@/api-lib/db';
import { database } from '@/api-lib/middlewares';
import { NewsPost } from '@/page-components/NewsPost';
import nc from 'next-connect';
import Head from 'next/head';
import { Result } from '@/components/Result';

export default function UserPostPage({ post, notFound }) {

  if (notFound) {
    return (
      <Result code={404} />
    )
  }

  if (typeof post.createdAt !== 'string') {
    post.createdAt = new Date(post.createdAt);
  }

  return (
    <>
      <Head>
        <title>
          {post.title}
        </title>
      </Head>
      <NewsPost post={post} />
    </>
  );
}

export async function getServerSideProps(context) {
  await nc().use(database).run(context.req, context.res);

  const post = await findPostById(context.req.db, context.params.postId);

  if (!post) {
    return {
      props: {
        notFound: true,
      }
    };
  }

  post._id = String(post._id);
  post.creatorId = String(post.creatorId);
  post.creator._id = String(post.creator._id);
  post.createdAt = post.createdAt.toJSON();
  post.updateAt = post.updateAt.toJSON();
  return { props: { post } };
}
