// 常量定义
export const FILE_SIZE_UNITS = ["Bytes", "KB", "MB", "GB"] as const;
export const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const DEFAULT_MAX_FILES = 10;

// 文件类型验证结果
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

// 标准化文件类型
const normalizeFileType = (type: string): string => {
  const normalized = type.toLowerCase().trim();
  return normalized.startsWith(".") ? normalized : `.${normalized}`;
};

// 验证单个文件类型
export const validateFileType = (
  file: File,
  acceptedFileTypes?: string[]
): FileValidationResult => {
  if (
    !acceptedFileTypes ||
    !Array.isArray(acceptedFileTypes) ||
    acceptedFileTypes.length === 0
  ) {
    return { isValid: true };
  }

  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  const normalizedTypes = acceptedFileTypes.map(normalizeFileType);

  const isValid = normalizedTypes.some((type) => {
    // 检查文件扩展名
    if (fileName.endsWith(type)) {
      return true;
    }

    // 检查MIME类型（去掉点号）
    const mimeType = type.slice(1);
    if (fileType.includes(mimeType)) {
      return true;
    }

    return false;
  });

  if (!isValid) {
    return {
      isValid: false,
      error: `文件 "${
        file.name
      }" 的类型不被支持。支持的类型：${acceptedFileTypes.join(", ")}`,
    };
  }

  return { isValid: true };
};

// 验证文件大小
export const validateFileSize = (
  file: File,
  maxFileSize?: number
): FileValidationResult => {
  if (!maxFileSize || file.size <= maxFileSize) {
    return { isValid: true };
  }

  const sizeMB = (maxFileSize / 1024 / 1024).toFixed(1);
  return {
    isValid: false,
    error: `文件 "${file.name}" 大小为 ${formatFileSize(
      file.size
    )}，超过了 ${sizeMB}MB 的限制`,
  };
};

// 验证文件总数
export const validateFileCount = (
  currentCount: number,
  newFilesCount: number,
  maxFiles: number
): FileValidationResult => {
  const totalFiles = currentCount + newFilesCount;
  if (totalFiles <= maxFiles) {
    return { isValid: true };
  }

  return {
    isValid: false,
    error: `最多只能选择 ${maxFiles} 个文件，当前已选择 ${currentCount} 个，尝试添加 ${newFilesCount} 个`,
  };
};

// 过滤有效文件（不再使用alert）
export const filterValidFiles = (
  files: FileList,
  acceptedFileTypes?: string[]
): { validFiles: File[]; errors: string[] } => {
  const validFiles: File[] = [];
  const errors: string[] = [];

  Array.from(files).forEach((file) => {
    const typeValidation = validateFileType(file, acceptedFileTypes);
    if (typeValidation.isValid) {
      validFiles.push(file);
    } else if (typeValidation.error) {
      errors.push(typeValidation.error);
    }
  });

  return { validFiles, errors };
};

// 格式化文件大小
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));

  return `${size} ${FILE_SIZE_UNITS[i]}`;
};

// 生成 accept 属性值
export const getAcceptValue = (
  acceptedFileTypes?: string[]
): string | undefined => {
  if (
    !acceptedFileTypes ||
    !Array.isArray(acceptedFileTypes) ||
    acceptedFileTypes.length === 0
  ) {
    return undefined;
  }

  return acceptedFileTypes.map(normalizeFileType).join(",");
};

// 生成支持的文件类型显示文本
export const getSupportedTypesText = (acceptedFileTypes?: string[]): string => {
  if (
    !acceptedFileTypes ||
    !Array.isArray(acceptedFileTypes) ||
    acceptedFileTypes.length === 0
  ) {
    return "支持任何文件格式";
  }

  const types = acceptedFileTypes.map(normalizeFileType).join(", ");

  return `支持的文件格式：${types}`;
};

// 创建模拟的 FileList
export const createFileList = (files: File[]): FileList => {
  const dataTransfer = new DataTransfer();
  files.forEach((file) => dataTransfer.items.add(file));
  return dataTransfer.files;
};

// 检查文件是否重复
export const isDuplicateFile = (file: File, existingFiles: File[]): boolean => {
  return existingFiles.some(
    (existingFile) =>
      existingFile.name === file.name &&
      existingFile.size === file.size &&
      existingFile.lastModified === file.lastModified
  );
};
