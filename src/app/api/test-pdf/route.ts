import { NextRequest, NextResponse } from 'next/server';

// Use direct require to match the parser
const pdfParse = require('pdf-parse/lib/pdf-parse.js');

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  console.log('=== TEST-PDF DEBUG ===');
  console.log('File name:', file.name);
  console.log('File size:', buffer.length, 'bytes');
  console.log('File type:', file.type);

  // Check PDF header
  const header = buffer.slice(0, 8).toString();
  const headerValid = header.startsWith('%PDF');
  console.log('PDF header:', header);
  console.log('Header valid:', headerValid);

  if (!headerValid) {
    return NextResponse.json(
      {
        error: 'Not a valid PDF',
        details: {
          header: header,
          size: buffer.length,
          type: file.type,
        },
      },
      { status: 400 }
    );
  }

  // Try parsing
  try {
    console.log('Attempting pdf-parse...');
    const data = await pdfParse(buffer);

    console.log('✅ Parse successful');
    console.log('Pages:', data.numpages);
    console.log('Text length:', data.text.length);

    return NextResponse.json({
      success: true,
      filename: file.name,
      details: {
        pages: data.numpages,
        textLength: data.text.length,
        preview: data.text.slice(0, 300),
        hasText: data.text.trim().length > 0,
      },
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('❌ Parse failed:', errorMsg);

    // Try fallback extraction
    try {
      const text = buffer.toString('utf-8');
      const matches = text.match(/[^\x00-\x1F\x7F-\xFF]{4,}/g) || [];
      const readable = matches
        .filter((s) => s.includes(' ') || s.length > 8)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (readable.length > 100) {
        return NextResponse.json({
          success: true,
          fallback: true,
          filename: file.name,
          details: {
            method: 'fallback_extraction',
            textLength: readable.length,
            preview: readable.slice(0, 300),
          },
        });
      }
    } catch (e) {
      console.error('Fallback failed:', e);
    }

    return NextResponse.json(
      {
        success: false,
        filename: file.name,
        error: errorMsg,
        details: {
          size: buffer.length,
          header: header,
          fallbackAttempted: true,
        },
      },
      { status: 500 }
    );
  }
}
