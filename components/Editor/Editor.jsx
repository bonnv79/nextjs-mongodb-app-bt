import { QuillNoSSRWrapper } from '../QuillNoSSRWrapper';
import styles from './styles.module.scss';

const defaultModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction

    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ['clean'], // remove formatting button

    ['link', 'image', 'video']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
}
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const defaultFormats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'background',
  'color',
  'font',
  'code',
  'size',
  'script',
  'align',
  'direction',
  'code-block',
  'video'
]

export default function Editor({
  className,
  placeholder,
  value,
  onChange,
  theme = 'snow',
  formats = defaultFormats,
  modules = defaultModules,
  ...props
}) {
  return (
    <QuillNoSSRWrapper
      className={`${styles.root} ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      theme={theme}
      formats={formats}
      modules={modules}
      {...props}
    />
  )
}