import React from "react";
import { IconBase, IconProps } from "./IconBase";

export const UploadButtonIcon: React.FC<IconProps> = ({
  size = 16,
  className,
  stroke = "currentColor",
  strokeWidth = 2,
  ...props
}) => {
  return (
    <IconBase
      size={size}
      className={className}
      fill='none'
      {...props}
    >
      <path
        d='M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12'
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </IconBase>
  );
};
