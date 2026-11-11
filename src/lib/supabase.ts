import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Valor usado nas sessões de desenvolvimento na nuvem: a chave real fica
 * guardada no proxy do ambiente, que a coloca no cabeçalho `apikey` de cada
 * requisição. O código nunca vê a chave.
 */
const CHAVE_VIA_PROXY = "sb_secret_injetada_pelo_proxy";

/**
 * Cliente do Supabase usado só no servidor, com a chave secreta (sb_secret_...).
 * Retorna null enquanto o Supabase não estiver configurado: nesse caso o app
 * funciona só com o envio do pedido pelo WhatsApp.
 */
export function supabaseServidor(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave =
    process.env.SUPABASE_SECRET_KEY ||
    (process.env.APP_DEV_NUVEM === "1" ? CHAVE_VIA_PROXY : undefined);
  if (!url || !chave) return null;

  return createClient(url, chave, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: semChaveNoAuthorization },
  });
}

/**
 * Chaves secretas novas (sb_secret_...) não são JWT e vão só no cabeçalho
 * `apikey`. O supabase-js também as coloca em `Authorization: Bearer`, o que
 * não é necessário; removemos para a chave aparecer em um único lugar.
 */
const semChaveNoAuthorization: typeof fetch = (input, init) => {
  const headers = new Headers(init?.headers);
  if (headers.get("authorization")?.startsWith("Bearer sb_secret_")) {
    headers.delete("authorization");
  }
  return fetch(input, { ...init, headers });
};
