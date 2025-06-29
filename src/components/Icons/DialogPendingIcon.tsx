import React from "react";
import { IconBase, IconProps } from "./IconBase";

export const DialogPendingIcon: React.FC<IconProps> = ({
  size = 20,
  className,
  fill = "#F3F4F6",
  stroke = "#9CA3AF",
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
        d='M12 6v6l4 2'
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </IconBase>
  );
};
