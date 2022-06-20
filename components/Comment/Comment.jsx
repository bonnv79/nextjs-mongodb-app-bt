import { Container } from '@/components/Layout';
import { CloseOutlined, CloseSquareOutlined, EditOutlined, SaveOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import { format } from '@lukeed/ms';
import { Avatar, Button, Input, Space, Spin } from 'antd';
import clsx from 'clsx';
import Link from 'next/link';
import { useCallback, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import styles from './Comment.module.css';
import { fetcher } from '@/lib/fetch';
import Commenter from '../Commenter';
import CommentList from '../CommentList';

const { TextArea } = Input;

const Comment = ({
  mutate = () => { },
  comment,
  className,
  isDelete = false,
  user = {},
  active,
  post
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [reply, setReply] = useState(false);
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

  const handleReply = () => {
    setReply(!reply);
  }

  return (
    <Spin spinning={isLoading} id={comment._id}>
      <div className={clsx(styles.root, className, active && styles.active)}>
        <Container className={styles.creator}>
          <Avatar
            size={36}
            src={comment.creator.profilePicture}
            alt={comment.creator.username}
            icon={<UserOutlined />}
          />
          <Container column className={styles.meta}>
            <Link href={`/user/${comment.creator.username}`} passHref>
              <a className={styles.name}>{comment.creator.name}</a>
            </Link>
            <div className={styles.username}>
              {
                editMode ? (
                  <TextArea rows={3} value={content} onChange={e => setContent(e.target.value)} />
                ) : (
                  <p className={styles.content}>{comment.content}</p>
                )
              }
              {
                editMode && (
                  <Space style={{ marginTop: 8 }}>
                    <Button
                      className={styles.actionBtn}
                      loading={editing}
                      size="small"
                      type="text"
                      shape='round'
                      icon={<SaveOutlined />}
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                    <Button
                      className={styles.actionBtn}
                      loading={editing}
                      size="small"
                      type="text"
                      shape='round'
                      icon={<CloseSquareOutlined />}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </Space>
                )
              }
            </div>
          </Container>
        </Container>

        <Space className={styles.action} size="small">
          <p className={styles.timestamp}>{timestampTxt}</p>

          <Button type="text" shape='circle' icon={<SendOutlined />} className={styles.replyBtn} onClick={handleReply} />

          {
            (ownerComment) && (
              <Button type="text" shape='circle' icon={<EditOutlined />} className={styles.editBtn} onClick={handleEdit} />
            )
          }

          {
            (isDelete || ownerComment) && (
              <Button type="text" shape='circle' icon={<CloseOutlined />} className={styles.closeBtn} onClick={handleDelete} />
            )
          }
        </Space>
        {
          reply && (
            <Commenter post={post} parentId={comment._id} save={setReply} />
          )
        }

        <CommentList post={post} isDelete={isDelete} user={user} parentId={comment._id} child={true} />
      </div>
    </Spin>
  );
};

export default Comment;
