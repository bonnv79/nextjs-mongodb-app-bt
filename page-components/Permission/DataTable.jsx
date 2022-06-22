import { fetcher } from '@/lib/fetch';
import { usePermissionPages } from '@/lib/permission';
import { Spin, Table } from 'antd';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { parseDataPage } from 'utils';
import { renderColumns } from './columns';

const DataTable = ({ isEdit, isDelete, searchKey }) => {
  const [loading, setLoading] = useState(false);
  const { data, mutate, isReachingEnd } = usePermissionPages({ searchKey });
  let permissionData = parseDataPage(data);

  const handleDelete = useCallback(
    async (id) => {
      try {
        setLoading(true);
        await fetcher('/api/permission', {
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
        columns={renderColumns({ isEdit, isDelete, handleDelete })}
        dataSource={permissionData}
        size="small"
      />
    </Spin>
  )
};

export default DataTable;