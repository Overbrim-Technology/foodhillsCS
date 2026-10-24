import { parseProductsCsv } from './csv';
import type { Product } from '../types';

export const loadCatalog = async (urlInput: string): Promise<{ products: Product[] }> => {
  if (urlInput === '/api/catalog') {
    const response = await fetch(urlInput);
    if (!response.ok) throw new Error(`Catalog API error: ${response.status}`);
    return await response.json();
  }

  const urls = urlInput
    .split(/\r?\n/)
    .map(url => url.trim())
    .filter(Boolean);

  if (urls.length === 0) throw new Error('No catalog sources are configured');

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
  if (products.length === 0) throw new Error('No products could be loaded from the configured catalog sources');
  return { products };
};
