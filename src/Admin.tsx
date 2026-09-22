import { FormEvent, useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, LockKeyhole, Plus, Save, Trash2 } from 'lucide-react';

type CatalogSource = {
  csv_url: string;
  image_base_url: string;
  enabled: boolean;
};

const emptySource = (): CatalogSource => ({ csv_url: '', image_base_url: '', enabled: true });

export default function Admin() {
  const [password, setPassword] = useState('');
  const [sources, setSources] = useState<CatalogSource[]>([emptySource()]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadSources = async () => {
    const response = await fetch('/api/admin/config', { credentials: 'include' });
    if (!response.ok) throw new Error('Admin session expired');
    const data = await response.json();
    setSources(data.sources.length > 0 ? data.sources : [emptySource()]);
  };

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });
      if (!response.ok) throw new Error('Invalid password');
      await loadSources();
      setIsAuthenticated(true);
      setPassword('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSources().then(() => setIsAuthenticated(true)).catch(() => undefined);
  }, []);

  const saveSources = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ sources }),
      });
      if (!response.ok) throw new Error((await response.json()).error || 'Unable to save sources');
      setMessage('Vendor sources saved. The storefront will use them on its next refresh.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save sources');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <form onSubmit={login} className="bg-white w-full max-w-sm rounded-2xl border border-stone-200 shadow-xl p-6">
          <div className="flex items-center gap-3 text-emerald-800 mb-6">
            <LockKeyhole size={24} />
            <h1 className="text-xl font-black">FoodHills Admin</h1>
          </div>
          <label className="block text-sm font-semibold text-stone-700 mb-2" htmlFor="admin-password">Admin password</label>
          <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} className="w-full border border-stone-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
          {message && <p className="text-sm text-rose-600 mt-3">{message}</p>}
          <button disabled={isLoading} className="w-full mt-5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold rounded-lg py-2.5">{isLoading ? 'Signing in...' : 'Sign in'}</button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-100 text-stone-800 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-emerald-800 font-semibold mb-6"><ArrowLeft size={16} /> Back to storefront</a>
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xl p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div><p className="text-xs uppercase tracking-wider text-emerald-700 font-bold">Protected configuration</p><h1 className="text-2xl font-black text-stone-900">Vendor catalogs</h1></div>
            <LockKeyhole className="text-emerald-700" size={24} />
          </div>
          <p className="text-sm text-stone-500 mb-6">Only published CSV URLs belong here. They are stored server-side and are never sent to public visitors.</p>
          <form onSubmit={saveSources} className="space-y-4">
            {sources.map((source, index) => (
              <div key={index} className="border border-stone-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between"><span className="font-bold text-sm">Vendor {index + 1}</span>{sources.length > 1 && <button type="button" onClick={() => setSources(current => current.filter((_, itemIndex) => itemIndex !== index))} className="text-rose-600" aria-label={`Remove vendor ${index + 1}`}><Trash2 size={17} /></button>}</div>
                <input type="url" required placeholder="Published Google Sheet CSV URL" value={source.csv_url} onChange={event => setSources(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, csv_url: event.target.value } : item))} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <input type="url" placeholder="Optional image base URL containing {filename}" value={source.image_base_url} onChange={event => setSources(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, image_base_url: event.target.value } : item))} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            ))}
            <button type="button" onClick={() => setSources(current => [...current, emptySource()])} className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800"><Plus size={17} /> Add vendor</button>
            {message && <p className="flex items-center gap-2 text-sm text-emerald-700"><CheckCircle size={16} /> {message}</p>}
            <button disabled={isLoading} className="w-full inline-flex justify-center items-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold rounded-lg py-3"><Save size={17} /> {isLoading ? 'Saving...' : 'Save vendor catalogs'}</button>
          </form>
        </div>
      </div>
    </main>
  );
}
