import { FileIcon, XIcon, CheckCircleIcon, AlertCircleIcon, Loader2Icon } from 'lucide-react';

interface FileAttachmentProps {
  file: File;
  onRemove: () => void;
  uploadProgress?: number;
  error?: string;
  uploaded?: boolean;
}

const FileAttachment = ({ file, onRemove, uploadProgress, error, uploaded }: FileAttachmentProps) => {
  const getFileIcon = () => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📈';
      case 'zip':
      case 'tar':
      case 'gz':
        return '📦';
      case 'json':
      case 'js':
      case 'ts':
      case 'py':
      case 'html':
      case 'css':
        return '💻';
      default:
        return '📎';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="group relative flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2">
      <span className="text-lg">{getFileIcon()}</span>

      <div className="flex-1 min-w-0">
        <div className="truncate text-sm font-medium text-foreground">{file.name}</div>
        <div className="text-xs text-muted-foreground">{formatFileSize(file.size)}</div>
      </div>

      {/* Upload status indicators */}
      {uploadProgress !== undefined && uploadProgress < 100 && !error && (
        <div className="flex items-center gap-1">
          <Loader2Icon className="h-4 w-4 animate-spin text-primary" />
          <span className="text-xs text-primary">{uploadProgress}%</span>
        </div>
      )}

      {uploaded && !error && (
        <CheckCircleIcon className="h-4 w-4 text-green-500" />
      )}

      {error && (
        <div className="flex items-center gap-1" title={error}>
          <AlertCircleIcon className="h-4 w-4 text-red-500" />
          <span className="text-xs text-red-500">Error</span>
        </div>
      )}

      {/* Remove button */}
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full p-1 text-muted-foreground opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive focus:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        aria-label={`Remove ${file.name}`}
      >
        <XIcon className="h-3 w-3" />
      </button>
    </div>
  );
};

export default FileAttachment;
