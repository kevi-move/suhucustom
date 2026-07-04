export type UserRole = "user" | "admin" | "super_admin";
export type UserStatus = "active" | "inactive" | "pending";

export interface AppUser {
  id: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}

export interface AppUserInput {
  email: string;
  displayName?: string | null;
  role?: UserRole;
  status?: UserStatus;
}
