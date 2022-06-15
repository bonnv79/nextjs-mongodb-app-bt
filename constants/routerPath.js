export const ROUTER_PATH = {
  HOME: '/',
  LOGIN: '/login',
  POST: '/post',
  NEWS: '/news',
  SETTING: '/settings',
  SIGN_UP: '/sign-up',
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
}

export default {};