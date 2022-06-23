import { Spacer } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { useCurrentUser } from '@/lib/user';
import { FileAddOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { PERMISSION } from 'constants/permission';
import { BREADCRUMB_ROUTES } from 'constants/routerPath';
import { useState } from 'react';
import { checkPermission } from 'utils';
import Poster from './Poster';
import { PostList } from '@/components/PostList';
import { usePermissionByRoleId } from '@/lib/permission';
import { usePostPages } from '@/lib/post';

export const Post = () => {
  const [open, setOpen] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [sortDate, setSortDate] = useState(-1);
  const [published, setPublished] = useState(undefined);
  const [owner, setOwner] = useState(false);
  const { user, error, notAuth } = useCurrentUser();
  const { roles } = usePermissionByRoleId(user?.role_id);

  const authen = !notAuth;
  const isCreate = checkPermission(roles, PERMISSION.POST_CREATE);

  const usePostData = usePostPages({
    creatorId: owner ? user?._id : undefined,
    searchKey,
    published: authen ? published : true,
    sortDate
  });

  const onChange = () => {
    setOpen(!open);
  };

  const extra = [(
    <Button
      key="refresh-data"
      onClick={usePostData?.mutate}
      icon={<ReloadOutlined />}
    />
  )];

  if (isCreate) {
    extra.push(
      <Button
        key="create-form"
        onClick={onChange}
        type="primary"
        icon={<FileAddOutlined />}
      >
        Create
      </Button>,
    )
  }

  return (
    <PageHeader
      title="Manage Posts"
      breadcrumb={{
        routes: BREADCRUMB_ROUTES.POST
      }}
      extra={extra}
      onSearch={setSearchKey}
      sortDate={sortDate}
      setSortDate={setSortDate}
      published={published}
      setPublished={authen && setPublished}
      owner={owner}
      setOwner={authen && setOwner}
    >
      {searchKey}
      {open && (
        <>
          <Poster user={user} error={error} isCreate={isCreate} mutate={usePostData?.mutate} />
          <Spacer axis="vertical" size={1} />
        </>
      )}
      <PostList
        user={user}
        usePostData={usePostData}
      />
    </PageHeader>
  );
};
