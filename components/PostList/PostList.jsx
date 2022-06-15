import { Button } from '@/components/Button';
import { Container } from '@/components/Layout';
import { Post } from '@/components/Post';
import { Text } from '@/components/Text';
import { usePostPages } from '@/lib/post';
import { PERMISSION } from 'constants/permission';
import Link from 'next/link';
import { checkPermission } from 'utils';
import styles from './PostList.module.css';

const initGetPath = (post) => (`/user/${post?.creator?.username}/post/${post?._id}`);

const PostList = ({
  user,
  searchKey,
  published,
  sortDate,
  getPath = initGetPath,
  owner
}) => {
  const {
    data,
    size,
    setSize,
    isLoadingMore,
    isReachingEnd
  } = usePostPages({
    creatorId: owner ? user?._id : undefined,
    searchKey,
    published,
    sortDate
  });
  const posts = data
    ? data.reduce((acc, val) => [...acc, ...val.posts], [])
    : [];
  const isDelete = checkPermission(user, PERMISSION.POST.POST_DELETE);
  const isEdit = checkPermission(user, PERMISSION.POST.POST_EDIT);

  return (
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
  );
};

export default PostList;
