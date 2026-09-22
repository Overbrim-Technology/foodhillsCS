# FoodHills Camp Shop

## Local development

```powershell
npm install
npm run dev
```

Open `http://localhost:5173/` for the storefront and `http://localhost:5173/admin` for vendor configuration.

## Production configuration

The storefront does not accept Google Sheet URLs. Vendor sources are stored in Supabase and can only be changed through the password-protected admin portal.

1. Create a free Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. In Supabase, publish each vendor sheet as CSV and ensure Drive images are shared as `Anyone with the link`.
4. Add these server-only environment variables to the deployment:
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
   - `SUPABASE_URL`
   - `SUPABASE_SECRET_KEY` (the `sb_secret_...` key from Supabase)
5. Deploy with Vercel using `npm run build` and `dist` as the output directory.
6. Open `/admin`, sign in, and add one published CSV URL per vendor.

The repository includes `vercel.json` so the client-side `/admin` route serves the Vite app correctly. `/api/*` remains mapped to the serverless backend functions.

The Supabase secret key must only exist in server environment variables. It must never be put in frontend code, a `VITE_` variable, source control, or the browser. Do not use the publishable key for these server-side admin queries because the catalog sources table has no public read policy.
