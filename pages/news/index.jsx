import { News } from '@/page-components/News';
import Head from 'next/head';

const NewsPage = () => {
  return (
    <>
      <Head>
        <title>News</title>
      </Head>
      <News />
    </>
  );
};

export default NewsPage;
