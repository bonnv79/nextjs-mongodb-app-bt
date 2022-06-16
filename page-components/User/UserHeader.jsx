import { Container } from '@/components/Layout';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import styles from './UserHeader.module.css';

const UserHeader = ({ user }) => {
  return (
    <Container className={styles.root} column alignItems="center">
      <div className={styles.avatar}>
        <Avatar
          size={168}
          alt={user.username}
          src={user.profilePicture}
          icon={<UserOutlined />}
        />
      </div>
      <h1>
        <div className={styles.name}>{user.name}</div>
        <div className={styles.username}>@{user.username}</div>
      </h1>
      <p className={styles.bio}>{user.bio}</p>
    </Container>
  );
};

export default UserHeader;
