import React from "react";
import { IconBase, IconProps } from "./IconBase";

export const ErrorIcon: React.FC<IconProps> = ({
  size = 20,
  className,
  fill = "#FEE2E2",
  stroke = "#EF4444",
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
        fill={fill}
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
