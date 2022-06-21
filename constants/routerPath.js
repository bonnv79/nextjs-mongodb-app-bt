export const ROUTER_PATH = {
  HOME: '/',
  LOGIN: '/login',
  POST: '/post',
  NEWS: '/news',
  SETTING: '/settings',
  SIGN_UP: '/sign-up',
  PERMISSION: '/permission',
  USER_MANAGER: '/user-manager',
};

export const BREADCRUMB_ROUTES = {
  POST: [
    {
      path: ROUTER_PATH.HOME,
      breadcrumbName: 'Home',
    },
    {
      path: ROUTER_PATH.POST,
      breadcrumbName: 'Post',
    }
  ],
  POST_DETAIL: [
    {
      path: ROUTER_PATH.HOME,
      breadcrumbName: 'Home',
    },
    {
      path: ROUTER_PATH.POST,
      breadcrumbName: 'Post',
    },
    {
      path: 'post-detail',
      breadcrumbName: 'Post Detail',
    }
  ],
  PERMISSION: [
    {
      path: ROUTER_PATH.HOME,
      breadcrumbName: 'Home',
    },
    {
      path: ROUTER_PATH.PERMISSION,
      breadcrumbName: 'Permission',
    }
  ],
  USER_MANAGER: [
    {
      path: ROUTER_PATH.HOME,
      breadcrumbName: 'Home',
    },
    {
      path: ROUTER_PATH.USER_MANAGER,
      breadcrumbName: 'User Manager',
    }
  ],
}

export default {};