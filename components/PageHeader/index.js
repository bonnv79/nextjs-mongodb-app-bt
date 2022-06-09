import styles from './styles.module.css';
import { Input, PageHeader as AntPageHeader, Select } from 'antd';
import { Wrapper } from '@/components/Layout';
import Link from 'next/link';

const { Search } = Input;
const { Option } = Select;

function itemRender(route = {}, params, routes = [], paths) {
  const last = routes.indexOf(route) === routes.length - 1;
  return last ? (
    <span>{route.breadcrumbName}</span>
  ) : (
    <Link href={`/${paths.join('/')}`}>{route.breadcrumbName}</Link>
  );
}

export const PageHeader = ({ className, title, breadcrumb, extra = [], onSearch, onSort, ...props }) => {
  const initExtra = [];

  if (onSearch) {
    initExtra.push(
      <Search
        key="search"
        placeholder="Search..."
        style={{ width: 250 }}
        onSearch={onSearch}
      />
    )
  }

  if (onSort) {
    initExtra.push(
      <Select
        key="sort"
        defaultValue="date-desc"
        style={{ width: 140 }}
        onChange={onSort}
      >
        <Option value="date-desc">Sort Date DESC</Option>
        <Option value="date-asc">Sort Date ASC</Option>
      </Select>
    )
  }

  return (
    <div className={styles.root}>
      <Wrapper>
        <AntPageHeader
          className={className}
          title={title}
          avatar={{ src: 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4' }}
          extra={[...initExtra, ...extra]}
          breadcrumb={{
            itemRender,
            ...breadcrumb
          }}
          {...props}
        />
      </Wrapper>
    </div>
  );
};
