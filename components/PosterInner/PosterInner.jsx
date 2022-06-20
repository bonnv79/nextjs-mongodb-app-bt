import { Avatar, Button, Form, Input, Space } from 'antd';
import toast from 'react-hot-toast';
import { useState, useCallback, useRef } from 'react';
import { usePostPages } from '@/lib/post';
import { fetcher } from '@/lib/fetch';
import { Editor } from '@/components/Editor';
import styles from './PosterInner.module.scss';
import { DEFAULT_UPLOAD } from 'constants';

const { TextArea } = Input;

const PosterInner = ({ user = {}, post = {}, save, cancel = () => { } }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(post.content || undefined);
  const [form] = Form.useForm();
  const editMode = post._id;
  const profilePictureRef = useRef();
  const [avatarHref, setAvatarHref] = useState(post.img);

  const { mutate } = usePostPages();

  const onFinish = useCallback(
    async (values) => {
      try {
        setIsLoading(true);
        // const requestBody = editMode ? { ...values, id: post._id } : values;
        const msg = editMode ? 'You have saved successfully' : 'You have posted successfully';

        const formData = new FormData();
        if (editMode) {
          formData.append('id', post._id);
        }
        formData.append('title', values?.title);
        formData.append('content', values?.content);

        if (profilePictureRef?.current?.files[0]) {
          formData.append('img', profilePictureRef?.current?.files[0]);
        }

        await fetcher('/api/posts', {
          method: editMode ? 'PUT' : 'POST',
          body: formData,
          // headers: { 'Content-Type': 'application/json' },
          // body: JSON.stringify(requestBody),
        });
        toast.success(msg);
        form.resetFields();
        setAvatarHref();
        // refresh post lists
        mutate();
      } catch (e) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    [mutate, editMode, post._id, form]
  );

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onAvatarChange = useCallback((e) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (l) => {
      setAvatarHref(l.currentTarget.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSave = (values) => {
    save({
      ...values,
      img: profilePictureRef?.current?.files[0],
      id: post._id
    });
  }

  return (
    <Form
      name="add-post-form"
      initialValues={{ remember: true }}
      onFinish={typeof save === 'function' ? handleSave : onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      layout='vertical'
      form={form}
    >
      <Space className={styles.header}>
        <div className={styles.imgRoot}>
          <div className={styles.imgContainer}>
            <input
              className={styles.imgInput}
              aria-label="post-image"
              type="file"
              accept="image/*"
              ref={profilePictureRef}
              onChange={onAvatarChange}
            />
            <Avatar
              size={80}
              src={avatarHref || DEFAULT_UPLOAD}
              alt={post.title}
            />
          </div>
        </div>

        <Form.Item
          name="title"
          rules={[{ required: true, message: 'Please input post\'s title!' }]}
          initialValue={post.title}
        >
          <TextArea className={styles.title} rows={2} placeholder={`What's on your post title, ${user.name}?`} />
        </Form.Item>
      </Space>

      <Form.Item
        name="content"
        rules={[{ required: true, message: 'Please input post\'s content!' }]}
        initialValue={post.content}
      >
        <Editor value={content} onChange={setContent} placeholder={`What's on your post content, ${user.name}?`} />
      </Form.Item>

      <Form.Item style={{ textAlign: 'center', margin: 0 }}>
        <Space>
          <Button type="primary" htmlType="submit" shape="round" loading={isLoading}>
            {editMode ? 'Save' : 'Submit'}
          </Button>
          {
            editMode && (
              <Button shape="round" loading={isLoading} onClick={cancel}>
                Cancel
              </Button>
            )
          }
        </Space>
      </Form.Item>
    </Form>
  )
};

export default PosterInner;