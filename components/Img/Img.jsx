/* eslint-disable @next/next/no-img-element */
const Img = ({ style, className, src, alt, width, height, ...props }) => {
  return (
    <img
      style={style}
      className={className}
      src={src}
      alt={alt}
      width={width}
      height={height}
      {...props}
    />
  );
};

export default Img;
