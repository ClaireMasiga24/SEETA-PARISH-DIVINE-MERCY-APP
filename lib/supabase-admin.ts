import { createClient } from "@supabase/supabase-js";

const MISSING_ENV_MESSAGE =
  "Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file.";

/**
 * Server-only Supabase client authenticated with the service role key.
 * Required for admin operations like `auth.admin.createUser()` and
 * `auth.admin.deleteUser()`. This must NEVER be exposed to the browser.
 *
 * Returns a stub that returns error-shaped results when env vars are
 * missing, so consuming code always handles the `{ error }` path.
 */
function createStubClient() {
  return new Proxy({} as ReturnType<typeof createClient>, {
    get: () =>
      new Proxy(() => {}, {
        get: () => (..._args: unknown[]) => ({
          error: { message: MISSING_ENV_MESSAGE },
        }),
        apply: () => ({ error: { message: MISSING_ENV_MESSAGE } }),
      }),
  });
}

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return createStubClient();
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

const client = getAdminClient();

export const supabaseAdmin = client;
