// Use direct require to avoid pdf-parse's broken test on import
const pdfParse = require('pdf-parse/lib/pdf-parse.js');
const mammoth = require('mammoth');

export async function extractTextFromFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'pdf' || file.type === 'application/pdf') {
    return extractPdfText(buffer, file.name);
  } else if (
    ext === 'docx' ||
    file.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return extractDocxText(buffer, file.name);
  } else if (ext === 'txt') {
    return buffer.toString('utf-8');
  }

  throw new Error(
    `Unsupported file type: .${ext}. Please upload PDF, DOCX, or TXT files.`
  );
}

async function extractPdfText(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  try {
    // Validate it's a real PDF before parsing
    const header = buffer.slice(0, 4).toString();
    if (header !== '%PDF') {
      throw new Error(
        `Invalid PDF header: ${fileName} does not appear to be a valid PDF file`
      );
    }

    // Try pdf-parse with direct lib import (avoids Next.js initialization bug)
    const data = await pdfParse(buffer);

    if (!data.text || data.text.trim().length === 0) {
      throw new Error('PDF contains no extractable text');
    }

    if (data.text.trim().length < 50) {
      throw new Error(
        'PDF text is too short to be a valid resume - may be a scanned image'
      );
    }

    return data.text.trim();
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`pdf-parse failed for ${fileName}:`, errorMsg);

    // Fallback: try to extract raw text from PDF bytes
    try {
      const text = buffer.toString('utf-8');
      // Extract readable strings from PDF binary (4+ chars, printable)
      const matches = text.match(/[^\x00-\x1F\x7F-\xFF]{4,}/g) || [];
      const readable = matches
        .filter((s) => s.includes(' ') || s.length > 8)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (readable.length > 100) {
        console.log(
          `Using fallback text extraction for ${fileName} (${readable.length} chars)`
        );
        return readable;
      }
    } catch (e) {
      console.error(`Fallback extraction failed for ${fileName}:`, e);
    }

    // If all parsing fails, provide helpful error message
    if (errorMsg.includes('Invalid')) {
      throw new Error(
        `Could not parse PDF: ${fileName}. It may be a scanned image or corrupted. Please upload a text-based PDF.`
      );
    }

    throw new Error(
      `Could not parse PDF: ${fileName}. ${errorMsg.split('\n')[0]}`
    );
  }
}

async function extractDocxText(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value.trim();
    if (!text || text.length === 0) {
      throw new Error(`DOCX file contains no text: ${fileName}`);
    }
    return text;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    throw new Error(`Could not parse DOCX: ${fileName}. ${errorMsg}`);
  }
}
