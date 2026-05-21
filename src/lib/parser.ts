import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractTextFromFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();

  if (file.type === 'application/pdf') {
    return extractPdfText(buffer);
  } else if (
    file.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.name.endsWith('.docx')
  ) {
    return extractDocxText(buffer);
  }

  throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
}

async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  try {
    const data = await pdfParse(Buffer.from(buffer));
    if (!data.text || data.text.trim().length === 0) {
      throw new Error(
        'PDF appears to be empty or contains no extractable text'
      );
    }
    return data.text.trim();
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (errorMsg.includes('XRef')) {
      throw new Error(
        'PDF file is corrupted or not in a valid format. Please try uploading a different PDF.'
      );
    }
    throw error;
  }
}

async function extractDocxText(buffer: ArrayBuffer): Promise<string> {
  const result = await mammoth.extractRawText({
    buffer: Buffer.from(buffer),
  });
  return result.value.trim();
}
