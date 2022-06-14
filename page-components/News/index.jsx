import { BREADCRUMB_ROUTES } from 'constants/routerPath';
import { PageHeader } from '@/components/PageHeader';
import { PostList } from '@/components/PostList';
import { useState } from 'react';

export const News = () => {
  const [searchKey, setSearchKey] = useState('');
  const [sortDate, setSortDate] = useState(-1);

  return (
    <PageHeader
      title="News"
      breadcrumb={{
        routes: BREADCRUMB_ROUTES.NEWS
      }}
      onSearch={setSearchKey}
      sortDate={sortDate}
      setSortDate={setSortDate}
    >
      <PostList
        getPath={post => (`/news/${post?._id}`)}
        published={true}
        searchKey={searchKey}
        sortDate={sortDate}
      />
    </PageHeader>
  );
};
