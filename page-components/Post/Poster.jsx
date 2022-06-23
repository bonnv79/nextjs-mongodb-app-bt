import { LoadingDots } from '@/components/LoadingDots';
import { Text, TextLink } from '@/components/Text';
import Link from 'next/link';
import styles from './Poster.module.css';
import { PosterInner } from '@/components/PosterInner';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';

const Poster = ({ user, error, isCreate, mutate }) => {
  const loading = !user && !error;

  return isCreate && (
    <div className={styles.root}>
      <h3 className={styles.heading}>
        <Avatar
          style={{ marginRight: 8 }}
          size={40}
          alt={user?.username}
          src={user?.profilePicture}
          icon={<UserOutlined />}
        />
        {user ? `What's on your post, ${user.name}?` : 'Share your posts'}
      </h3>
      {loading ? (
        <LoadingDots>Loading</LoadingDots>
      ) : user ? (
        <PosterInner user={user} mutate={mutate} />
      ) : (
        <Text color="secondary">
          Please{' '}
          <Link href="/login" passHref>
            <TextLink color="link" variant="highlight">
              sign in
            </TextLink>
          </Link>{' '}
          to post
        </Text>
      )}
    </div>
  );
};

export default Poster;
