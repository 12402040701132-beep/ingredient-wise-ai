import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, X, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  isProcessing?: boolean;
  previewUrl?: string;
  onClear?: () => void;
}

export function ImageUpload({ onImageSelect, isProcessing, previewUrl, onClear }: ImageUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onImageSelect(acceptedFiles[0]);
      }
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.heic'],
    },
    maxFiles: 1,
    noClick: !!previewUrl,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  if (previewUrl) {
    return (
      <div className="relative w-full max-w-xs mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-xl overflow-hidden shadow-soft border border-border"
        >
          <img
            src={previewUrl}
            alt="Uploaded food label"
            className="w-full h-48 object-cover"
          />
          {isProcessing && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">Reading label...</span>
              </div>
            </div>
          )}
        </motion.div>
        {!isProcessing && onClear && (
          <button
            onClick={onClear}
            className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md hover:bg-destructive/90 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  const dropzoneProps = getRootProps();
  
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        'relative cursor-pointer rounded-2xl border-2 border-dashed p-8 transition-all duration-300',
        isDragActive
          ? 'border-primary bg-primary/5 shadow-glow'
          : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5'
      )}
      onClick={dropzoneProps.onClick}
      onKeyDown={dropzoneProps.onKeyDown}
      role={dropzoneProps.role}
      tabIndex={dropzoneProps.tabIndex}
    >
      <div
        onDragEnter={dropzoneProps.onDragEnter}
        onDragOver={dropzoneProps.onDragOver}
        onDragLeave={dropzoneProps.onDragLeave}
        onDrop={dropzoneProps.onDrop}
        className="absolute inset-0"
      />
      <input {...getInputProps()} />
      <AnimatePresence mode="wait">
        <motion.div
          key={isDragActive ? 'active' : 'idle'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <motion.div
            className={cn(
              'w-16 h-16 rounded-2xl flex items-center justify-center transition-colors',
              isDragActive ? 'gradient-hero' : 'bg-primary/10'
            )}
            animate={isDragActive ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5, repeat: isDragActive ? Infinity : 0 }}
          >
            {isDragActive ? (
              <ImageIcon className="w-8 h-8 text-primary-foreground" />
            ) : (
              <Upload className="w-8 h-8 text-primary" />
            )}
          </motion.div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">
              {isDragActive ? 'Drop your image here' : 'Upload food label'}
            </p>
            <p className="text-sm text-muted-foreground">
              Drag & drop or click to browse
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Camera className="w-3 h-3" />
            <span>Supports JPG, PNG, WEBP</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
