'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useStore } from './store'; // Adjust the path

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');

  const filePath = useStore((state) => state.filePath);
  const setFilePath = useStore((state) => state.setFilePath);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    try {
      const data = new FormData();
      data.set('file', file);

      const res = await fetch('/api/parse/upload-pdf', {
        method: 'POST',
        body: data
      });

      if (!res.ok) throw new Error(await res.text());

      const result = await res.json();
      if (result.success) {
        setFilePath(result.filePath);
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  const extractTextFromPDF = async () => {
    if (!filePath) return;

    try {
      const res = await fetch(`/api/parse/upload-pdf?path=${encodeURIComponent(filePath)}`);
      if (!res.ok) throw new Error(await res.text());

      const result = await res.json();
      if (result.success) {
        setExtractedText(result.text);
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="file"
          name="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <input type="submit" value="Upload" />
      </form>
      <Button onClick={extractTextFromPDF}>Extract Text</Button>
      <div>
        <h3>Extracted Text:</h3>
        <pre>{extractedText}</pre>
      </div>
    </div>
  );
}
