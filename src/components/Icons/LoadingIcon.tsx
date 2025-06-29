import React from "react";
import { IconBase, IconProps } from "./IconBase";

export const LoadingIcon: React.FC<IconProps> = ({
  size = 20,
  className,
  stroke = "#3B82F6",
  strokeWidth = 2,
  ...props
}) => {
  return (
    <IconBase
      size={size}
      className={className}
      {...props}
    >
      <circle
        cx='12'
        cy='12'
        r='10'
        fill='none'
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <path
        d='M12 2v6M12 16v6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M16 12h6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24'
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap='round'
      />
    </IconBase>
  );
};
