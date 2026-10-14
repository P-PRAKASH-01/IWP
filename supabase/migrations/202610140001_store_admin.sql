create extension if not exists pgcrypto;

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

create or replace function public.is_store_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function public.is_store_admin() from public;
grant execute on function public.is_store_admin() to anon, authenticated;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 100),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text,
  image_url text check (image_url is null or image_url = '' or image_url ~ '^https://[^[:space:]]+'),
  parent_id uuid references public.categories (id) on delete restrict,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (parent_id is null or parent_id <> id)
);

create unique index if not exists categories_name_unique on public.categories (lower(name));

create or replace function public.is_public_category(category_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  with recursive category_ancestors(id, parent_id, is_active) as (
    select category.id, category.parent_id, category.is_active
    from public.categories category
    where category.id = category_uuid
    union
    select parent.id, parent.parent_id, parent.is_active
    from public.categories parent
    join category_ancestors child on child.parent_id = parent.id
  )
  select exists (
    select 1 from category_ancestors
    where id = category_uuid and is_active
  ) and not exists (
    select 1 from category_ancestors where not is_active
  );
$$;

revoke all on function public.is_public_category(uuid) from public;
grant execute on function public.is_public_category(uuid) to anon, authenticated;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text not null default '',
  category_id uuid not null references public.categories (id) on delete restrict,
  product_code text unique,
  image_urls text[] not null default '{}',
  image_alt text not null default '',
  sizes text[] not null default '{}',
  colors jsonb not null default '[]'::jsonb check (jsonb_typeof(colors) = 'array'),
  material text not null default '',
  specifications text not null default '',
  retail_price numeric(12, 2) check (retail_price is null or retail_price >= 0),
  wholesale_price numeric(12, 2) check (wholesale_price is null or wholesale_price >= 0),
  pricing_type text not null default 'retail' check (pricing_type in ('retail', 'wholesale', 'quote')),
  minimum_order_quantity integer check (minimum_order_quantity is null or minimum_order_quantity > 0),
  availability_status text not null default 'available' check (availability_status in ('available', 'unavailable', 'preorder')),
  is_featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (pricing_type = 'quote' or retail_price is not null or wholesale_price is not null)
);

create index if not exists products_category_id_idx on public.products (category_id);
create index if not exists products_public_listing_idx on public.products (status, is_featured, updated_at desc);
create unique index if not exists products_product_code_unique on public.products (lower(product_code)) where product_code is not null;

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null check (length(trim(customer_name)) between 1 and 120),
  phone text not null check (
    length(trim(phone)) between 5 and 40
    and phone ~ '^[+0-9(). -]+$'
    and length(regexp_replace(phone, '[^0-9]', '', 'g')) >= 5
  ),
  email text check (email is null or (length(email) <= 254 and email ~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$')),
  product_id uuid references public.products (id) on delete set null,
  product_name text not null default 'General catalogue enquiry'
    check (length(trim(product_name)) between 1 and 180),
  requested_quantity integer not null default 1 check (requested_quantity > 0),
  enquiry_type text not null default 'retail' check (enquiry_type in ('retail', 'wholesale', 'custom')),
  message text not null default '' check (length(message) <= 5000),
  status text not null default 'New' check (status in ('New', 'Contacted', 'In Progress', 'Converted', 'Closed')),
  internal_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_status_created_at_idx on public.enquiries (status, created_at desc);

create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  heading text not null check (length(trim(heading)) between 1 and 180),
  supporting_text text not null default '',
  button_label text not null default '',
  destination text not null default '',
  image_url text not null default '' check (image_url = '' or image_url ~ '^https://[^[:space:]]+'),
  image_alt text not null default '',
  is_active boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    destination = ''
    or destination ~ '^https://[^[:space:]]+'
    or (
      destination like '/%'
      and destination not like '//%'
      and position(E'\\' in destination) = 0
      and destination !~ '[[:cntrl:]]'
    )
  )
);

