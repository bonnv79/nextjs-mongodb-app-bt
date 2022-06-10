import { Avatar } from '@/components/Avatar';
import { Container } from '@/components/Layout';
import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';
import styles from './Post.module.css';
import { CheckCircleOutlined, CloseOutlined, EditOutlined, StopOutlined } from '@ant-design/icons';
import { useCallback } from 'react';
import { usePostPages } from '@/lib/post';
import { fetcher } from '@/lib/fetch';
import toast from 'react-hot-toast';
import { Button, Spin, Tooltip, Typography } from 'antd';
import PosterInner from '@/page-components/Post/PosterInner';
import { EditorView } from '../EditorView';
import { getTimestamp, StripHTMLTags } from 'utils';

const { Paragraph } = Typography;

const Post = ({ post: initPost, className, isDelete = false, isPublished = false, isEdit = false, detailMode = false }) => {
  const [post, setPost] = useState(initPost);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { mutate } = usePostPages();

  const timestampTxt = getTimestamp(post.createdAt);

  const handleDelete = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        const res = await fetcher('/api/posts', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: post._id }),
        });

        let msg = 'You have deleted successfully.';
        if (res?.comment?.deletedCount > 0) {
          msg += ` Successfully deleted ${res?.comment?.deletedCount} ${res?.comment?.deletedCount <= 1 ? 'comment' : 'comments'} related to this post.`;
        }
        toast.success(msg, { duration: 4000 });

        // refresh post lists
        mutate();
      } catch (e) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    [mutate, post._id]
  );

  const handlePublic = async (e) => {
    e.preventDefault();
    try {
      const requestBody = { id: post._id, published: !post.published };
      setIsLoading(true);
      const res = await fetcher('/api/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      toast.success('You have published successfully');

      setPost({ ...post, ...res });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleEdit = (e) => {
    e.preventDefault();
    setEditMode(!editMode);
  }

  const handleSave = async (values) => {
    try {
      setIsLoading(true);
      const res = await fetcher('/api/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, id: post._id }),
      });
      toast.success('You have saved successfully');

      setPost({ ...post, ...res });
      setEditMode(false);
      mutate();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Spin spinning={isLoading} tip="Loading...">
      <div className={clsx(styles.root, className)}>
        <div className={styles.header}>
          <Link href={`/user/${post.creator.username}`} passHref>
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

        {
          editMode ? (
            <PosterInner post={post} save={handleSave} cancel={() => setEditMode(false)} />
          ) : (
            <>
              <Paragraph className={styles.title} ellipsis={!isEdit}>
                {post.title}
              </Paragraph>
              <div className={styles.wrap}>
                {
                  detailMode ? (
                    <EditorView>
                      {post.content}
                    </EditorView>
                  ) : (
                    <>
                      <Paragraph
                        ellipsis
                        className={styles.content}>
                        {StripHTMLTags(post.content)}
                      </Paragraph>
                    </>
                  )
                }
              </div>
            </>
          )
        }

        <div className={styles.wrap}>
          <time dateTime={String(post.createdAt)} className={styles.timestamp}>
            {timestampTxt}
          </time>
        </div>

        <div className={styles.action}>
          {
            (isPublished || isEdit) && (
              <Button
                type="text"
                shape='circle'
                icon={post.published ? (
                  <Tooltip title="Published" color="green">
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  </Tooltip>

                ) : (
                  <Tooltip title="Unpublished" color="gold">
                    <StopOutlined style={{ color: '#faad14' }} />
                  </Tooltip>
                )}
                className={styles.publicBtn}
                loading={isLoading}
                onClick={handlePublic}
              />
            )
          }
          {
            isEdit && (
              <Button
                title="Edit"
                type="text"
                shape='circle'
                icon={(
                  <Tooltip title="Edit">
                    <EditOutlined />
                  </Tooltip>
                )}
                className={styles.editBtn}
                onClick={handleEdit}
              />
            )
          }

          {
            isDelete && (
              <Button
                title="Delete"
                type="text"
                shape='circle'
                icon={(
                  <Tooltip title="Delete">
                    <CloseOutlined />
                  </Tooltip>
                )}
                className={styles.closeBtn}
                onClick={handleDelete}
              />
            )
          }
        </div>
      </div>
    </Spin>
  );
};

export default Post;
