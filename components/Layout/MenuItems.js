import { BookOutlined, LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import { ROUTER_PATH } from "constants/routerPath";
import Link from "next/link";

export const MENU_ITEMS = [
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
    key: 'logout',
    label: (
      <span>
        Sign out
      </span>
    ),
    icon: <LogoutOutlined />
  },
];