import React from "react";
import { IconBase, IconProps } from "./IconBase";

export const SuccessIcon: React.FC<IconProps> = ({
  size = 20,
  className,
  stroke = "#10B981",
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
        fill={stroke}
      />
      <path
        d='M8 12l2 2 4-4'
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </IconBase>
  );
};
