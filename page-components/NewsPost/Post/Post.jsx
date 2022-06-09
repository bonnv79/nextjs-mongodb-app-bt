import { Avatar } from '@/components/Avatar';
import { Container } from '@/components/Layout';
import { format } from '@lukeed/ms';
import clsx from 'clsx';
import Link from 'next/link';
import { useMemo } from 'react';
import styles from './Post.module.css';
import { Typography } from 'antd';

const { Paragraph } = Typography;

const Post = ({ post, className }) => {

  const timestampTxt = useMemo(() => {
    const diff = Date.now() - new Date(post.createdAt).getTime();
    if (diff < 1 * 60 * 1000) return 'Just now';
    return `${format(diff, true)} ago`;
  }, [post.createdAt]);

  const updateTimes = useMemo(() => {
    const diff = Date.now() - new Date(post.updateAt).getTime();
    if (diff < 1 * 60 * 1000) return 'Just now';
    return `${format(diff, true)} ago`;
  }, [post.updateAt]);

  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.header}>
        <Link href={`/user/${post.creator.username}`}>
          <div>
            <Container className={styles.creator}>
              <Avatar
                size={36}
                url={post.creator.profilePicture}
                username={post.creator.username}
              />
              <Container column className={styles.meta}>
                <p className={styles.name}>{post.creator.name}</p>
                <p className={styles.username}>{post.creator.username}</p>
              </Container>
            </Container>
          </div>
        </Link>
      </div>

      <div className={styles.wrap}>
        <Paragraph className={styles.content}>{post.content}</Paragraph>
      </div>

      <div className={styles.timesContainer}>
        <time dateTime={String(post.createdAt)} className={styles.timestamp}>
          Create Date: {timestampTxt} <br />
          Latest Update: {updateTimes}
        </time>
      </div>
    </div>
  );
};

export default Post;
