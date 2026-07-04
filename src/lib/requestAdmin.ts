import type { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isUserAdmin } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  isAdminLocalGateEnabled,
  verifyAdminLocalGateFromRequest,
  getLocalGateIdentityEmail,
} from "@/lib/adminLocalGate";
import { SITE_EMAIL } from "@/lib/siteContact";

const isBypassEnabled = process.env.NEXT_PUBLIC_ADMIN_BYPASS === "true";

/**
 * Resolves an admin-capable identity for API routes: bypass email, local gate
 * cookie session, or Supabase user with admin role.
 */
export async function resolveAdminEmail(
  request: NextRequest
): Promise<string | null> {
  if (isBypassEnabled) {
    return process.env.NEXT_PUBLIC_ADMIN_BYPASS_EMAIL || SITE_EMAIL;
  }

  if (isAdminLocalGateEnabled()) {
    if (await verifyAdminLocalGateFromRequest(request)) {
      return getLocalGateIdentityEmail();
    }
    return null;
  }

  if (!isSupabaseConfigured) return null;

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) return null;
    if (await isUserAdmin(user.email)) return user.email;
    return null;
  } catch (error) {
    console.error("resolveAdminEmail:", error);
    return null;
  }
}
