import { fetcher } from '@/lib/fetch';
import { usePermissionPages } from '@/lib/permission';
import { useUsers } from '@/lib/user';
import { Spin, Table } from 'antd';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { renderColumns } from './columns';

const UserManagerTable = ({ isEdit, isDelete, searchKey }) => {
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  let { data: permissionData } = usePermissionPages();
  permissionData = permissionData
    ? permissionData.reduce((acc, val) => [...acc, ...val.permission], [])
    : [];

  const { data, mutate } = useUsers({ page: current - 1, pageSize: pageSize, searchKey });
  const users = data?.users?.[0]?.data;
  const total = data?.users?.[0]?.metadata?.[0]?.total;

  const handleDelete = useCallback(
    async (id) => {
      try {
        setLoading(true);

        await fetcher('/api/users', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        toast.success('You have deleted successfully.');

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
    <Spin spinning={loading}>
      <Table
        rowKey="_id"
        columns={renderColumns({ isEdit, isDelete, handleDelete, mutate, permissionData })}
        dataSource={users}
        size="small"
        pagination={{
          current,
          pageSize,
          total,
        }}
        onChange={(newPagination) => {
          setCurrent(newPagination?.current);
          // setPageSize(newPagination?.pageSize);
        }}
      />
    </Spin>
  )
};

export default UserManagerTable;