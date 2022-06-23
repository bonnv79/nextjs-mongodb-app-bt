import Commenter from '@/components/Commenter';
import CommentList from '@/components/CommentList';
import { Spacer } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { Post } from '@/components/Post';
import { usePermissionByRoleId } from '@/lib/permission';
import { usePostPages } from '@/lib/post';
import { useCurrentUser } from '@/lib/user';
import { PERMISSION } from 'constants/permission';
import { BREADCRUMB_ROUTES } from 'constants/routerPath';
import { checkPermission } from 'utils';
import styles from './UserPost.module.css';

export const UserPost = ({ post = {} }) => {
  const { user } = useCurrentUser();
  const { roles } = usePermissionByRoleId(user?.role_id);
  const { mutate } = usePostPages();

  const isEdit = checkPermission(roles, PERMISSION.POST_EDIT);
  const isDelete = checkPermission(roles, PERMISSION.POST_DELETE);
  const ownerPost = post?.creatorId === user?._id;

  return (
    <PageHeader
      breadcrumb={{
        routes: BREADCRUMB_ROUTES.POST_DETAIL
      }}
      avatar={undefined}
    >
      <Post post={post} isEdit={isEdit || ownerPost} isPublished={isEdit} detailMode mutate={mutate} />
      <Spacer axis="vertical" size={1} />

      <h3 className={styles.subtitle}>Comments</h3>
      <Commenter post={post} />
      <CommentList post={post} isDelete={isDelete} user={user} />
    </PageHeader>
  );
};
