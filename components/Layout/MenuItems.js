import { BookOutlined, LogoutOutlined, ProfileOutlined, SettingOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { PERMISSION } from "constants/permission";
import { ROUTER_PATH } from "constants/routerPath";
import Link from "next/link";
import { checkPermission } from "utils";

export const getMenuItems = ({ user }) => {
  const menuItems = [
    {
      key: 'user',
      label: (
        <Link passHref href={`/user/${user.username}`}>
          <a>Profile</a>
        </Link>
      ),
      icon: <ProfileOutlined />
    },
    {
      key: ROUTER_PATH.SETTING,
      label: (
        <Link passHref href={ROUTER_PATH.SETTING}>
          <a>Settings</a>
        </Link>
      ),
      icon: <SettingOutlined />
    },
    {
      key: ROUTER_PATH.POST,
      label: (
        <Link passHref href={ROUTER_PATH.POST}>
          <a>Posts</a>
        </Link>
      ),
      icon: <BookOutlined />
    },
    {
      key: ROUTER_PATH.PERMISSION,
      label: (
        <Link passHref href={ROUTER_PATH.PERMISSION}>
          <a>Permission</a>
        </Link>
      ),
      icon: <UsergroupAddOutlined />,
      permission: PERMISSION.PERMISSION_VIEW,
    },
    {
      key: 'logout',
      label: (
        <span>
          Sign out
        </span>
      ),
      icon: <LogoutOutlined />
    },
  ];

  return menuItems.filter(item => !item.permission || checkPermission(user, item.permission));
};