import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getImageUrl } from '../src/catalog/images';
import { parseProductsCsv } from '../src/catalog/csv';
import { getSupabaseAdmin } from './_supabase';

export default async function handler(_request: VercelRequest, response: VercelResponse) {
  try {
    const supabase = getSupabaseAdmin();
    const { data: sources, error } = await supabase
      .from('catalog_sources')
      .select('csv_url, image_base_url')
      .eq('enabled', true)
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);

    const results = await Promise.all((sources || []).map(async (source, sourceIndex) => {
      try {
        const csvResponse = await fetch(source.csv_url);
        if (!csvResponse.ok) throw new Error(`HTTP ${csvResponse.status}`);
        const products = parseProductsCsv(await csvResponse.text());
        return products.map(product => ({
          ...product,
          id: `${sourceIndex}-${product.id}`,
          image_filename: getImageUrl(product.image_filename, product.name, source.image_base_url || ''),
        }));
      } catch (sourceError) {
        console.error(`Vendor source ${sourceIndex + 1} failed`, sourceError);
        return [];
      }
    }));

    const products = results.flat();
    response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return response.status(200).json({ products, usingMock: false });
  } catch (error) {
    console.error('Catalog API failed', error);
    return response.status(500).json({ error: 'Catalog is temporarily unavailable' });
  }
}
