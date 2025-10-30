// components/ExtractedTextModal.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ExtractedTextModalProps {
  open: boolean;
  onClose: () => void;
  extractedText: string | null;
  title?: string;
}

export default function ExtractedTextModal({
  open,
  onClose,
  extractedText,
  title = "Extracted Text Preview",
}: ExtractedTextModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="p-4 bg-gray-50 rounded-md text-sm whitespace-pre-wrap max-h-[400px] overflow-y-auto">
          {extractedText || "No text extracted."}
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
