import { fetcher } from '@/lib/fetch';
import { useUsers } from '@/lib/user';
import { Button, Form, Input, Space, Spin } from 'antd';
import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

const Creater = ({ resetPagination }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { mutate } = useUsers();

  const onReset = () => {
    form.resetFields();
    resetPagination();
  };

  const onFinish = useCallback(
    async (values) => {
      try {
        setLoading(true);
        const { email, name, password } = values || {};

        await fetcher('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email?.trim(),
            name: name?.trim(),
            password: password,
            username: email?.split('@')?.[0],
            create: true
          }),
        });
        toast.success('Your account has been created.');

        onReset();
        mutate();
      } catch (e) {
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    },
    [mutate]
  );

  return (
    <Spin spinning={loading} >
      <Form
        name="create-user"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        form={form}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: 'Please input field.',
            },
          ]}
        >
          <Input placeholder="Please input..." />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Please input field.',
            },
          ]}
        >
          <Input placeholder="Please input..." />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input field.',
            },
          ]}
        >
          <Input.Password placeholder="Please input..." />
        </Form.Item>

        <Form.Item>
          <center>
            <Space size="middle">
              <Button onClick={onReset}>
                Reset
              </Button>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Space>
          </center>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default Creater;