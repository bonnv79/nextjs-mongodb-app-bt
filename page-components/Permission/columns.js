import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm, Space } from 'antd';
import { RoleColumn } from './RoleColumn';

export const renderColumns = ({ isEdit, isDelete, handleDelete = () => { } }) => {
  const columns = [
    {
      title: 'User group name',
      dataIndex: 'role_id',
      key: 'role_id',
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles, record) => {
        const data = Object.keys(roles);
        return (
          <RoleColumn key={record._id} record={record} data={data} isEdit={isEdit} />
        )
      },
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