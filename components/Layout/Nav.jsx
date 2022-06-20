import { fetcher } from '@/lib/fetch';
import { useNotify } from '@/lib/notify';
import { useCurrentUser } from '@/lib/user';
import { NotificationOutlined, ProfileOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, List, Menu, Popover, Space, Typography } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Img } from '../Img';
import Container from './Container';
import { MENU_ITEMS } from './MenuItems';
import styles from './Nav.module.css';
import Spacer from './Spacer';
import Wrapper from './Wrapper';

const { Paragraph, Text } = Typography;

const UserMenu = ({ user, mutate }) => {
  const { data, size, setSize, isLoadingMore, isReachingEnd, mutate: notifyMutate } = useNotify({ userId: user._id });
  const notifyList = data
    ? data.reduce((acc, val) => [...acc, ...val.notify], [])
    : [];

  const menuRef = useRef();
  const avatarRef = useRef();

  const [visible, setVisible] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);

  const router = useRouter();
  useEffect(() => {
    const onRouteChangeComplete = () => setVisible(false);
    router.events.on('routeChangeComplete', onRouteChangeComplete);
    return () =>
      router.events.off('routeChangeComplete', onRouteChangeComplete);
  });

  useEffect(() => {
    // detect outside click to close menu
    const onMouseDown = (event) => {
      if (
        !menuRef.current.contains(event.target) &&
        !avatarRef.current.contains(event.target)
      ) {
        setVisible(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, []);

  const onSignOut = useCallback(async () => {
    try {
      await fetcher('/api/auth', {
        method: 'DELETE',
      });
      toast.success('You have been signed out');
      mutate({ user: null });
    } catch (e) {
      toast.error(e.message);
    }
  }, [mutate]);

  const handleRemoveNotify = async (id) => {
    setNotifyOpen(false);
    try {
      await fetcher('/api/notify', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      notifyMutate();
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className={styles.user}>
      <Space size="middle">
        <Popover
          title={(
            <h1 style={{ margin: '5px 0' }}>Notifications</h1>
          )}
          trigger="click"
          placement="bottomRight"
          visible={notifyOpen}
          onVisibleChange={() => setNotifyOpen(!notifyOpen)}
          content={(
            <div>
              <List
                className={styles.notifyList}
                itemLayout="horizontal"
                dataSource={notifyList}
                renderItem={item => {
                  const { creator, post, comment, commentId, _id } = item || {};
                  const description = ` commented on ${post?.title} (${comment?.content})`;
                  return (
                    <Link
                      passHref
                      href={`/user/${post?.creator?.username}/post/${post?._id}#${commentId}`}
                    >
                      <List.Item onClick={() => handleRemoveNotify(_id)}>
                        <List.Item.Meta style={{ alignItems: 'center' }}
                          avatar={(
                            <Avatar
                              size="large"
                              icon={<UserOutlined />}
                              src={creator?.profilePicture || undefined}
                            />
                          )}
                          // title={<a href="https://ant.design">{creator?.name}</a>}
                          description={(
                            <Paragraph
                              ellipsis={{
                                rows: 2,
                              }}
                              className={styles.notifyDescription}
                              title={creator?.name + description}
                            >
                              <strong>{creator?.name}</strong>{description}
                            </Paragraph>
                          )}
                        />
                      </List.Item>
                    </Link>
                  );
                }}
              />
              <div className={styles.loadMoreBtn}>
                {isReachingEnd ? (
                  <Text color="secondary">No more comments are found</Text>
                ) : (
                  <Button
                    loading={isLoadingMore}
                    onClick={() => setSize(size + 1)}
                  >
                    Load more
                  </Button>
                )}
              </div>
            </div>
          )}
        >
          <Badge count={isLoadingMore ? undefined : notifyList?.length} size="small">
            <Button shape="circle" icon={<NotificationOutlined />} loading={isLoadingMore} />
          </Badge>
        </Popover>

        <button
          className={styles.trigger}
          ref={avatarRef}
          onClick={() => setVisible(!visible)}
        >
          <Space>
            <Avatar
              size="default"
              alt={user.username}
              icon={user.profilePicture ? <Img src={user.profilePicture} /> : <UserOutlined />}
            />
            {user.username}
          </Space>
        </button>
      </Space>
      <div
        ref={menuRef}
        role="menu"
        aria-hidden={visible}
        className={styles.popover}
      >
        {visible && (
          <div className={styles.menu}>
            <Menu
              items={[
                {
                  key: 'user',
                  label: (
                    <Link passHref href={`/user/${user.username}`}>
                      <a>Profile</a>
                    </Link>
                  ),
                  icon: <ProfileOutlined />
                },
                ...MENU_ITEMS,
              ]}
              onClick={(value) => {
                const { key } = value || {};
                if (key === 'logout') {
                  onSignOut();
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const Nav = () => {
  const { data: { user } = {}, mutate } = useCurrentUser();

  return (
    <nav className={styles.nav}>
      <Wrapper className={styles.wrapper}>
        <Container
          className={styles.content}
          alignItems="center"
          justifyContent="space-between"
        >
          <Link href="/">
            <a className={styles.logo}>Next.js MongoDB App</a>
          </Link>
          <Container>
            {user ? (
              <>
                <UserMenu user={user} mutate={mutate} />
              </>
            ) : (
              <>
                <Link passHref href="/login">
                  <Button>
                    Log in
                  </Button>
                </Link>
                <Spacer axis="horizontal" size={0.25} />
                <Link passHref href="/sign-up">
                  <Button type="primary">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </Container>
        </Container>
      </Wrapper>
    </nav>
  );
};

export default Nav;
