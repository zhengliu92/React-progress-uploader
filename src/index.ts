export { Uploader } from "./components/Uploader/Uploader";
export { DialogUploader } from "./components/DialogUploader/DialogUploader";
export { UploadButton } from "./components/UploadButton/UploadButton";

// 共享组件
export { StatusIcon, FileList } from "./components/shared";
export { UploadProgress as UploadProgressComponent } from "./components/shared";

// 图标组件
export { UnifiedStatusIcon } from "./components/Icons/IconBase";
export type {
  StatusIconType,
  StatusIconVariant as IconVariant,
} from "./components/Icons/IconBase";

// Hooks
export {
  useDragAndDrop,
  useFileSelection,
  useUploadQueue,
  useUploadUI,
  useUploaderCore,
  type UploadOptions,
  type UploadResult,
  type UploadProgress,
} from "./hooks";

// 工具函数
export {
  validateFileType,
  validateFileSize,
  validateFileCount,
  filterValidFiles,
  formatFileSize,
  getAcceptValue,
  getSupportedTypesText,
  createFileList,
  isDuplicateFile,
  type FileValidationResult,
  DEFAULT_MAX_FILE_SIZE,
  DEFAULT_MAX_FILES,
  FILE_SIZE_UNITS,
} from "./components/Uploader/utils";

// 类型定义
export type {
  BaseUploaderConfig,
  UploaderCallbacks,
  UploaderWithUploadProps,
  FilePickerProps,
  StatusIconVariant,
  UploaderMode,
} from "./types/uploader";
