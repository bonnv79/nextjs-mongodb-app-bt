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
import { usePermissionByRoleId } from '@/lib/permission';

export const UserManager = () => {
  const { user, isReachingEnd } = useCurrentUser();
  const { roles, isReachingEnd: isReachingEndPer } = usePermissionByRoleId(user?.role_id);
  const [searchKey, setSearchKey] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  if (!checkPermission(roles, PERMISSION.USER_MANAGER_VIEW)) {
    return <Result code={403} loading={!isReachingEnd || !isReachingEndPer} />
  }

  const isCreate = checkPermission(roles, PERMISSION.USER_MANAGER_CREATE);
  const isEdit = checkPermission(roles, PERMISSION.USER_MANAGER_EDIT);
  const isDelete = checkPermission(roles, PERMISSION.USER_MANAGER_DELETE);
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
