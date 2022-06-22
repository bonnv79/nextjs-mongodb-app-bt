import { PageHeader } from '@/components/PageHeader';
import { BREADCRUMB_ROUTES } from 'constants/routerPath';
import { Result } from '@/components/Result';
import { useCurrentUser } from '@/lib/user';
import { checkPermission } from 'utils';
import { PERMISSION } from 'constants/permission';
import Creater from './Creater';
import { Button, Modal } from 'antd';
import { useState } from 'react';
import DataTable from './DataTable';

export const Permission = () => {
  const { user, isReachingEnd } = useCurrentUser();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchKey, setSearchKey] = useState('');

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  if (!checkPermission(user, PERMISSION.PERMISSION_VIEW)) {
    return <Result code={403} loading={!isReachingEnd} />
  }

  const isCreate = checkPermission(user, PERMISSION.PERMISSION_CREATE);
  const isEdit = checkPermission(user, PERMISSION.PERMISSION_EDIT);
  const isDelete = checkPermission(user, PERMISSION.PERMISSION_DELETE);
  const props = { isCreate, isEdit, isDelete, searchKey };

  return (
    <PageHeader
      title="Permission"
      breadcrumb={{
        routes: BREADCRUMB_ROUTES.PERMISSION
      }}
      extra={[
        isCreate && <Button key="create" type="primary" onClick={showModal}>Create</Button>
      ]}
      searchKey={searchKey}
      onSearch={setSearchKey}
    >
      <DataTable {...props} />

      {isCreate && (
        <Modal
          title="Create user group"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleOk}
          footer={null}
        >
          <Creater />
        </Modal>
      )}
    </PageHeader>
  );
};
