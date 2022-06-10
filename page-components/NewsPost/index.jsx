import { Spacer } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { useCurrentUser } from '@/lib/user';
import { PERMISSION } from 'constants/permission';
import { BREADCRUMB_ROUTES } from 'constants/routerPath';
import { checkPermission } from 'utils';
import Commenter from 'components/Commenter';
import CommentList from 'components/CommentList';
import styles from './UserPost.module.css';
import { Post } from '@/components/Post';

export const UserPost = ({ post = {} }) => {
  const { data } = useCurrentUser();
  const isEdit = checkPermission(data, PERMISSION.POST.POST_EDIT);
  return (
    <PageHeader
      title={post.title}
      breadcrumb={{
        routes: BREADCRUMB_ROUTES.NEWS_DETAIL
      }}
      avatar={undefined}
    >
      <Post post={post} isEdit={isEdit} detailMode />
      <Spacer axis="vertical" size={1} />

      <h3 className={styles.subtitle}>Comments</h3>
      <Commenter post={post} />
      <CommentList post={post} />
    </PageHeader>
  );
};
