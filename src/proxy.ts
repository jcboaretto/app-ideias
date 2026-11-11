import { NextResponse, type NextRequest } from "next/server";

/**
 * Protege o painel do restaurante com usuário e senha (HTTP Basic).
 * Sem PAINEL_USUARIO e PAINEL_SENHA configurados, o painel fica bloqueado.
 */
export function proxy(request: NextRequest) {
  const usuario = process.env.PAINEL_USUARIO;
  const senha = process.env.PAINEL_SENHA;

  if (!usuario || !senha) {
    return new NextResponse("Painel desativado: configure PAINEL_USUARIO e PAINEL_SENHA.", {
      status: 503,
    });
  }

  const cabecalho = request.headers.get("authorization") ?? "";
  const [esquema, valor] = cabecalho.split(" ");
  if (esquema === "Basic" && valor) {
    const decodificado = atob(valor);
    const separador = decodificado.indexOf(":");
    if (
      separador >= 0 &&
      iguais(decodificado.slice(0, separador), usuario) &&
      iguais(decodificado.slice(separador + 1), senha)
    ) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Acesso restrito.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Painel", charset="UTF-8"' },
  });
}

/** Comparação em tempo constante para não vazar a senha pelo tempo de resposta. */
function iguais(a: string, b: string): boolean {
  const ta = new TextEncoder().encode(a);
  const tb = new TextEncoder().encode(b);
  let diferenca = ta.length ^ tb.length;
  for (let i = 0; i < Math.max(ta.length, tb.length); i++) {
    diferenca |= (ta[i] ?? 0) ^ (tb[i] ?? 0);
  }
  return diferenca === 0;
}

export const config = {
  matcher: "/painel/:path*",
};
