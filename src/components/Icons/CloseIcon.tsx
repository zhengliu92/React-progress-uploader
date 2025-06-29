import React from "react";
import { IconBase, IconProps } from "./IconBase";

export const CloseIcon: React.FC<IconProps> = ({
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
      stroke={stroke}
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <line
        x1='18'
        y1='6'
        x2='6'
        y2='18'
        strokeWidth={strokeWidth}
      />
      <line
        x1='6'
        y1='6'
        x2='18'
        y2='18'
        strokeWidth={strokeWidth}
      />
    </IconBase>
  );
};
