import { Spin } from 'antd';
import styles from './styles.module.scss';

const Loading = ({ style, ...props }) => {

  return (
    <Spin style={{ maxHeight: '100%' }} {...props}>
      <div style={style} className={styles.content} />
    </Spin>
  );
};

export default Loading;
