import { Avatar } from '@/components/Avatar';
import { Container } from '@/components/Layout';
import clsx from 'clsx';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import styles from './Post.module.css';
import { CheckCircleOutlined, CloseOutlined, EditOutlined, StopOutlined } from '@ant-design/icons';
import { usePostPages } from '@/lib/post';
import { fetcher } from '@/lib/fetch';
import toast from 'react-hot-toast';
import { Button, Col, Popconfirm, Row, Spin, Tooltip, Typography } from 'antd';
import { PosterInner } from '@/components/PosterInner';
import { EditorView } from '../EditorView';
import { getTimestamp, StripHTMLTags } from 'utils';
import { DEFAULT_POST } from 'constants';
import { Img } from '../Img';

const { Paragraph } = Typography;

const Post = ({
  post: initPost,
  className,
  isDelete = false,
  isPublished = false,
  isEdit = false,
  detailMode = false,
  hideTitle = false
}) => {
  const [post, setPost] = useState(initPost);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { mutate } = usePostPages();

  const timestampTxt = getTimestamp(post.createdAt);

  useEffect(() => {
    if (!post.img) {
      setPost({ ...post, img: DEFAULT_POST })
    }
  }, [post])

  const handleDelete = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('id', post._id);

        const res = await fetcher('/api/posts', {
          method: 'DELETE',
          body: formData,
          // headers: { 'Content-Type': 'application/json' },
          // body: JSON.stringify({ id: post._id }),
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
      setIsLoading(true);

      const formData = new FormData();
      formData.append('id', post._id);
      formData.append('published', !post.published);

      const res = await fetcher('/api/posts', {
        method: 'PUT',
        body: formData,
        // headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify({ id: post._id, published: !post.published }),
      });
      toast.success('You have published successfully');

      setPost({ ...post, ...res });
      mutate();
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

      const formData = new FormData();
      formData.append('id', values?.id);
      formData.append('title', values?.title);
      formData.append('content', values?.content);
      formData.append('img', values?.img);

      const res = await fetcher('/api/posts', {
        method: 'PUT',
        body: formData,
        // headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify({ ...values, id: post._id }),
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

  const strContent = StripHTMLTags(post.content);

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
            <Row gutter={[16, 16]}>
              <Col span={detailMode ? 24 : 8} className={styles.imgContainer} >
                <Img
                  className={styles.img}
                  src={post.img}
                  alt={post.title}
                  height={250}
                />
              </Col>
              <Col span={detailMode ? 24 : 16} style={{ display: 'flex', alignItems: 'center' }} >
                <div style={{ width: '100%' }}>
                  <Paragraph
                    style={{ display: hideTitle ? 'none' : undefined }}
                    className={styles.title}
                    ellipsis={detailMode ? false : {
                      rows: 2
                    }}
                  >
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
                            ellipsis={{
                              rows: 5,
                            }}
                            className={styles.content}>
                            {strContent}
                          </Paragraph>
                        </>
                      )
                    }
                  </div>
                </div>
              </Col>
            </Row>
          )
        }

        <div className={styles.wrap}>
          <time dateTime={String(post.createdAt)} className={styles.timestamp}>
            {timestampTxt}
          </time>
        </div>

        <div className={styles.action}>
          {
            isPublished && (
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
              <Popconfirm
                placement="bottomRight"
                title="Are you sure to delete this post?"
                onConfirm={handleDelete}
                onCancel={e => e.preventDefault()}
                okText="Yes"
                cancelText="No"
              >
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
                  onClick={e => e.preventDefault()}
                />
              </Popconfirm>
            )
          }
        </div>
      </div>
    </Spin>
  );
};

export default Post;
