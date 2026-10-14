# Sri Sai Garments virtual shop

React 19, Vite, React Router, Tailwind CSS and Supabase Auth/PostgreSQL/Storage. The public storefront keeps its existing catalogue, product detail, wishlist, contact and WhatsApp enquiry flows. Configure Supabase to enable shared production data and the administrator panel.

## Local development

Requirements: Node.js 20.19+ (or 22.12+) and npm.

```powershell
npm ci
Copy-Item .env.example .env
npm run dev
```

Without Supabase environment values, the app runs in a clearly labelled development-preview mode. It loads the checked-in product fixtures and saves local development enquiries in the current browser only. Admin sign-in remains disabled; there is no demo password or public administrator registration. Do not use this mode for a live store.

## Supabase setup

1. Create a Supabase project and keep its project URL and public anon/publishable key available.
2. Apply [`supabase/migrations/202610140001_store_admin.sql`](./supabase/migrations/202610140001_store_admin.sql) using the Supabase SQL Editor, or link the project with the Supabase CLI and apply the migration through your normal migration workflow. The migration creates tables, indexes, constraints, timestamp triggers, RLS policies and the public-read/admin-write `product-media` bucket.
3. In Supabase Auth, disable public sign-ups. Set the permitted site/redirect URLs to the deployed storefront origin and configure SMTP/password-reset delivery before enabling password resets.
4. Create the first administrator through the Supabase dashboard's Auth user management (do not add a client-side registration route). Grant its UUID the admin role in the SQL Editor, replacing the example email:

   ```sql
   insert into public.admin_profiles (user_id, role)
   select id, 'admin'
   from auth.users
   where email = 'admin@example.com'
   on conflict (user_id) do update set role = excluded.role;
   ```

   The profile table intentionally has no client insert/update policy: only a trusted project owner can grant administrator access.
5. Put the project URL and anon/publishable key in `.env`:

   ```dotenv
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-public-anon-or-publishable-key
   ```

   Restart Vite after changing environment variables. The anon key is public configuration; **never** put a service-role/secret key in a `VITE_*` variable or frontend bundle.
6. Sign in at `/admin/login`. The first configured catalogue is intentionally empty: enter the business's actual categories, product descriptions/prices, banners and contact information through the admin UI. The checked-in sample product fixtures are not automatically copied to production.

## Admin and data model

- `/admin/login` uses Supabase email/password Auth, persisted provider sessions, role lookup through `admin_profiles`, and provider password-reset email.
- `/admin/dashboard`, `/admin/products`, `/admin/categories`, `/admin/enquiries`, `/admin/content`, and `/admin/settings` require an administrator profile. The browser check only controls navigation; PostgreSQL RLS and Storage policies enforce authorization.
- Public visitors can read published products in active categories, active categories/banners, and public store settings. They can insert validated enquiries, but cannot select customer enquiries or internal notes. Administrators can manage catalogue/content/settings and read/update enquiries.
- Product image files are restricted to JPEG, PNG, WebP and AVIF, up to 5 MB each, with a maximum of 10 product gallery images. Storage is public-read for storefront delivery and administrator-only for upload/update/delete.
- Products and categories are shared with the storefront; drafts/inactive products and inactive categories are filtered by database RLS. Homepage banners, featured products, contact details, the about text, footer details, and SEO metadata use saved store records.
- Enquiry form records are submitted to the database before WhatsApp opens. If saving fails, the form reports the failure and does not claim that a ticket was created.

### Security and operations

- Review the migration and test it in a non-production Supabase project before production use. The SQL Editor migration uses PostgreSQL constraints and RLS; do not disable RLS.
- Supabase's API platform limits still apply, but this browser-based public enquiry insert does not implement a custom per-IP abuse throttle or CAPTCHA. Before promoting a public/high-traffic deployment, add a server-side Edge Function or equivalent abuse controls and consider CAPTCHA/honeypot protection.
- Keep the administrator list minimal, enable strong unique passwords and MFA in the Supabase project where available, and regularly review Auth users and `admin_profiles`.
- Back up PostgreSQL using Supabase's backup/PITR options for the selected plan. Export product/customer records only to a protected location. Include the Storage bucket in media-retention/backup planning; database backups alone do not copy uploaded files.
- Public Storage object URLs are intended for catalogue assets, not private customer uploads. Never upload customer documents or private files to `product-media`.

## Validation

Run the project checks:

```powershell
npm run lint
npm run build
```

No automated test suite or configured Supabase credentials are present in this repository. Consequently live authentication, role denial, RLS, database migrations, storage upload/removal, enquiry persistence, and responsive browser interaction must still be verified against a configured test project; do not treat a successful local build as proof of those integration checks.
