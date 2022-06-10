import { Avatar } from '@/components/Avatar';
import { Container } from '@/components/Layout';
import { CloseOutlined, CloseSquareOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { format } from '@lukeed/ms';
import { Button, Input, Space, Spin } from 'antd';
import clsx from 'clsx';
import Link from 'next/link';
import { useCallback, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import styles from './Comment.module.css';
import { fetcher } from '@/lib/fetch';

const { TextArea } = Input;

const Comment = ({ mutate = () => { }, comment, className, isDelete = false, user = {} }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [content, setContent] = useState(comment.content);
  const ownerComment = comment?.creatorId === user?._id;

  const timestampTxt = useMemo(() => {
    const diff = Date.now() - new Date(comment.createdAt).getTime();
    if (diff < 1 * 60 * 1000) return 'Just now';
    return `${format(diff, true)} ago`;
  }, [comment.createdAt]);

  const handleDelete = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        await fetcher('/api/comments', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: comment._id }),
        });

        toast.success('You have deleted successfully.');
        // refresh comment lists
        mutate();
      } catch (e) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    [mutate, comment._id]
  );

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setEditing(true);
      await fetcher('/api/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: comment._id, content }),
      });
      toast.success('You have saved successfully');
      mutate();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setEditing(false);
      setEditMode(false);
    }
  }

  const handleEdit = () => {
    setEditMode(!editMode);
  }

  const handleCancel = () => {
    setEditMode(false);
  }

  return (
    <Spin spinning={isLoading}>
      <div className={clsx(styles.root, className)}>
        <Link href={`/user/${comment.creator.username}`}>
          <a>
            <Container className={styles.creator}>
              <Avatar
                size={36}
                url={comment.creator.profilePicture}
                username={comment.creator.username}
              />
              <Container column className={styles.meta}>
                <p className={styles.name}>{comment.creator.name}</p>
                <p className={styles.username}>{comment.creator.username}</p>
              </Container>
            </Container>
          </a>
        </Link>
        <div className={styles.wrap}>
          {
            editMode ? (
              <TextArea rows={4} value={content} onChange={e => setContent(e.target.value)} />
            ) : (
              <p className={styles.content}>{comment.content}</p>
            )
          }
          {
            editMode && (
              <Space style={{ marginTop: 8 }}>
                <Button loading={editing} size="small" type="text" shape='round' icon={<SaveOutlined />} onClick={handleSave}>Save</Button>
                <Button loading={editing} size="small" type="text" shape='round' icon={<CloseSquareOutlined />} onClick={handleCancel}>Cancel</Button>
              </Space>
            )
          }
        </div>
        <div className={styles.wrap}>
          <time dateTime={String(comment.createdAt)} className={styles.timestamp}>
            {timestampTxt}
          </time>
        </div>

        {
          (isDelete || ownerComment) && (
            <Button type="text" shape='circle' icon={<CloseOutlined />} className={styles.closeBtn} onClick={handleDelete} />
          )
        }

        {
          (ownerComment) && (
            <Button type="text" shape='circle' icon={<EditOutlined />} className={styles.editBtn} onClick={handleEdit} />
          )
        }
      </div>
    </Spin>
  );
};

export default Comment;
