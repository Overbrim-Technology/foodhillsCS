import { MOCK_DATA } from '../config';
import { parseProductsCsv } from './csv';
import type { Product } from '../types';

export const loadCatalog = async (urlInput: string): Promise<{ products: Product[]; usingMock: boolean }> => {
  if (urlInput === '/api/catalog') {
    try {
      const response = await fetch(urlInput);
      if (!response.ok) throw new Error(`Catalog API error: ${response.status}`);
      return response.json();
    } catch (error) {
      console.warn('Catalog API unavailable, using demo data:', error);
      return { products: MOCK_DATA, usingMock: true };
    }
  }

  const urls = urlInput
    .split(/\r?\n/)
    .map(url => url.trim())
    .filter(Boolean);

  if (urls.length === 0) return { products: MOCK_DATA, usingMock: true };

  const results = await Promise.all(urls.map(async (url, sourceIndex) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const products = parseProductsCsv(await response.text());

      // Keep product IDs unique when vendors reuse IDs such as "1", "2", and "3".
      return products.map(product => ({
        ...product,
        id: `${sourceIndex}-${product.id}`,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown catalog error';
      console.warn(`Failed to load vendor sheet ${sourceIndex + 1}:`, message);
      return [];
    }
  }));

  const products = results.flat();
  return products.length > 0
    ? { products, usingMock: false }
    : { products: MOCK_DATA, usingMock: true };
};
