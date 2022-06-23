import { Button } from '@/components/Button';
import { Container } from '@/components/Layout';
import { Post } from '@/components/Post';
import { Text } from '@/components/Text';
import { usePermissionByRoleId } from '@/lib/permission';
import { Spin } from 'antd';
import { PERMISSION } from 'constants/permission';
import Link from 'next/link';
import { checkPermission, parseDataPage } from 'utils';
import styles from './PostList.module.css';

const initGetPath = (post) => (`/user/${post?.creator?.username}/post/${post?._id}`);

const PostList = ({
  user,
  getPath = initGetPath,
  usePostData
}) => {
  const {
    data,
    size,
    setSize,
    isLoadingMore,
    isReachingEnd,
    mutate,
  } = usePostData;
  const { roles } = usePermissionByRoleId(user?.role_id);
  const posts = parseDataPage(data);
  const isDelete = checkPermission(roles, PERMISSION.POST_DELETE);
  const isEdit = checkPermission(roles, PERMISSION.POST_EDIT);

  return (
    <Spin spinning={!isReachingEnd}>
      <div className={styles.root}>
        <h2>Total of {posts.length} {posts.length <= 1 ? 'post' : 'posts'}</h2>
        {posts.map((post) => (
          <Link
            key={post._id}
            href={getPath(post)}
            passHref
          >
            <div className={styles.wrap}>
              <Post
                className={styles.post}
                post={post}
                isDelete={isDelete || user?._id === post?.creatorId}
                isPublished={isEdit}
                mutate={mutate}
              />
            </div>
          </Link>
        ))}
        <Container justifyContent="center">
          {isReachingEnd ? (
            <Text color="secondary">No more posts are found</Text>
          ) : (
            <Button
              variant="ghost"
              type="success"
              loading={isLoadingMore}
              onClick={() => setSize(size + 1)}
            >
              Load more
            </Button>
          )}
        </Container>
      </div>
    </Spin>
  );
};

export default PostList;
