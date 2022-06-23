import { fetcher } from '@/lib/fetch';
import { usePermissionPages } from '@/lib/permission';
import { useUsers } from '@/lib/user';
import { Spin, Table } from 'antd';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { parseDataPage } from 'utils';
import { renderColumns } from './columns';

const DataTable = ({ isEdit, isDelete, searchKey, pagination, setPagination }) => {
  const [loading, setLoading] = useState(false);

  let { data: permissionData } = usePermissionPages();
  permissionData = parseDataPage(permissionData);

  const { data, mutate, isReachingEnd } = useUsers({ page: pagination?.current, pageSize: pagination?.pageSize, searchKey });
  const users = parseDataPage(data);
  const metadata = parseDataPage(data, 'metadata')?.[0] || {};
  const { total } = metadata;

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
    <Spin spinning={loading || !isReachingEnd}>
      <Table
        rowKey="_id"
        columns={renderColumns({ isEdit, isDelete, handleDelete, mutate, permissionData })}
        dataSource={users}
        size="small"
        pagination={{
          current: pagination?.current,
          pageSize: pagination?.pageSize,
          total,
        }}
        onChange={(newPagination) => {
          setPagination(newPagination);
        }}
      />
    </Spin>
  )
};

export default DataTable;