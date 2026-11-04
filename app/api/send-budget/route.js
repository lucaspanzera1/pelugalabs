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
      features: Array.isArray(data?.features)
        ? data.features
            .filter((feature) => typeof feature === "string")
            .map((feature) => feature.trim())
            .filter(Boolean)
        : [],
    };

    const crmRes = await fetch("https://servicedesk.peluga.com.br/api/crm/leads/public", {
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
