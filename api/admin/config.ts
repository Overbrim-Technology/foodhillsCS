import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isAdminRequest } from '../_auth';
import { getSupabaseAdmin } from '../_supabase';

type CatalogSource = {
  csv_url: string;
  image_base_url: string;
  enabled: boolean;
};

const requireAdmin = (request: VercelRequest, response: VercelResponse) => {
  if (!isAdminRequest(request.headers.cookie)) {
    response.status(401).json({ error: 'Admin authentication required' });
    return false;
  }
  return true;
};

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (!requireAdmin(request, response)) return;

  const supabase = getSupabaseAdmin();
  if (request.method === 'GET') {
    const { data, error } = await supabase
      .from('catalog_sources')
      .select('csv_url, image_base_url, enabled')
      .order('created_at', { ascending: true });

    if (error) return response.status(500).json({ error: error.message });
    return response.status(200).json({ sources: data || [] });
  }

  if (request.method === 'POST') {
    const sources = request.body?.sources as CatalogSource[];
    if (!Array.isArray(sources) || sources.length === 0) {
      return response.status(400).json({ error: 'At least one catalog source is required' });
    }

    const cleanedSources = sources
      .filter(source => source && typeof source.csv_url === 'string' && source.csv_url.trim())
      .map(source => ({
        csv_url: source.csv_url.trim(),
        image_base_url: typeof source.image_base_url === 'string' ? source.image_base_url.trim() : '',
        enabled: source.enabled !== false,
      }));

    if (cleanedSources.length === 0) {
      return response.status(400).json({ error: 'No valid catalog sources supplied' });
    }

    const { error: deleteError } = await supabase.from('catalog_sources').delete().neq('id', 0);
    if (deleteError) return response.status(500).json({ error: deleteError.message });

    const { error: insertError } = await supabase.from('catalog_sources').insert(cleanedSources);
    if (insertError) return response.status(500).json({ error: insertError.message });

    return response.status(200).json({ ok: true, count: cleanedSources.length });
  }

  return response.status(405).json({ error: 'Method not allowed' });
}
