import React from "react";
import { IconBase, IconProps } from "./IconBase";

export const CancelIcon: React.FC<IconProps> = ({
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
      <circle
        cx='12'
        cy='12'
        r='10'
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <path
        d='M15 9l-6 6M9 9l6 6'
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </IconBase>
  );
};
