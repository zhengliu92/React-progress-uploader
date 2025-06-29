import React from "react";

export interface IconProps {
  size?: number | string;
  width?: number | string;
  height?: number | string;
  className?: string;
  color?: string;
  strokeWidth?: number | string;
  fill?: string;
  stroke?: string;
}

export interface IconBaseProps
  extends IconProps,
    React.SVGProps<SVGSVGElement> {
  viewBox?: string;
  children: React.ReactNode;
}

export const IconBase: React.FC<IconBaseProps> = ({
  size = 24,
  width,
  height,
  className,
  viewBox = "0 0 24 24",
  children,
  ...props
}) => {
  const iconWidth = width || size;
  const iconHeight = height || size;

  return (
    <svg
      width={iconWidth}
      height={iconHeight}
      viewBox={viewBox}
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
};

// 统一的状态图标组件
export type StatusIconType =
  | "success"
  | "error"
  | "loading"
  | "pending"
  | "cancelled";
export type StatusIconVariant = "default" | "dialog";

interface StatusIconProps extends IconProps {
  type: StatusIconType;
  variant?: StatusIconVariant;
}

export const UnifiedStatusIcon: React.FC<StatusIconProps> = ({
  type,
  variant = "default",
  size = 20,
  className,
  ...props
}) => {
  // 根据类型和变体获取默认颜色
  const getDefaultColors = () => {
    const isDialog = variant === "dialog";

    switch (type) {
      case "success":
        return {
          fill: isDialog ? "#10B981" : "#10B981",
          stroke: isDialog ? "white" : "#10B981",
        };
      case "error":
        return {
          fill: isDialog ? "#EF4444" : "#FEE2E2",
          stroke: isDialog ? "white" : "#EF4444",
        };
      case "loading":
        return {
          fill: "none",
          stroke: isDialog ? "#3B82F6" : "#3B82F6",
        };
      case "pending":
        return {
          fill: isDialog ? "#F59E0B" : "#FEF3C7",
          stroke: isDialog ? "white" : "#F59E0B",
        };
      case "cancelled":
        return {
          fill: isDialog ? "#6B7280" : "#F3F4F6",
          stroke: isDialog ? "white" : "#6B7280",
        };
      default:
        return {
          fill: "none",
          stroke: "#6B7280",
        };
    }
  };

  const defaultColors = getDefaultColors();
  const finalFill = props.fill || defaultColors.fill;
  const finalStroke = props.stroke || defaultColors.stroke;
  const strokeWidth = props.strokeWidth || 2;

  const renderIcon = () => {
    switch (type) {
      case "success":
        return (
          <>
            <circle
              cx='12'
              cy='12'
              r='10'
              fill={finalFill}
            />
            <path
              d='M8 12l2 2 4-4'
              stroke={finalStroke}
              strokeWidth={strokeWidth}
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </>
        );

      case "error":
        return (
          <>
            <circle
              cx='12'
              cy='12'
              r='10'
              fill={finalFill}
              stroke={variant === "default" ? finalStroke : undefined}
              strokeWidth={variant === "default" ? strokeWidth : undefined}
            />
            <path
              d='M15 9l-6 6M9 9l6 6'
              stroke={finalStroke}
              strokeWidth={strokeWidth}
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </>
        );

      case "loading":
        return (
          <>
            <circle
              cx='12'
              cy='12'
              r='10'
              fill='none'
              stroke='#E5E7EB'
              strokeWidth={strokeWidth}
            />
            <path
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              fill={finalStroke}
            />
          </>
        );

      case "pending":
        return (
          <>
            <circle
              cx='12'
              cy='12'
              r='10'
              fill={finalFill}
            />
            <circle
              cx='12'
              cy='12'
              r='3'
              fill={finalStroke}
            />
          </>
        );

      case "cancelled":
        return (
          <>
            <circle
              cx='12'
              cy='12'
              r='10'
              fill={finalFill}
            />
            <path
              d='M8 8h8'
              stroke={finalStroke}
              strokeWidth={strokeWidth}
              strokeLinecap='round'
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <IconBase
      size={size}
      className={className}
      fill='none'
      {...props}
    >
      {renderIcon()}
    </IconBase>
  );
};
