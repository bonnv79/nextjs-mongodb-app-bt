import { CheckOutlined, CloseOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Popconfirm, Space, Typography } from 'antd';
import UserGroup from './UserGroup';

const { Text } = Typography;

export const renderColumns = ({ isEdit, isDelete, handleDelete = () => { }, mutate, permissionData }) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (value, record) => {
        return (
          <Space>
            <Avatar
              src={record?.profilePicture}
              alt={record?.username}
              icon={<UserOutlined />}
            />
            <span>{value}</span>
          </Space>
        )
      },
    },
    {
      title: 'User Name',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Email Verified',
      dataIndex: 'emailVerified',
      key: 'emailVerified',
      align: 'center',
      render: (value) => {
        return value ? (
          <Text type="success"><CheckOutlined /></Text>
        ) : (
          <Text type="warning"><CloseOutlined /></Text>
        )
      },
    },
    {
      title: 'User Group',
      dataIndex: 'role_id',
      key: 'role_id',
      align: 'center',
      render: (value, record) => {
        return (
          <UserGroup data={value} record={record} isEdit={isEdit} mutate={mutate} permissionData={permissionData} />
        )
      }
    },
  ]

  if (isDelete) {
    columns.push(
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Space size="middle" key={record._id}>
            <Popconfirm
              title="Are you sure to delete this permission?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
              placement="topRight"
            >
              <a><DeleteOutlined /></a>
            </Popconfirm>
          </Space>
        ),
        align: 'center'
      },
    )
  }

  return columns;
};