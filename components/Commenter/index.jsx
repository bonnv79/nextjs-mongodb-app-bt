import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Container } from '@/components/Layout';
import { LoadingDots } from '@/components/LoadingDots';
import { Text, TextLink } from '@/components/Text';
import { useCommentPages } from '@/lib/comment';
import { fetcher } from '@/lib/fetch';
import { useCurrentUser } from '@/lib/user';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import styles from './Commenter.module.css';

const CommenterInner = ({ user, post, parentId, save = () => { } }) => {
  const contentRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const { mutate } = useCommentPages({ postId: post._id });

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (isLoading) {
        return;
      }
      try {
        setIsLoading(true);
        await fetcher(`/api/posts/${post._id}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: contentRef.current.value, parentId }),
        });
        toast.success('You have added a comment');
        contentRef.current.value = '';
        // refresh post lists
        mutate();
      } catch (e) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
        save(false);
      }
    },
    [mutate, post._id, isLoading, parentId, save]
  );

  return (
    <form onSubmit={onSubmit}>
      <Container className={styles.poster}>
        <Avatar
          size={40}
          alt={user.username}
          src={user.profilePicture}
          icon={<UserOutlined />}
        />
        <Input
          ref={contentRef}
          className={styles.input}
          placeholder="Add your comment"
          ariaLabel="Add your comment"
        />
        <Button type="success" loading={isLoading}>
          Comment
        </Button>
      </Container>
    </form>
  );
};

const Commenter = ({ post, parentId, save }) => {
  const { data, error } = useCurrentUser();
  const loading = !data && !error;

  return (
    <div className={styles.root}>
      <h3 className={styles.heading}>
        Replying to{' '}
        <Link href={`/user/${post.creator.username}`} passHref>
          <TextLink color="link">@{post.creator.username}</TextLink>
        </Link>
      </h3>
      {loading ? (
        <LoadingDots>Loading</LoadingDots>
      ) : data?.user ? (
        <CommenterInner post={post} user={data.user} parentId={parentId} save={save} />
      ) : (
        <Text color="secondary">
          Please{' '}
          <Link href="/login" passHref>
            <TextLink color="link" variant="highlight">
              sign in
            </TextLink>
          </Link>{' '}
          to comment
        </Text>
      )}
    </div>
  );
};

export default Commenter;
