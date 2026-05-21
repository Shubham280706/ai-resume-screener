// This script creates a sample PDF using a simple approach
// You can run: node generate-sample-pdf.js

const fs = require('fs');

// Simple PDF generation using text + basic PDF structure
const resumeText = fs.readFileSync('./sample-resume.txt', 'utf-8');

// Basic PDF structure (very simplified)
let pdf = '%PDF-1.4\n';
pdf += '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
pdf += '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';

// Create content stream with text
const lines = resumeText.split('\n');
let yPosition = 750;
let contentStream = 'BT\n/F1 12 Tf\n50 ' + yPosition + ' Td\n';

lines.forEach((line) => {
  if (line.trim()) {
    const escapedLine = line
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');
    contentStream += '(' + escapedLine + ') Tj\n';
    contentStream += '0 -15 Td\n';
    yPosition -= 15;
  } else {
    contentStream += '0 -10 Td\n';
    yPosition -= 10;
  }
});

contentStream += 'ET\n';

const streamLength = contentStream.length;
pdf += '4 0 obj\n<< /Length ' + streamLength + ' >>\nstream\n';
pdf += contentStream;
pdf += 'endstream\nendobj\n';

pdf += '3 0 obj\n';
pdf += '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> >>\n';
pdf += 'endobj\n';

pdf += 'xref\n';
pdf += '0 5\n';
pdf += '0000000000 65535 f\n';
pdf += '0000000009 00000 n\n';
pdf += '0000000058 00000 n\n';
pdf += '0000000115 00000 n\n';
pdf += '0000000' + (300 + streamLength).toString().padStart(3, '0') + ' 00000 n\n';

pdf += 'trailer\n<< /Size 5 /Root 1 0 R >>\n';
pdf += 'startxref\n';
pdf += (pdf.length - 20) + '\n';
pdf += '%%EOF\n';

fs.writeFileSync('./sample-resume.pdf', pdf);
console.log('✅ sample-resume.pdf created successfully!');
console.log('You can now upload this file in the app to test the resume screening.');
