# Peça na Cidade

App de cardápio e delivery para as lojas de uma cidade do interior.
O cliente escolhe a loja, monta o carrinho e envia o pedido pronto pelo WhatsApp da loja.

## O que já funciona

- Lista de lojas e cardápio por categoria (com itens esgotados).
- Carrinho salvo no celular, com quantidade e observação por item.
- Entrega por bairro (taxa de cada bairro) ou retirada no local.
- Pagamento: Pix, dinheiro (com troco) ou cartão na entrega.
- Pedido mínimo por loja.
- Pedido enviado pelo WhatsApp com a mensagem já formatada.
- Totais sempre recalculados no servidor a partir do cardápio.
- Painel do restaurante em `/painel`, protegido por usuário e senha. Ele lista os pedidos quando o Supabase está configurado.
- Instalável no celular como app (PWA).

## Rodando

```bash
npm ci
cp .env.example .env.local   # preencha o que for usar
npm run dev
```

Abra http://localhost:3000.

## Cardápios

Por enquanto os cardápios ficam em `src/data/lojas.ts`. Os preços são em centavos.
Troque os números de WhatsApp de exemplo (`5500000000000`) pelos reais, com DDI 55 e DDD.

## Supabase (opcional)

Sem o Supabase, os pedidos vão só pelo WhatsApp. Para guardar os pedidos e vê-los no painel:

1. Crie um projeto gratuito em https://supabase.com.
2. No SQL Editor, rode o arquivo `supabase/schema.sql`.
3. Em `.env.local`, preencha `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` (Project Settings > API).
4. Defina `PAINEL_USUARIO` e `PAINEL_SENHA` para acessar `/painel`.

## Próximos passos sugeridos

- Mover os cardápios para o Supabase, para cada loja editar o seu pelo painel.
- Status do pedido (novo, preparando, saiu para entrega) com atualização em tempo real.
- Horário de funcionamento automático (loja fechada não recebe pedido).
- Pagamento online via Mercado Pago (Pix com QR Code).
