import { ROUTER_PATH } from 'constants/routerPath';
import Link from 'next/link';
import { Button, Result as AntResult } from 'antd';
import { Loading } from '..';

const CODES = {
  403: {
    status: "403",
    title: "403",
    subTitle: "Sorry, you are not authorized to access this page.",
  },
  404: {
    status: "404",
    title: "404",
    subTitle: "Sorry, the page you visited does not exist.",
  },
  500: {
    status: "500",
    title: "500",
    subTitle: "Sorry, something went wrong.",
  }
}

export const Result = ({ code, loading, href = ROUTER_PATH.HOME, label = 'Back Home', ...props }) => {

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <AntResult
      extra={(
        <Link href={href} passHref>
          <Button type="primary">{label}</Button>
        </Link>
      )}
      {...CODES[code]}
      {...props}
    />
  );
};
