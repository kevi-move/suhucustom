"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AppUser, UserRole, UserStatus } from "@/types/user";
import { getAllUsers, createUser, updateUser, deleteUser } from "@/lib/users";
import { Plus, Edit2, Trash2, X, Shield, ShieldCheck, User, Check, Clock, Ban } from "lucide-react";

type ModalMode = "create" | "edit" | null;

export default function UsersAdminPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formEmail, setFormEmail] = useState("");
  const [formDisplayName, setFormDisplayName] = useState("");
  const [formRole, setFormRole] = useState<UserRole>("user");
  const [formStatus, setFormStatus] = useState<UserStatus>("active");

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreateModal = () => {
    setFormEmail("");
    setFormDisplayName("");
    setFormRole("user");
    setFormStatus("active");
    setSelectedUser(null);
    setModalMode("create");
    setError("");
  };

  const openEditModal = (user: AppUser) => {
    setFormEmail(user.email);
    setFormDisplayName(user.displayName || "");
    setFormRole(user.role);
    setFormStatus(user.status);
    setSelectedUser(user);
    setModalMode("edit");
    setError("");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedUser(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (modalMode === "create") {
        await createUser({
          email: formEmail,
          displayName: formDisplayName || null,
          role: formRole,
          status: formStatus,
        });
      } else if (modalMode === "edit" && selectedUser) {
        await updateUser(selectedUser.id, {
          email: formEmail,
          displayName: formDisplayName || null,
          role: formRole,
          status: formStatus,
        });
      }
      await loadUsers();
      closeModal();
    } catch (err) {
      console.error("Error saving user:", err);
      setError("Failed to save user. Email may already exist.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      await loadUsers();
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user");
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "super_admin":
        return <ShieldCheck size={16} style={{ color: "#D09947" }} />;
      case "admin":
        return <Shield size={16} style={{ color: "#22c55e" }} />;
      default:
        return <User size={16} style={{ color: "#888" }} />;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const colors = {
      super_admin: { bg: "rgba(208, 153, 71, 0.2)", text: "#D09947" },
      admin: { bg: "rgba(34, 197, 94, 0.2)", text: "#22c55e" },
      user: { bg: "rgba(136, 136, 136, 0.2)", text: "#888" },
    };
    const c = colors[role];
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 10px",
          background: c.bg,
          color: c.text,
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: 500,
        }}
      >
        {getRoleIcon(role)}
        {role.replace("_", " ")}
      </span>
    );
  };

  const getStatusBadge = (status: UserStatus) => {
    const config = {
      active: { bg: "rgba(34, 197, 94, 0.2)", text: "#22c55e", icon: <Check size={14} /> },
      inactive: { bg: "rgba(239, 68, 68, 0.2)", text: "#ef4444", icon: <Ban size={14} /> },
      pending: { bg: "rgba(234, 179, 8, 0.2)", text: "#eab308", icon: <Clock size={14} /> },
    };
    const c = config[status];
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "4px 10px",
          background: c.bg,
          color: c.text,
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: 500,
        }}
      >
        {c.icon}
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ color: "#888", textAlign: "center", padding: "60px" }}>
          Loading users...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ maxWidth: "1200px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
              User Management
            </h1>
            <p style={{ color: "#888", fontSize: "14px" }}>
              Manage users, roles, and permissions
            </p>
          </div>
          <button
            onClick={openCreateModal}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              background: "#D09947",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Plus size={18} />
            Add User
          </button>
        </div>

        {/* Users Table */}
        <div
          style={{
            background: "#1a1a1a",
            borderRadius: "12px",
            border: "1px solid #333",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #333" }}>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px 20px",
                    color: "#888",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  User
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px 20px",
                    color: "#888",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  Role
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px 20px",
                    color: "#888",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px 20px",
                    color: "#888",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  Created
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px 20px",
                    color: "#888",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  Last Login
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "16px 20px",
                    color: "#888",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                    No users found. Add your first user to get started.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    style={{ borderBottom: "1px solid #2a2a2a" }}
                  >
                    <td style={{ padding: "16px 20px" }}>
                      <div>
                        <div style={{ color: "#fff", fontWeight: 500, marginBottom: "2px" }}>
                          {user.displayName || "—"}
                        </div>
                        <div style={{ color: "#888", fontSize: "13px" }}>{user.email}</div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px" }}>{getRoleBadge(user.role)}</td>
                    <td style={{ padding: "16px 20px" }}>{getStatusBadge(user.status)}</td>
                    <td style={{ padding: "16px 20px", color: "#888", fontSize: "13px" }}>
                      {user.createdAt.toLocaleDateString()}
                    </td>
                    <td style={{ padding: "16px 20px", color: "#888", fontSize: "13px" }}>
                      {user.lastLoginAt ? user.lastLoginAt.toLocaleDateString() : "Never"}
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => openEditModal(user)}
                          style={{
                            padding: "8px",
                            background: "#2a2a2a",
                            border: "1px solid #444",
                            borderRadius: "6px",
                            color: "#C5C6C9",
                            cursor: "pointer",
                          }}
                          title="Edit user"
                        >
                          <Edit2 size={16} />
                        </button>
                        {deleteConfirm === user.id ? (
                          <>
                            <button
                              onClick={() => handleDelete(user.id)}
                              style={{
                                padding: "8px 12px",
                                background: "#ef4444",
                                border: "none",
                                borderRadius: "6px",
                                color: "#fff",
                                cursor: "pointer",
                                fontSize: "12px",
                              }}
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              style={{
                                padding: "8px 12px",
                                background: "#333",
                                border: "none",
                                borderRadius: "6px",
                                color: "#888",
                                cursor: "pointer",
                                fontSize: "12px",
                              }}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(user.id)}
                            style={{
                              padding: "8px",
                              background: "rgba(239, 68, 68, 0.1)",
                              border: "1px solid rgba(239, 68, 68, 0.3)",
                              borderRadius: "6px",
                              color: "#ef4444",
                              cursor: "pointer",
                            }}
                            title="Delete user"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {modalMode && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: "#1a1a1a",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "480px",
              border: "1px solid #333",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 24px",
                borderBottom: "1px solid #333",
              }}
            >
              <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#fff" }}>
                {modalMode === "create" ? "Add New User" : "Edit User"}
              </h2>
              <button
                onClick={closeModal}
                style={{
                  background: "none",
                  border: "none",
                  color: "#888",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
              {error && (
                <div
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#ef4444",
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </div>
              )}

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#C5C6C9",
                    fontSize: "14px",
                    marginBottom: "8px",
                  }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "#2a2a2a",
                    border: "1px solid #444",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#C5C6C9",
                    fontSize: "14px",
                    marginBottom: "8px",
                  }}
                >
                  Display Name
                </label>
                <input
                  type="text"
                  value={formDisplayName}
                  onChange={(e) => setFormDisplayName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "#2a2a2a",
                    border: "1px solid #444",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#C5C6C9",
                    fontSize: "14px",
                    marginBottom: "8px",
                  }}
                >
                  Role
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as UserRole)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "#2a2a2a",
                    border: "1px solid #444",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                  }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div style={{ marginBottom: "28px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#C5C6C9",
                    fontSize: "14px",
                    marginBottom: "8px",
                  }}
                >
                  Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as UserStatus)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "#2a2a2a",
                    border: "1px solid #444",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                  }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#333",
                    color: "#C5C6C9",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: saving ? "#666" : "#D09947",
                    color: "#000",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: saving ? "not-allowed" : "pointer",
                  }}
                >
                  {saving ? "Saving..." : modalMode === "create" ? "Create User" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
