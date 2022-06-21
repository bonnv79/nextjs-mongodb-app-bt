import { Spacer } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { useCurrentUser } from '@/lib/user';
import { FileAddOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { PERMISSION } from 'constants/permission';
import { BREADCRUMB_ROUTES } from 'constants/routerPath';
import { useState } from 'react';
import { checkPermission } from 'utils';
import Poster from './Poster';
import { PostList } from '@/components/PostList';

export const Post = () => {
  const [open, setOpen] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [sortDate, setSortDate] = useState(-1);
  const [published, setPublished] = useState(undefined);
  const [owner, setOwner] = useState(false);
  const { data, error } = useCurrentUser();

  const authen = Boolean(data?.user);
  const isCreate = checkPermission(data, PERMISSION.POST_CREATE);

  const onChange = () => {
    setOpen(!open);
  };

  const extra = [];
  if (isCreate) {
    extra.push(
      <Button
        key="create-form"
        onClick={onChange}
        type={open && 'primary'}
        icon={<FileAddOutlined />}
      >
        Add
      </Button>
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
          <Poster data={data} error={error} isCreate={isCreate} />
          <Spacer axis="vertical" size={1} />
        </>
      )}
      <PostList
        user={data?.user}
        searchKey={searchKey}
        published={authen ? published : true}
        sortDate={sortDate}
        owner={owner}
      />
    </PageHeader>
  );
};
