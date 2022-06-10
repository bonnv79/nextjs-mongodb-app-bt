import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})

export default function QuillNoSSRWrapper({ ...props }) {
  return (
    <ReactQuillNoSSRWrapper
      {...props}
    />
  )
}