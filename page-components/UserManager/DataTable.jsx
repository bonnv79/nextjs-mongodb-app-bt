import { fetcher } from '@/lib/fetch';
import { usePermissionPages } from '@/lib/permission';
import { useUsers } from '@/lib/user';
import { Spin, Table } from 'antd';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { parseDataPage } from 'utils';
import { renderColumns } from './columns';

const DataTable = ({ isEdit, isDelete, searchKey }) => {
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  let { data: permissionData } = usePermissionPages();
  permissionData = parseDataPage(permissionData);

  const { data, mutate, isReachingEnd } = useUsers({ page: current - 1, pageSize: pageSize, searchKey });
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

export default DataTable;