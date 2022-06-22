import { Spin } from 'antd';
import styles from './styles.module.scss';

const Loading = ({ ...props }) => {

  return (
    <Spin style={{ maxHeight: '100%' }} {...props}>
      <div className={styles.content} />
    </Spin>
  );
};

export default Loading;
