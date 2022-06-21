import { fetcher } from '@/lib/fetch';
import { usePermissionPages } from '@/lib/permission';
import { Button, Form, Input, Select, Space, Spin } from 'antd';
import { PERMISSION } from 'constants/permission';
import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
const { Option } = Select;

const Creater = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { mutate } = usePermissionPages();

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = useCallback(
    async (values) => {
      try {
        setLoading(true);

        await fetcher('/api/permission', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        toast.success('You have saved successfully');

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
        name="create-user-group"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        form={form}
      >
        <Form.Item
          label="User group name"
          name="role_id"
          rules={[
            {
              required: true,
              message: 'Please input your user group name!',
            },
          ]}
        >
          <Input placeholder="Please input..." />
        </Form.Item>

        <Form.Item
          label="Roles"
          name="roles"
          rules={[
            {
              required: true,
              message: 'Please input your roles!',
            },
          ]}
        >
          <Select
            allowClear
            mode="multiple"
            style={{
              minWidth: 150,
              maxWidth: '100%'
            }}
            placeholder="Please select..."
          >
            {(Object.keys(PERMISSION)).map(role => {
              return (
                <Option key={role}>{role}</Option>
              )
            })}
          </Select>
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