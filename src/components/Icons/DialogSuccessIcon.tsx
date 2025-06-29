import React from "react";
import { IconBase, IconProps } from "./IconBase";

export const DialogSuccessIcon: React.FC<IconProps> = ({
  size = 20,
  className,
  fill = "#10B981",
  stroke = "white",
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
