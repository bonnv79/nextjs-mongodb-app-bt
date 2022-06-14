import { Avatar } from '@/components/Avatar';
import { LoadingDots } from '@/components/LoadingDots';
import { Text, TextLink } from '@/components/Text';
import Link from 'next/link';
import styles from './Poster.module.css';
import { PosterInner } from '@/components/PosterInner';

const Poster = ({ data, error, isCreate }) => {
  const loading = !data && !error;

  return isCreate && (
    <div className={styles.root}>
      <h3 className={styles.heading}>
        <Avatar style={{ marginRight: 8 }} size={40} username={data?.user?.username} url={data?.user?.profilePicture} />
        {data?.user ? `What's on your post, ${data?.user.name}?` : 'Share your posts'}
      </h3>
      {loading ? (
        <LoadingDots>Loading</LoadingDots>
      ) : data?.user ? (
        <PosterInner user={data.user} />
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
