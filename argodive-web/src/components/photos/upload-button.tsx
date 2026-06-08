'use client';

import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, X } from 'lucide-react';

type UploadButtonProps = {
  onUploadComplete?: (result: { publicId: string; secureUrl: string }) => void;
  onError?: (error: string) => void;
};

export function UploadButton({ onUploadComplete, onError }: UploadButtonProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      onError?.('Only image files are allowed');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const { uploadInspectionImage } = await import('@/app/actions/cloudinary');
      const result = await uploadInspectionImage(formData);

      if (result.success && result.publicId && result.secureUrl) {
        onUploadComplete?.({ publicId: result.publicId, secureUrl: result.secureUrl });
        setPreview(null);
      } else {
        onError?.(result.error || 'Upload failed');
      }
    } catch {
      onError?.('Upload failed. Check your Cloudinary configuration.');
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete, onError]);

  const handleFile = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="relative">
      <input
        type="file"
        id="image-upload"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />

      {preview ? (
        <div className="relative rounded-lg overflow-hidden border">
          <img
            src={preview}
            alt="Preview"
            className="h-24 w-24 object-cover"
          />
          <button
            onClick={() => setPreview(null)}
            className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
          >
            <X className="h-3 w-3" />
          </button>
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        <label
          htmlFor="image-upload"
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`flex cursor-pointer items-center gap-2 rounded-md border-2 border-dashed px-4 py-6 text-sm transition-colors ${
            dragOver
              ? 'border-ocean bg-ocean/5'
              : 'border-muted-foreground/25 hover:border-ocean/50 hover:bg-ocean/5'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-ocean" />
              <span className="text-muted-foreground">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 text-ocean" />
              <span className="text-muted-foreground">
                Drop image here or <span className="text-ocean underline underline-offset-2">browse</span>
              </span>
            </>
          )}
        </label>
      )}
    </div>
  );
}

export function UploadDialogButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <Upload className="mr-1 h-4 w-4" /> Upload
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-md rounded-xl bg-card p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Upload Inspection Photo</h2>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <UploadButton
              onUploadComplete={(result) => {
                setOpen(false);
                window.location.reload();
              }}
              onError={(error) => alert(error)}
            />
            <p className="mt-3 text-xs text-muted-foreground">
              Supported formats: JPEG, PNG, WebP. Max 10MB.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
