import { createClient, SupabaseClient } from "@supabase/supabase-js";

const MISSING_ENV_MESSAGE =
  "Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.";

/**
 * Creates a proxy that returns error-shaped results from every method call.
 * Used when the environment variables are missing — pages that consume the
 * client handle the `{ error }` response already, so they'll show a friendly
 * message instead of crashing.
 */
function createStubClient(): SupabaseClient {
  const stub = (_target: object, _prop: string | symbol) => {
    // Return a function that returns the error
    return (..._args: unknown[]) => ({
      error: { message: MISSING_ENV_MESSAGE },
    });
  };

  return new Proxy({} as SupabaseClient, {
    get: (_target, prop) => {
      if (prop === "then" || prop === "catch" || prop === "finally") {
        return undefined;
      }
      // Return a nested proxy so `supabase.auth.resetPasswordForEmail()`
      // and `supabase.auth.updateUser()` both produce error results.
      return new Proxy(() => {}, {
        get: stub,
        apply: (_fn, _this, args) => ({
          error: { message: MISSING_ENV_MESSAGE },
        }),
      });
    },
  });
}

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!client) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return createStubClient();
    }

    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}

/**
 * Lazy Supabase client — the underlying `createClient` is not called until
 * the first property access (e.g. `supabase.auth`). If the environment
 * variables are missing, a stub client is returned instead of throwing,
 * so pages show a friendly error message rather than crashing.
 */
export const supabase = new Proxy<SupabaseClient>({} as SupabaseClient, {
  get(_target, prop) {
    return getClient()[prop as keyof SupabaseClient];
  },
});
