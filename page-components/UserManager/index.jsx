import { PageHeader } from '@/components/PageHeader';
import { BREADCRUMB_ROUTES } from 'constants/routerPath';
import { Result } from '@/components/Result';
import { useCurrentUser } from '@/lib/user';
import { checkPermission } from 'utils';
import { PERMISSION } from 'constants/permission';
import { useState } from 'react';
import DataTable from './DataTable';
import { Button, Modal } from 'antd';
import Creater from './Creater';

export const UserManager = () => {
  const { user, isReachingEnd } = useCurrentUser();
  const [searchKey, setSearchKey] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  if (!checkPermission(user, PERMISSION.USER_MANAGER_VIEW)) {
    return <Result code={403} loading={!isReachingEnd} />
  }

  const isCreate = checkPermission(user, PERMISSION.USER_MANAGER_CREATE);
  const isEdit = checkPermission(user, PERMISSION.USER_MANAGER_EDIT);
  const isDelete = checkPermission(user, PERMISSION.USER_MANAGER_DELETE);
  const props = { isCreate, isEdit, isDelete, searchKey };

  return (
    <PageHeader
      title="User Manager"
      breadcrumb={{
        routes: BREADCRUMB_ROUTES.USER_MANAGER
      }}
      // searchKey={searchKey}
      // onSearch={setSearchKey}
      extra={[
        isCreate && <Button key="create" type="primary" onClick={showModal}>Create</Button>
      ]}
    >
      <DataTable {...props} />

      {isCreate && (
        <Modal
          title="Create User"
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
