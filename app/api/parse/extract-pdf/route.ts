import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import { readFile } from 'fs/promises';

function isError(err: any): err is Error {
  return err instanceof Error;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url, 'http://localhost'); // Base URL is a placeholder
  const filePath = url.searchParams.get('path');
  
  if (!filePath) {
    return NextResponse.json({ success: false, message: 'File path not provided' });
  }

  try {
    const buffer = await readFile(filePath);
    const extractedText = await pdf(buffer);
    return NextResponse.json({ success: true, text: extractedText.text });
  } catch (e) {
    if (isError(e)) {
      return NextResponse.json({ success: false, message: e.message });
    } else {
      return NextResponse.json({ success: false, message: 'An unknown error occurred' });
    }
  }
}
