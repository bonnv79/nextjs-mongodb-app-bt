import { Spacer } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { Result } from '@/components/Result';
import { useCurrentUser } from '@/lib/user';
import { Checkbox } from 'antd';
import { PERMISSION } from 'constants/permission';
import { BREADCRUMB_ROUTES } from 'constants/routerPath';
import { useState } from 'react';
import { checkPermission } from 'utils';
import Poster from './Poster';
import PostList from './PostList';

export const Post = () => {
  const [open, setOpen] = useState(false);
  const { data, error } = useCurrentUser();

  if (!data?.user) {
    return <Result code={403} />
  }

  const isViewAllPost = checkPermission(data, PERMISSION.POST.POST_VIEW);
  const isCreate = checkPermission(data, PERMISSION.POST.POST_CREATE);

  const onChange = () => {
    setOpen(!open);
  };

  const extra = [];
  if (isCreate) {
    extra.push(<Checkbox key="create-form" onChange={onChange} checked={open}>Create Form</Checkbox>)
  }

  return (
    <PageHeader
      title="Manage Posts"
      breadcrumb={{
        routes: BREADCRUMB_ROUTES.POST
      }}
      extra={extra}
    >
      {open && (
        <>
          <Poster data={data} error={error} isCreate={isCreate} />
          <Spacer axis="vertical" size={1} />
        </>
      )}
      <PostList user={data?.user} isViewAllPost={isViewAllPost} />
    </PageHeader>
  );
};
