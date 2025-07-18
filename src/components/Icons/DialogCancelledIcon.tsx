import React from "react";
import { IconBase, IconProps } from "./IconBase";

export const DialogCancelledIcon: React.FC<IconProps> = ({
  size = 20,
  className,
  fill = "#FEF3C7",
  stroke = "#F59E0B",
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
        d='M8 12h8'
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap='round'
      />
    </IconBase>
  );
};
