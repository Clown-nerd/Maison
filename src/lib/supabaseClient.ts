import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type DataSourceMode = 'auto' | 'sample' | 'supabase';

export interface SupabaseEnvConfig {
  url: string;
  anonKey: string;
  dataSource: DataSourceMode;
}

type EnvRecord = Record<string, string | undefined>;

function readRuntimeEnv(overrides?: EnvRecord): EnvRecord {
  if (overrides) {
    return overrides;
  }

  const viteEnv =
    typeof import.meta !== 'undefined' &&
    typeof (import.meta as ImportMeta & { env?: EnvRecord }).env !== 'undefined'
      ? ((import.meta as ImportMeta & { env?: EnvRecord }).env ?? {})
      : {};

  const nodeEnv =
    typeof process !== 'undefined' && typeof process.env !== 'undefined'
      ? (process.env as EnvRecord)
      : {};

  return {
    ...nodeEnv,
    ...viteEnv,
  };
}

/**
 * Reads public client-safe Supabase configuration from Vite environment variables.
 * Never reads or exposes any service_role key in browser code.
 */
export function getSupabaseConfig(overrides?: EnvRecord): SupabaseEnvConfig {
  const env = readRuntimeEnv(overrides);
  const url = (env.VITE_SUPABASE_URL ?? '').trim();
  const anonKey = (
    env.VITE_SUPABASE_ANON_KEY ??
    env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    ''
  ).trim();

  const rawMode = (env.VITE_DATA_SOURCE ?? 'auto').trim().toLowerCase();
  const dataSource: DataSourceMode =
    rawMode === 'sample' || rawMode === 'supabase' ? rawMode : 'auto';

  return {
    url,
    anonKey,
    dataSource,
  };
}

export function isSupabaseConfigured(overrides?: EnvRecord): boolean {
  const config = getSupabaseConfig(overrides);
  return config.url.length > 0 && config.anonKey.length > 0;
}

export function getConfiguredDataSource(overrides?: EnvRecord): DataSourceMode {
  return getSupabaseConfig(overrides).dataSource;
}

/**
 * Creates a fresh Supabase client configured exclusively with the public anon/publishable key.
 * Auth session persistence is prepared for the future owner dashboard.
 */
export function createSupabaseClient(
  url: string,
  anonKey: string
): SupabaseClient {
  return createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

let cachedClient: SupabaseClient | null = null;
let cachedSignature = '';

/**
 * Returns the shared Supabase client instance when configured, or null otherwise.
 */
export function getSupabaseClient(overrides?: EnvRecord): SupabaseClient | null {
  const { url, anonKey } = getSupabaseConfig(overrides);
  if (!url || !anonKey) {
    return null;
  }

  const signature = `${url}::${anonKey}`;
  if (!cachedClient || cachedSignature !== signature) {
    cachedClient = createSupabaseClient(url, anonKey);
    cachedSignature = signature;
  }

  return cachedClient;
}
