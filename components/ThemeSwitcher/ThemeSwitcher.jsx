import { Dropdown, Menu, Space } from 'antd';
import { useTheme } from 'next-themes';
import { useCallback, useState, useEffect } from 'react';
import styles from './styles.module.scss';

const items = [
  {
    key: 'system',
    label: (
      <a>
        System
      </a>
    ),
  },
  {
    key: 'dark',
    label: (
      <a>
        Dark
      </a>
    ),
  },
  {
    key: 'light',
    label: (
      <a>
        Light
      </a>
    ),
  },
];

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [value, setValue] = useState('');

  useEffect(() => {
    if (theme) {
      setValue(theme);
    }
  }, [theme]);

  const onChange = useCallback(
    ({ key }) => {
      setTheme(key);
    },
    [setTheme]
  );

  return (
    <Dropdown
      overlay={(
        <Menu
          onClick={onChange}
          items={items}
        />
      )}
      placement="bottom"
    >
      <Space className={styles.root}>
        <span>Theme</span>
        <a>{value}</a>
      </Space>
    </Dropdown>
  )
};

export default ThemeSwitcher;
