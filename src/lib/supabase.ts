import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente do Supabase usado só no servidor, com a chave secreta (service role).
 * Retorna null enquanto o Supabase não estiver configurado: nesse caso o app
 * funciona só com o envio do pedido pelo WhatsApp.
 */
export function supabaseServidor(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !chave) return null;
  return createClient(url, chave, { auth: { persistSession: false } });
}