create table if not exists public.store_settings (
  id boolean primary key default true check (id),
  business_name text not null default 'Sri Sai Garments',
  logo_url text not null default '',
  about_text text not null default '',
  phone text not null default '' check (phone = '' or (length(phone) <= 40 and phone ~ '^[+0-9(). -]+$' and length(regexp_replace(phone, '[^0-9]', '', 'g')) >= 5)),
  whatsapp_phone text not null default '' check (whatsapp_phone = '' or (length(whatsapp_phone) <= 40 and whatsapp_phone ~ '^[+0-9(). -]+$' and length(regexp_replace(whatsapp_phone, '[^0-9]', '', 'g')) >= 5)),
  contact_email text not null default '' check (contact_email = '' or (length(contact_email) <= 254 and contact_email ~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$')),
  address text not null default '',
  map_url text not null default '' check (map_url = '' or map_url ~ '^https://[^[:space:]]+'),
  business_hours text not null default '',
  social_links jsonb not null default '{}'::jsonb check (jsonb_typeof(social_links) = 'object'),
  footer_text text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  is_public boolean not null default true,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_updated_at() from public;

do $$
declare
  table_name text;
begin
  foreach table_name in array array['categories', 'products', 'enquiries', 'banners', 'store_settings']
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', table_name);
    execute format(
      'create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      table_name
    );
  end loop;
end;
$$;

alter table public.admin_profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.enquiries enable row level security;
alter table public.banners enable row level security;
alter table public.store_settings enable row level security;

create policy "Admins can view own admin profile"
  on public.admin_profiles for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Public can view active categories"
  on public.categories for select to anon, authenticated
  using ((select public.is_public_category(id)) or (select public.is_store_admin()));
create policy "Admins manage categories"
  on public.categories for all to authenticated
  using ((select public.is_store_admin()))
  with check ((select public.is_store_admin()));

create policy "Public can view published products in active categories"
  on public.products for select to anon, authenticated
  using (
    (status = 'published' and (select public.is_public_category(category_id)))
    or (select public.is_store_admin())
  );
create policy "Admins manage products"
  on public.products for all to authenticated
  using ((select public.is_store_admin()))
  with check ((select public.is_store_admin()));

create policy "Visitors can submit enquiries"
  on public.enquiries for insert to anon, authenticated
  with check (status = 'New' and internal_notes = '');
create policy "Admins view enquiries"
  on public.enquiries for select to authenticated
  using ((select public.is_store_admin()));
create policy "Admins update enquiries"
  on public.enquiries for update to authenticated
  using ((select public.is_store_admin()))
  with check ((select public.is_store_admin()));
create policy "Admins delete enquiries"
  on public.enquiries for delete to authenticated
  using ((select public.is_store_admin()));

create policy "Public can view active banners"
  on public.banners for select to anon, authenticated
  using (is_active or (select public.is_store_admin()));
create policy "Admins manage banners"
  on public.banners for all to authenticated
  using ((select public.is_store_admin()))
  with check ((select public.is_store_admin()));

create policy "Public can view public store settings"
  on public.store_settings for select to anon, authenticated
  using (is_public or (select public.is_store_admin()));
create policy "Admins manage store settings"
  on public.store_settings for all to authenticated
  using ((select public.is_store_admin()))
  with check ((select public.is_store_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-media',
  'product-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can view product media"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'product-media');
create policy "Admins upload product media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-media' and (select public.is_store_admin()));
create policy "Admins update product media"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-media' and (select public.is_store_admin()))
  with check (bucket_id = 'product-media' and (select public.is_store_admin()));
create policy "Admins remove product media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-media' and (select public.is_store_admin()));

revoke all on public.admin_profiles, public.categories, public.products, public.enquiries, public.banners, public.store_settings from anon, authenticated;

grant select on public.categories, public.products, public.banners, public.store_settings to anon, authenticated;
grant insert, update, delete on public.categories, public.products, public.banners, public.store_settings to authenticated;
grant insert on public.enquiries to anon, authenticated;
grant select, update, delete on public.enquiries to authenticated;
grant select on public.admin_profiles to authenticated;
grant select on storage.objects to anon, authenticated;
grant insert, update, delete on storage.objects to authenticated;
