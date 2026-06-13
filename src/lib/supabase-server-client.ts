import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_REQUEST_TIMEOUT_MS } from "@/lib/supabase-errors";
import { supabaseFetch } from "@/lib/supabase-fetch";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type BuilderWithRetry = {
  retry?: (enabled: boolean) => unknown;
};

function disableRetriesOnBuilder<T extends object>(builder: T): T {
  const withRetry = builder as BuilderWithRetry;
  if (typeof withRetry.retry === "function") {
    withRetry.retry(false);
  }

  return new Proxy(builder, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (typeof value !== "function") return value;

      return (...args: unknown[]) => {
        const result = value.apply(target, args);
        if (result && typeof result === "object") {
          return disableRetriesOnBuilder(result as object);
        }
        return result;
      };
    },
  }) as T;
}

function wrapServerClient<T extends SupabaseClient>(client: T): T {
  const originalFrom = client.from.bind(client);
  client.from = ((relation: string) =>
    disableRetriesOnBuilder(originalFrom(relation))) as T["from"];

  return client;
}

const serverClientOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  db: {
    timeout: SUPABASE_REQUEST_TIMEOUT_MS,
  },
  global: {
    fetch: supabaseFetch,
  },
} as const;

/** Cliente anon para API routes — sin reintentos automáticos ni esperas largas. */
export const supabaseAnonServer = wrapServerClient(
  createClient(supabaseUrl, supabaseAnonKey, serverClientOptions),
);

/** Cliente service_role para API routes — sin reintentos automáticos ni esperas largas. */
export const supabaseAdmin = wrapServerClient(
  createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, serverClientOptions),
);
