import { CSV_HEADERS } from '../config';
import type { Product } from '../types';

const parseCsvRows = (csvText: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = '';
  let insideQuotes = false;

  for (let index = 0; index < csvText.length; index += 1) {
    const character = csvText[index];
    const nextCharacter = csvText[index + 1];

    if (character === '"' && insideQuotes && nextCharacter === '"') {
      value += '"';
      index += 1;
    } else if (character === '"') {
      insideQuotes = !insideQuotes;
    } else if (character === ',' && !insideQuotes) {
      row.push(value.trim());
      value = '';
    } else if ((character === '\n' || character === '\r') && !insideQuotes) {
      if (character === '\r' && nextCharacter === '\n') index += 1;
      row.push(value.trim());
      if (row.some(cell => cell !== '')) rows.push(row);
      row = [];
      value = '';
    } else {
      value += character;
    }
  }

  row.push(value.trim());
  if (row.some(cell => cell !== '')) rows.push(row);
  return rows;
};

export const parseProductsCsv = (csvText: string): Product[] => {
  const rows = parseCsvRows(csvText);
  if (rows.length < 2) throw new Error('CSV file has no data rows');

  const headers = rows[0].map(header => header.toLowerCase());
  const missingHeaders = CSV_HEADERS.filter(header => !headers.includes(header));
  if (missingHeaders.length > 0) {
    throw new Error(`CSV is missing required headers: ${missingHeaders.join(', ')}`);
  }

  const products = rows.slice(1).map((values, index) => {
    const item = Object.fromEntries(
      headers.map((header, valueIndex) => [header, values[valueIndex] || ''])
    ) as Record<string, string>;
    const normalizedPrice = item.price.replace(/[^0-9.-]/g, '');

    return {
      id: item.id || `sheet-${index}`,
      name: item.name || 'Unnamed Produce',
      price: Number.parseFloat(normalizedPrice) || 0,
      category: item.category || 'General',
      unit: item.unit || 'unit',
      image_filename: item.image_filename || '',
    };
  });

  const validProducts = products.filter(product => product.name && product.price > 0);
  if (validProducts.length === 0) throw new Error('No valid products parsed from CSV');
  return validProducts;
};
