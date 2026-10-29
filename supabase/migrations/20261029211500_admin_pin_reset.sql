-- Function to allow administrators to reset their password using a Master Recovery PIN
-- without requiring an email confirmation flow.

create extension if not exists pgcrypto;

create or replace function public.reset_admin_password_with_pin(
  p_email text,
  p_pin text,
  p_new_password text
)
returns json
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user_id uuid;
  -- Default Master Recovery PIN (can be customized)
  v_master_pin text := 'SriSaiAdmin@2026';
begin
  -- 1. Validate Master PIN
  if trim(p_pin) <> v_master_pin then
    return json_build_object('success', false, 'message', 'Invalid Master Recovery PIN.');
  end if;

  -- 2. Validate password length
  if length(p_new_password) < 8 then
    return json_build_object('success', false, 'message', 'Password must be at least 8 characters long.');
  end if;

  -- 3. Look up user by email
  select id into v_user_id from auth.users where lower(email) = lower(trim(p_email));
  if v_user_id is null then
    return json_build_object('success', false, 'message', 'Administrator account not found with this email.');
  end if;

  -- 4. Verify user exists in admin_profiles
  if not exists (select 1 from public.admin_profiles where user_id = v_user_id) then
    return json_build_object('success', false, 'message', 'This account is not authorized as an administrator.');
  end if;

  -- 5. Update encrypted password directly in auth.users
  update auth.users
  set encrypted_password = crypt(p_new_password, gen_salt('bf')),
      updated_at = now()
  where id = v_user_id;

  return json_build_object('success', true, 'message', 'Password updated successfully! You can now log in.');
end;
$$;

revoke all on function public.reset_admin_password_with_pin(text, text, text) from public;
grant execute on function public.reset_admin_password_with_pin(text, text, text) to anon, authenticated;
