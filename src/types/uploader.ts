import { UploadOptions, UploadResult, UploadProgress } from "../hooks";

// 基础上传配置接口
export interface BaseUploaderConfig {
  multiple?: boolean;
  acceptedFileTypes?: string[];
  maxFiles?: number;
  maxFileSize?: number;
  maxConcurrent?: number;
}

// 上传回调接口
export interface UploaderCallbacks {
  onUpload?: (successfulFiles: File[], results?: UploadResult[]) => void;
  onUploadProgress?: (progress: UploadProgress[]) => void;
  onFileSelect?: (files: FileList) => void;
}

// 完整的上传器Props（包含上传功能）
export interface UploaderWithUploadProps
  extends BaseUploaderConfig,
    UploaderCallbacks {
  uploadFunction: (options: UploadOptions) => Promise<UploadResult>;
}

// 只选择文件的Props（不包含上传功能）
export interface FilePickerProps extends BaseUploaderConfig, UploaderCallbacks {
  uploadFunction?: never;
}

// 状态图标类型
export type StatusIconVariant = "default" | "dialog";

// 上传器模式
export type UploaderMode = "inline" | "dialog";
