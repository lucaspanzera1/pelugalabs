const LEADS_ENDPOINT =
  process.env.SERVICEDESK_LEADS_URL ?? "https://servicedesk.peluga.com.br/api/crm/leads/public";

const ORIGIN_FIELDS = [
  "site", "page", "form", "visitorId", "landingPage", "referrer",
  "utmSource", "utmMedium", "utmCampaign", "utmContent", "utmTerm", "firstSeenAt",
];

/** Só repassa os campos de origem conhecidos, como string. */
function pickOrigin(origin) {
  if (!origin || typeof origin !== "object") return undefined;
  const out = {};
  for (const key of ORIGIN_FIELDS) {
    const value = origin[key];
    if (typeof value === "string" && value.trim()) out[key] = value.trim().slice(0, 500);
  }
  return Object.keys(out).length ? out : undefined;
}

export async function POST(request) {
  try {
    const data = await request.json();

    const payload = {
      name: String(data?.name ?? ""),
      email: String(data?.email ?? ""),
      phone: String(data?.phone ?? ""),
      company: String(data?.company ?? ""),
      projectType: String(data?.projectType ?? ""),
      budgetRange: String(data?.budgetRange ?? ""),
      timeline:
        typeof data?.timeline === "string" && data.timeline.trim().length > 0
          ? data.timeline
          : "not-informed",
      description: String(data?.description ?? ""),
      projectTypeLabel: String(data?.projectTypeLabel ?? ""),
      budgetRangeLabel: String(data?.budgetRangeLabel ?? ""),
      origin: pickOrigin(data?.origin),
      features: Array.isArray(data?.features)
        ? data.features
            .filter((feature) => typeof feature === "string")
            .map((feature) => feature.trim())
            .filter(Boolean)
        : [],
    };

    const crmRes = await fetch(LEADS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await crmRes.json();

    if (!crmRes.ok) {
      console.error("CRM API error:", result);
      return Response.json(
        { error: result.error || "Erro ao enviar para o CRM" },
        { status: crmRes.status }
      );
    }

    return Response.json({ success: true, message: "Orçamento enviado com sucesso!" });

  } catch (error) {
    console.error("Erro no proxy do orçamento:", error);
    return Response.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
