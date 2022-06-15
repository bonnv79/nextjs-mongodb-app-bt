import styles from './styles.module.scss';
import { Button, Col, Input, PageHeader as AntPageHeader, Popover, Radio, Row, Space } from 'antd';
import { Wrapper } from '@/components/Layout';
import Link from 'next/link';
import { FilterOutlined } from '@ant-design/icons';

const { Search } = Input;

function itemRender(route = {}, params, routes = [], paths) {
  const last = routes.indexOf(route) === routes.length - 1;
  return last ? (
    <span>{route.breadcrumbName}</span>
  ) : (
    <Link href={`/${paths.join('/')}`}>{route.breadcrumbName}</Link>
  );
}

export const PageHeader = ({
  className,
  title,
  breadcrumb,
  extra = [],
  onSearch,
  sortDate,
  setSortDate,
  published,
  setPublished,
  filterTitle,
  owner,
  setOwner,
  ...props
}) => {
  const initExtra = [...extra];

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

  if (setSortDate || setPublished) {
    initExtra.push(
      <Popover
        key="sort"
        title={filterTitle}
        trigger="click"
        placement="bottomRight"
        content={(
          <Row gutter={[16, 16]}>
            {setSortDate && (
              <Col span={12} >
                <Space direction="vertical">
                  <strong>Sort Date</strong>
                  <Radio.Group
                    onChange={e => setSortDate(e.target.value)}
                    value={sortDate}
                  >
                    <Space direction="vertical">
                      <Radio value={-1}>Descending</Radio>
                      <Radio value={1}>Ascending</Radio>
                    </Space>
                  </Radio.Group>
                </Space>
              </Col>
            )}
            {setPublished && (
              <Col span={12} >
                <Space direction="vertical">
                  <strong>Filter Published</strong>
                  <Radio.Group
                    onChange={e => setPublished(e.target.value)}
                    value={published}
                  >
                    <Space direction="vertical">
                      <Radio value={undefined}>All</Radio>
                      <Radio value={true}>Published</Radio>
                      <Radio value={false}>Unpublished</Radio>
                    </Space>
                  </Radio.Group>
                </Space>
              </Col>
            )}
            {setOwner && (
              <Col span={12} >
                <Space direction="vertical">
                  <strong>Filter Owner</strong>
                  <Radio.Group
                    onChange={e => setOwner(e.target.value)}
                    value={owner}
                  >
                    <Space direction="vertical">
                      <Radio value={false}>All</Radio>
                      <Radio value={true}>Owner</Radio>
                    </Space>
                  </Radio.Group>
                </Space>
              </Col>
            )}
          </Row>
        )}
      >
        <Button type="text" icon={<FilterOutlined style={{ fontSize: 20 }} />} />
      </Popover>
    );
  }

  return (
    <div className={styles.root}>
      <Wrapper>
        <AntPageHeader
          className={className}
          title={title}
          avatar={{ src: 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4' }}
          extra={initExtra}
          breadcrumb={{
            itemRender,
            ...breadcrumb,
          }}
          {...props}
        />
      </Wrapper>
    </div>
  );
};
