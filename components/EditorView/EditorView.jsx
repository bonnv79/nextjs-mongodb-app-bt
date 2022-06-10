import { QuillNoSSRWrapper } from "../QuillNoSSRWrapper";
import styles from './styles.module.scss';

export default function EditorView({ className, children, ...props }) {
  return (
    <QuillNoSSRWrapper
      className={`${styles.root} ${className}`}
      value={children}
      readOnly={true}
      theme="bubble"
      {...props}
    />
  )
}