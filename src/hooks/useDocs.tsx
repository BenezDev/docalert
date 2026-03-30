import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { DocumentType } from "@/lib/documents";

export interface DocRecord {
  id: string;
  usuario_id: string;
  tipo: DocumentType;
  apelido?: string | null;
  numero_documento?: string | null;
  data_vencimento: string;
  data_emissao?: string | null;
  observacoes?: string | null;
  resolvido: boolean;
  criado_em: string;
  atualizado_em: string;
  extra?: Record<string, string> | null;
}

interface DocsContextType {
  documents: DocRecord[];
  isLoading: boolean;
  addDocument: (doc: { tipo: string; apelido?: string; numero_documento?: string; data_vencimento: string; data_emissao?: string; observacoes?: string; resolvido: boolean }) => Promise<string | null>;
  updateDocument: (id: string, updates: Partial<DocRecord>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  getDocument: (id: string) => DocRecord | undefined;
  refetch: () => Promise<void>;
}

const DocsContext = createContext<DocsContextType | null>(null);

export function DocsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocs = useCallback(async () => {
    if (!user) { setDocuments([]); setIsLoading(false); return; }
    setIsLoading(true);
    const { data, error } = await supabase
      .from("documentos")
      .select("*")
      .order("data_vencimento", { ascending: true });

    if (!error && data) {
      setDocuments(data as DocRecord[]);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const addDocument = async (doc: { tipo: string; apelido?: string; numero_documento?: string; data_vencimento: string; data_emissao?: string; observacoes?: string; resolvido: boolean }, planType?: string) => {
    if (!user) return null;

    // Enforce FREE plan limit: max 1 document
    if (!planType || planType === "FREE") {
      const { count } = await supabase
        .from("documentos")
        .select("*", { count: "exact", head: true })
        .eq("usuario_id", user.id);
      if ((count ?? 0) >= 1) {
        throw new Error("PLAN_LIMIT");
      }
    }

    const { data, error } = await supabase
      .from("documentos")
      .insert({
        usuario_id: user.id,
        tipo: doc.tipo,
        apelido: doc.apelido || null,
        numero_documento: doc.numero_documento || null,
        data_vencimento: doc.data_vencimento,
        data_emissao: doc.data_emissao || null,
        observacoes: doc.observacoes || null,
        resolvido: doc.resolvido,
      })
      .select()
      .single();

    if (!error && data) {
      setDocuments((prev) => [...prev, data as DocRecord]);
      return data.id;
    }
    return null;
  };

  const updateDocument = async (id: string, updates: Partial<DocRecord>) => {
    const { error } = await supabase
      .from("documentos")
      .update(updates)
      .eq("id", id);

    if (!error) {
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...updates, atualizado_em: new Date().toISOString() } : d))
      );
    }
  };

  const deleteDocument = async (id: string) => {
    const { error } = await supabase
      .from("documentos")
      .delete()
      .eq("id", id);

    if (!error) {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const getDocument = (id: string) => documents.find((d) => d.id === id);

  return (
    <DocsContext.Provider value={{ documents, isLoading, addDocument, updateDocument, deleteDocument, getDocument, refetch: fetchDocs }}>
      {children}
    </DocsContext.Provider>
  );
}

export function useDocs() {
  const ctx = useContext(DocsContext);
  if (!ctx) throw new Error("useDocs must be inside DocsProvider");
  return ctx;
}
