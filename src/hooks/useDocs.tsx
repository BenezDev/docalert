import { useState, useEffect, createContext, useContext, type ReactNode } from "react";
import type { DocumentType } from "@/lib/documents";

export interface DocRecord {
  id: string;
  usuario_id: string;
  tipo: DocumentType;
  apelido?: string;
  numero_documento?: string;
  data_vencimento: string;
  data_emissao?: string;
  observacoes?: string;
  resolvido: boolean;
  criado_em: string;
  atualizado_em: string;
  // type-specific
  extra?: Record<string, string>;
}

export interface AlertConfig {
  id: string;
  documento_id: string;
  dias_antes: number;
  via_email: boolean;
  ativo: boolean;
}

const MOCK_DOCS: DocRecord[] = [
  {
    id: "1",
    usuario_id: "mock-user-1",
    tipo: "CNH",
    apelido: "CNH do João",
    data_vencimento: (() => { const d = new Date(); d.setDate(d.getDate() + 23); return d.toISOString().split("T")[0]; })(),
    resolvido: false,
    criado_em: new Date().toISOString(),
    atualizado_em: new Date().toISOString(),
  },
  {
    id: "2",
    usuario_id: "mock-user-1",
    tipo: "CRLV",
    apelido: "Carro da esposa",
    data_vencimento: (() => { const d = new Date(); d.setDate(d.getDate() + 45); return d.toISOString().split("T")[0]; })(),
    resolvido: false,
    criado_em: new Date().toISOString(),
    atualizado_em: new Date().toISOString(),
  },
  {
    id: "3",
    usuario_id: "mock-user-1",
    tipo: "PASSAPORTE",
    apelido: "Passaporte Maria",
    data_vencimento: (() => { const d = new Date(); d.setDate(d.getDate() + 120); return d.toISOString().split("T")[0]; })(),
    resolvido: false,
    criado_em: new Date().toISOString(),
    atualizado_em: new Date().toISOString(),
  },
  {
    id: "4",
    usuario_id: "mock-user-1",
    tipo: "IPVA",
    apelido: "IPVA Civic",
    data_vencimento: (() => { const d = new Date(); d.setDate(d.getDate() + 5); return d.toISOString().split("T")[0]; })(),
    resolvido: false,
    criado_em: new Date().toISOString(),
    atualizado_em: new Date().toISOString(),
  },
  {
    id: "5",
    usuario_id: "mock-user-1",
    tipo: "RG",
    apelido: "RG João",
    data_vencimento: (() => { const d = new Date(); d.setDate(d.getDate() + 200); return d.toISOString().split("T")[0]; })(),
    resolvido: false,
    criado_em: new Date().toISOString(),
    atualizado_em: new Date().toISOString(),
  },
];

interface DocsContextType {
  documents: DocRecord[];
  addDocument: (doc: Omit<DocRecord, "id" | "usuario_id" | "criado_em" | "atualizado_em">) => void;
  updateDocument: (id: string, updates: Partial<DocRecord>) => void;
  deleteDocument: (id: string) => void;
  getDocument: (id: string) => DocRecord | undefined;
}

const DocsContext = createContext<DocsContextType | null>(null);

export function DocsProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<DocRecord[]>(() => {
    const saved = localStorage.getItem("docalert_docs");
    return saved ? JSON.parse(saved) : MOCK_DOCS;
  });

  useEffect(() => {
    localStorage.setItem("docalert_docs", JSON.stringify(documents));
  }, [documents]);

  const addDocument = (doc: Omit<DocRecord, "id" | "usuario_id" | "criado_em" | "atualizado_em">) => {
    const newDoc: DocRecord = {
      ...doc,
      id: crypto.randomUUID(),
      usuario_id: "mock-user-1",
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString(),
    };
    setDocuments((prev) => [...prev, newDoc]);
  };

  const updateDocument = (id: string, updates: Partial<DocRecord>) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates, atualizado_em: new Date().toISOString() } : d))
    );
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const getDocument = (id: string) => documents.find((d) => d.id === id);

  return (
    <DocsContext.Provider value={{ documents, addDocument, updateDocument, deleteDocument, getDocument }}>
      {children}
    </DocsContext.Provider>
  );
}

export function useDocs() {
  const ctx = useContext(DocsContext);
  if (!ctx) throw new Error("useDocs must be inside DocsProvider");
  return ctx;
}
