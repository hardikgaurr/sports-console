import { SportPayload } from '../../sports/models/sport.model';
export class BulkImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BulkImportError';
  }
}

function parseCsv(content: string): SportPayload[] {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    throw new BulkImportError('The CSV file is empty.');
  }

  const header = lines[0].toLowerCase();

  if (header !== 'name') {
    throw new BulkImportError('CSV must contain a single "name" column.');
  }

  return lines.slice(1).map((line) => ({
    name: line.trim(),
  }));
}

function parseJson(content: string): SportPayload[] {
  const parsed = JSON.parse(content);

  if (!Array.isArray(parsed)) {
    throw new BulkImportError('JSON must contain an array.');
  }

  return parsed.map((item) => {
    if (typeof item?.name !== 'string') {
      throw new BulkImportError('Every JSON object must contain a "name" property.');
    }

    return {
      name: item.name.trim(),
    };
  });
}

export async function parseImportFile(file: File): Promise<SportPayload[]> {
  const content = await file.text();

  const extension = file.name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'csv':
      return parseCsv(content);

    case 'json':
      return parseJson(content);

    default:
      throw new BulkImportError('Only CSV and JSON files are supported.');
  }
}
