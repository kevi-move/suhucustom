import { cookies } from "next/headers";

export async function getCmsModeEnabled(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get("cms-edit-mode")?.value === "1";
}
