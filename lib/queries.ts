import { supabase } from "./supabase";

export async function getOverviewKpis() {
  const [products, competitors, brands, kpis] = await Promise.all([
    supabase.from("hb_scraped_products").select("id", { count: "exact", head: true }),
    supabase.from("hb_competitors").select("id", { count: "exact", head: true }),
    supabase.from("hb_brands").select("id", { count: "exact", head: true }),
    supabase.from("hb_market_kpis")
      .select("metric, value, unit")
      .in("metric", [
        "Faturamento total varejo de moda Brasil",
        "Crescimento e-commerce moda Brasil",
        "Participação lojas independentes no varejo físico",
        "Taxa de retenção clientes com omnichannel",
      ]),
  ]);

  return {
    totalProducts: products.count ?? 0,
    totalCompetitors: competitors.count ?? 0,
    totalBrands: brands.count ?? 0,
    marketKpis: kpis.data ?? [],
  };
}

export async function getCompetitors() {
  const { data } = await supabase
    .from("hb_dash_competitors")
    .select("*")
    .order("seguidores_atual", { ascending: false, nullsFirst: false });
  return data ?? [];
}

export async function getPricingByCategory() {
  const { data } = await supabase
    .from("hb_dash_price_radar")
    .select("*")
    .order("categoria");
  return data ?? [];
}

export async function getScrapedProductsSummary() {
  const { data } = await supabase
    .from("hb_scraped_products")
    .select(`
      name, price_brl, price_sale_brl, category_slug, last_seen_at,
      hb_competitors!inner(name)
    `)
    .order("last_seen_at", { ascending: false })
    .limit(200);
  return data ?? [];
}

export async function getProductsByCategory() {
  const { data } = await supabase.rpc("hb_products_by_category" as never);
  if (data) return data;

  // Fallback: query direta
  const { data: raw } = await supabase
    .from("hb_scraped_products")
    .select("category_slug, price_brl, hb_competitors!inner(name)");

  if (!raw) return [];

  const grouped: Record<string, { cat: string; prices: number[]; loja: string }> = {};
  for (const row of raw as unknown as Array<{ category_slug: string | null; price_brl: number; hb_competitors: { name: string }[] }>) {
    const cat = row.category_slug ?? "outros";
    const loja = row.hb_competitors?.[0]?.name ?? "?";
    const key = `${cat}__${loja}`;
    if (!grouped[key]) grouped[key] = { cat, prices: [], loja };
    if (row.price_brl) grouped[key].prices.push(row.price_brl);
  }

  return Object.values(grouped).map(({ cat, prices, loja }) => ({
    categoria: cat,
    loja,
    preco_medio: prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0,
    total: prices.length,
  }));
}

export async function getPriorityInsights() {
  const { data } = await supabase
    .from("hb_dash_action_plan")
    .select("*")
    .limit(20);
  return data ?? [];
}

export async function getProductTrends() {
  const { data } = await supabase
    .from("hb_v_product_trends")
    .select("*");
  return data ?? [];
}

export async function getCollectionHealth() {
  const { data } = await supabase
    .from("hb_dash_collection_health")
    .select("*");
  return data ?? [];
}

export async function getHiloBrandsPricing() {
  const { data } = await supabase
    .from("hb_v_hilo_brands_pricing")
    .select("*")
    .order("marca");
  return data ?? [];
}

export async function getMarketKpis() {
  const { data } = await supabase
    .from("hb_market_kpis")
    .select("*")
    .order("year", { ascending: false });
  return data ?? [];
}
