import Commenter from '@/components/Commenter';
import CommentList from '@/components/CommentList';
import { Spacer } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { Post } from '@/components/Post';
import { useCurrentUser } from '@/lib/user';
import { PERMISSION } from 'constants/permission';
import { BREADCRUMB_ROUTES } from 'constants/routerPath';
import { checkPermission } from 'utils';
import styles from './UserPost.module.css';

export const UserPost = ({ post = {} }) => {
  const { data } = useCurrentUser();
  const isEdit = checkPermission(data, PERMISSION.POST.POST_EDIT);
  const isDelete = checkPermission(data, PERMISSION.POST.POST_DELETE);
  const ownerPost = post?.creatorId === data?.user?._id;

  return (
    <PageHeader
      breadcrumb={{
        routes: BREADCRUMB_ROUTES.POST_DETAIL
      }}
      avatar={undefined}
    >
      <Post post={post} isEdit={isEdit || ownerPost} isPublished={isEdit} detailMode />
      <Spacer axis="vertical" size={1} />

      <h3 className={styles.subtitle}>Comments</h3>
      <Commenter post={post} />
      <CommentList post={post} isDelete={isDelete} user={data?.user} />
    </PageHeader>
  );
};
