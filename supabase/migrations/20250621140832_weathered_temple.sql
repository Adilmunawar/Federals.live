/*
  # Fix admin user signup functionality

  1. Database Functions
    - Create `handle_new_admin_user()` function to automatically create admin_users entries
    - Create `uid()` helper function for RLS policies
    
  2. Triggers
    - Add trigger to automatically create admin_users entry on auth.users insert
    
  3. Security
    - Ensure RLS policies work correctly with the uid() function
*/

-- Create helper function to get current user ID
CREATE OR REPLACE FUNCTION uid() 
RETURNS uuid 
LANGUAGE sql 
SECURITY definer
AS $$
  SELECT auth.uid();
$$;

-- Create function to handle new admin user creation
CREATE OR REPLACE FUNCTION handle_new_admin_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer
AS $$
BEGIN
  INSERT INTO public.admin_users (id, email, full_name, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'admin',
    true
  );
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create admin_users entry when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_admin_user();

-- Ensure the update_updated_at_column function exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;