import { supabase, isSupabaseConfigured } from "./supabase";
import { AppUser, AppUserInput, UserRole, UserStatus } from "@/types/user";

const TABLE_NAME = "users";

function rowToUser(row: Record<string, unknown>): AppUser {
  return {
    id: row.id as string,
    email: row.email as string,
    displayName: row.display_name as string | null,
    role: row.role as UserRole,
    status: row.status as UserStatus,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
    lastLoginAt: row.last_login_at ? new Date(row.last_login_at as string) : null,
  };
}

export async function getAllUsers(): Promise<AppUser[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    throw error;
  }

  return (data || []).map(rowToUser);
}

export async function getUserById(id: string): Promise<AppUser | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching user:", error);
    throw error;
  }

  return rowToUser(data);
}

export async function getUserByEmail(email: string): Promise<AppUser | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("email", email.toLowerCase())
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching user:", error);
    throw error;
  }

  return rowToUser(data);
}

export async function createUser(input: AppUserInput): Promise<AppUser> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase not configured");
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      email: input.email.toLowerCase(),
      display_name: input.displayName || null,
      role: input.role || "user",
      status: input.status || "active",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating user:", error);
    throw error;
  }

  return rowToUser(data);
}

export async function updateUser(id: string, input: Partial<AppUserInput>): Promise<AppUser> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase not configured");
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.email !== undefined) {
    updateData.email = input.email.toLowerCase();
  }
  if (input.displayName !== undefined) {
    updateData.display_name = input.displayName;
  }
  if (input.role !== undefined) {
    updateData.role = input.role;
  }
  if (input.status !== undefined) {
    updateData.status = input.status;
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating user:", error);
    throw error;
  }

  return rowToUser(data);
}

export async function deleteUser(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase not configured");
  }

  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

export async function updateLastLogin(email: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    return;
  }

  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ last_login_at: new Date().toISOString() })
    .eq("email", email.toLowerCase());

  if (error) {
    console.error("Error updating last login:", error);
  }
}

// Sync user after Supabase Auth sign-in - creates row if missing, updates last login
export async function syncUserFromAuth(email: string, displayName?: string | null): Promise<AppUser | null> {
  if (!isSupabaseConfigured || !supabase || !email) {
    return null;
  }

  try {
    // Check if user exists
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      // Update last login
      await updateLastLogin(email);
      return existingUser;
    }

    // Create new user
    return await createUser({
      email,
      displayName: displayName || null,
      role: "user",
      status: "active",
    });
  } catch (error) {
    console.error("Error syncing user:", error);
    return null;
  }
}
