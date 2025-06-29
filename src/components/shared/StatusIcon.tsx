import React from "react";
import { UploadProgress } from "../../hooks/useUploadQueue";
import { useUploadUI } from "../../hooks/useUploadUI";
import { StatusIconVariant } from "../../types/uploader";
import { UnifiedStatusIcon, StatusIconType } from "../Icons/IconBase";
import "./StatusIcon.css";

interface StatusIconProps {
  status: UploadProgress["status"];
  variant?: StatusIconVariant;
  className?: string;
}

export const StatusIcon: React.FC<StatusIconProps> = ({
  status,
  variant = "default",
  className,
}) => {
  const { getStatusIconType } = useUploadUI();
  const iconType = getStatusIconType(status) as StatusIconType;

  // 组合CSS类名
  const baseClassName = "status-icon";
  const variantClassName = `status-icon--${variant}`;
  const statusClassName = `status-icon--${iconType}`;
  const spinningClassName =
    iconType === "loading"
      ? variant === "dialog"
        ? "dialog-uploader-spinning"
        : "uploader-spinning"
      : "";

  const combinedClassName = [
    baseClassName,
    variantClassName,
    statusClassName,
    spinningClassName,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={combinedClassName}>
      <UnifiedStatusIcon
        type={iconType}
        variant={variant}
        className={
          variant === "dialog"
            ? `uploader-icon-dialog-${iconType}`
            : `uploader-icon-${iconType}`
        }
      />
    </div>
  );
};
