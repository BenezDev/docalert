/**
 * API Backend — Helper functions for edge function calls.
 * Maps the requested REST routes to Supabase SDK + Edge Functions.
 */
import { supabase } from "@/integrations/supabase/client";

// ─── Auth (all handled natively by supabase.auth.*) ───

export const api = {
  auth: {
    register: (email: string, password: string, name: string) =>
      supabase.auth.signUp({ email, password, options: { data: { full_name: name }, emailRedirectTo: window.location.origin } }),
    login: (email: string, password: string) =>
      supabase.auth.signInWithPassword({ email, password }),
    logout: () => supabase.auth.signOut(),
    refreshToken: () => supabase.auth.refreshSession(),
    forgotPassword: (email: string) =>
      supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` }),
    resetPassword: (password: string) =>
      supabase.auth.updateUser({ password }),
    me: () => supabase.auth.getUser(),
  },

  // ─── Users / Profile ───
  users: {
    getProfile: () =>
      supabase.from("profiles").select("*").single(),
    updateProfile: (updates: Record<string, unknown>) =>
      supabase.from("profiles").update(updates).eq("user_id", (supabase.auth.getUser as any)()),
    updateProfileById: (userId: string, updates: Record<string, unknown>) =>
      supabase.from("profiles").update(updates).eq("user_id", userId),
    deleteAccount: () =>
      supabase.functions.invoke("delete-account"),
    getStats: () =>
      supabase.functions.invoke("user-stats"),
    updatePreferences: (prefs: Record<string, unknown>) =>
      supabase.from("profiles").update(prefs).eq("user_id", prefs.user_id as string),
  },

  // ─── Documents ───
  documents: {
    list: () =>
      supabase.from("documentos").select("*").order("data_vencimento", { ascending: true }),
    create: (doc: Record<string, unknown>) =>
      supabase.from("documentos").insert(doc).select().single(),
    get: (id: string) =>
      supabase.from("documentos").select("*").eq("id", id).single(),
    update: (id: string, updates: Record<string, unknown>) =>
      supabase.from("documentos").update(updates).eq("id", id),
    delete: (id: string) =>
      supabase.from("documentos").delete().eq("id", id),
    expiring: () =>
      supabase.functions.invoke("documents-filter", { body: null, headers: {} }),
    expired: () =>
      supabase.functions.invoke("documents-filter", { body: null, headers: {} }),
  },

  // ─── Notifications ───
  notifications: {
    list: () =>
      supabase.from("notifications").select("*").order("scheduled_date", { ascending: false }),
    markRead: (id: string) =>
      supabase.from("notifications").update({ status: "READ" }).eq("id", id),
    getPreferences: () =>
      supabase.from("alertas_configuracao").select("*"),
    updatePreferences: (id: string, updates: Record<string, unknown>) =>
      supabase.from("alertas_configuracao").update(updates).eq("id", id),
    sendTest: (body: { notification_type?: string; documento_id?: string }) =>
      supabase.functions.invoke("send-test-notification", { body }),
  },

  // ─── Subscriptions & Payments (Stripe - to be enabled) ───
  subscriptions: {
    get: () =>
      supabase.from("subscriptions").select("*").order("criado_em", { ascending: false }).limit(1).single(),
    // checkout, cancel, and webhook will be added after Stripe integration
  },
  payments: {
    list: () =>
      supabase.from("payments").select("*").order("criado_em", { ascending: false }),
  },
};
