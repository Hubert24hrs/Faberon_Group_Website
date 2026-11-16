import { serverEnv } from "@/lib/env.server";
import type { LeadRecord } from "./notify";

// Adapters for CRMs. Add HubSpot, Pipedrive or Notion by implementing this
// interface and returning it from activeCrmAdapters behind its own env flag.
export interface CrmAdapter {
  name: string;
  createLead(lead: LeadRecord): Promise<boolean>;
}

// Generic JSON webhook. Works with Zapier, Make or a CRM's own workflow URL.
function webhookAdapter(url: string): CrmAdapter {
  return {
    name: "webhook",
    async createLead(lead) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lead),
        });
        return response.ok;
      } catch {
        return false;
      }
    },
  };
}

export function activeCrmAdapters(): CrmAdapter[] {
  const url = serverEnv().CRM_WEBHOOK_URL;
  return url ? [webhookAdapter(url)] : [];
}
