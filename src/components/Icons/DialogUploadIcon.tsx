import React from "react";
import { IconBase, IconProps } from "./IconBase";

export const DialogUploadIcon: React.FC<IconProps> = ({
  size = 20,
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
      stroke={stroke}
      {...props}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={strokeWidth}
        d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
      />
    </IconBase>
  );
};
