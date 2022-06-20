import { Button } from '@/components/Button';
import { Comment } from '@/components/Comment';
import { Container, Spacer } from '@/components/Layout';
import { Text } from '@/components/Text';
import { useCommentPages } from '@/lib/comment';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './CommentList.module.css';

const CommentList = ({ post, isDelete = false, user, parentId, child }) => {
  const { data, size, setSize, isLoadingMore, isReachingEnd, mutate } = useCommentPages(
    { postId: post._id, parentId }
  );
  const router = useRouter();
  const { asPath } = router;
  const [, commentId] = asPath.split('#');

  useEffect(() => {
    if (commentId) {
      setTimeout(() => {
        const element = document.getElementById(commentId);
        if (element) {
          element.scrollIntoView();
        }
      }, 500)
    }
  }, [commentId]);

  const comments = data
    ? data.reduce((acc, val) => [...acc, ...val.comments], [])
    : [];

  if (child && comments?.length <= 0) {
    return null;
  }

  return (
    <div className={styles.root}>
      <Spacer axis="vertical" size={1} />
      {comments.map((comment) => (
        <div key={comment._id} className={styles.wrap}>
          <Comment
            mutate={mutate}
            post={post}
            className={styles.comment}
            comment={comment}
            isDelete={isDelete}
            user={user}
            active={commentId === comment._id}
          />
        </div>
      ))}
      {!child && <Container justifyContent="center">
        {isReachingEnd ? (
          <Text color="secondary">No more comments are found</Text>
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
      </Container>}
    </div>
  );
};

export default CommentList;
