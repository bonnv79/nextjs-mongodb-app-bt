import PostList from './PostList';
import { BREADCRUMB_ROUTES } from 'constants/routerPath';
import { PageHeader } from '@/components/PageHeader';

export const News = () => {
  return (
    <PageHeader
      title="News"
      breadcrumb={{
        routes: BREADCRUMB_ROUTES.NEWS
      }}
    >
      <PostList />
    </PageHeader>
  );
};
