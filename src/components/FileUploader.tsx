import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Loader2, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";
import { extractTextFromFile } from "../lib/fileProcessor";

interface FileUploaderProps {
  onTextExtracted: (text: string) => void;
  isProcessing: boolean;
}

export function FileUploader({ onTextExtracted, isProcessing }: FileUploaderProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setError(null);
      try {
        const text = await extractTextFromFile(file);
        onTextExtracted(text);
      } catch (err: any) {
        setError(err.message || "Failed to process file.");
      }
    },
    [onTextExtracted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    multiple: false,
    disabled: isProcessing,
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={cn(
          "relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-12 flex flex-col items-center justify-center gap-4",
          isDragActive
            ? "border-blue-500 bg-blue-50/50"
            : "border-gray-300 hover:border-gray-400 bg-white/50",
          isProcessing && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          {isProcessing ? (
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-gray-500" />
          )}
        </div>

        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">
            {isProcessing ? "Processing Document..." : "Upload Contract"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Drag & drop your PDF, DOCX, or TXT file here
          </p>
        </div>

        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
            <FileText className="w-3.5 h-3.5" /> PDF
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
            <FileText className="w-3.5 h-3.5" /> DOCX
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
            <FileText className="w-3.5 h-3.5" /> TXT
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
