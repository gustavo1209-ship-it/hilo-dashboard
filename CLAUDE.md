@AGENTS.md

# hilo-dashboard

Dashboard de inteligência competitiva da **Hilo Boutique** — boutique feminina multimarcas.
Construído em Next.js 16 + Tailwind CSS 4, consome dados do Supabase em tempo real.

## Comandos

```bash
npm run dev      # localhost:3000
npm run build    # build de produção
npm run lint
npx tsc --noEmit # type check
```

## Deploy

```bash
vercel --prod --yes   # deploy para produção
```

**IMPORTANTE ao configurar env vars no Vercel — use sempre `--value`, nunca pipe:**
```bash
# CORRETO (sem BOM)
vercel env add NEXT_PUBLIC_SUPABASE_URL production --value "https://..." --yes

# ERRADO — PowerShell pipe adiciona BOM invisível que corrompe headers HTTP
"https://..." | vercel env add NEXT_PUBLIC_SUPABASE_URL production
```

## Variáveis de ambiente

Arquivo `.env.local` (nunca commitado):
```
NEXT_PUBLIC_SUPABASE_URL=https://wbmcyhqlsiuekbizwcti.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<chave anon do projeto>
```

No Vercel: configuradas como variáveis de Production.

## Arquitetura

```
app/
  page.tsx              # Visão Geral — KPIs, top concorrentes, marcas, ações
  concorrentes/         # Cards com métricas Instagram, ticket médio, receita
  precos/               # Radar de preços por categoria e margens por marca
  produtos/             # Tabela de produtos coletados via VTEX
  insights/             # Plano de ação com iniciativas priorizadas
  tendencias/           # Tendências de produto por nível de demanda
  saude/                # Monitoramento das coletas automáticas
  api/test/route.ts     # Rota de diagnóstico — testa conexão Supabase

components/
  Sidebar.tsx           # Navegação lateral preta com estado ativo dourado
  KpiCard.tsx           # Card de KPI (variante normal e accent/dark)
  PageHeader.tsx        # Cabeçalho de página com título e subtítulo

lib/
  supabase.ts           # Cliente Supabase singleton (createClient)
  queries.ts            # Todas as funções de busca de dados
```

## Regras de renderização

Todas as 7 páginas usam `export const dynamic = 'force-dynamic'`.
**Nunca usar `export const revalidate`** — durante o build estático no Vercel as queries falham
silenciosamente e retornam arrays vazios, gerando páginas em branco.

## Supabase — tabelas e views consumidas

| Função em queries.ts      | Fonte no Supabase             |
|---------------------------|-------------------------------|
| getOverviewKpis()         | hb_scraped_products, hb_competitors, hb_brands, hb_market_kpis |
| getCompetitors()          | hb_dash_competitors (view)    |
| getPricingByCategory()    | hb_dash_price_radar (view)    |
| getScrapedProductsSummary()| hb_scraped_products + join hb_competitors |
| getPriorityInsights()     | hb_dash_action_plan (view)    |
| getProductTrends()        | hb_v_product_trends (view)    |
| getCollectionHealth()     | hb_dash_collection_health (view) |
| getHiloBrandsPricing()    | hb_v_hilo_brands_pricing (view) |
| getMarketKpis()           | hb_market_kpis                |

Todas as tabelas/views têm prefixo `hb_` para não conflitar com o projeto controle-gastos
que compartilha o mesmo projeto Supabase (`wbmcyhqlsiuekbizwcti`).

## Paleta de cores (brand Hilo)

```
#111111   hilo-black    — fundo sidebar, textos principais
#C4A46B   hilo-gold     — cor de destaque, links, estado ativo
#F4F1EC   hilo-light    — fundo geral das páginas
#E5DFD5   hilo-border   — bordas dos cards
#9A9289   hilo-muted    — textos secundários
```

Fontes: `Inter` (corpo) + `Playfair Display` (títulos/números), importadas via next/font/google.

## TypeScript — gotcha do join Supabase

Ao selecionar com join (`hb_competitors!inner(name)`), o tipo inferido pelo Supabase client
retorna **array** `{ name: string }[]`, não objeto único. Usar `as unknown as` para cast
e acessar com `[0]?.name`:

```typescript
for (const row of raw as unknown as Array<{ ...; hb_competitors: { name: string }[] }>) {
  const loja = row.hb_competitors?.[0]?.name ?? "?";
}
```

## URLs

- Produção: https://hilo-dashboard.vercel.app
- GitHub: https://github.com/gustavo1209-ship-it/hilo-dashboard
- Vercel project: gustavo-ponzoni-s-projects/hilo-dashboard
