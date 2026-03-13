import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface RenewalRecord {
  id: string;
  documento_id: string;
  usuario_id: string;
  data_renovacao: string;
  custo_renovacao: number;
  multa_evitada: number;
  observacoes: string | null;
  criado_em: string;
}

export function useRenewals(documentoId?: string) {
  const { user } = useAuth();
  const [renewals, setRenewals] = useState<RenewalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRenewals = useCallback(async () => {
    if (!user) { setRenewals([]); setIsLoading(false); return; }
    setIsLoading(true);
    let query = supabase
      .from("renovacoes")
      .select("*")
      .order("data_renovacao", { ascending: false });

    if (documentoId) {
      query = query.eq("documento_id", documentoId);
    }

    const { data, error } = await query;
    if (!error && data) {
      setRenewals(data as RenewalRecord[]);
    }
    setIsLoading(false);
  }, [user, documentoId]);

  useEffect(() => { fetchRenewals(); }, [fetchRenewals]);

  const addRenewal = async (renewal: {
    documento_id: string;
    data_renovacao: string;
    custo_renovacao: number;
    multa_evitada: number;
    observacoes?: string;
  }) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("renovacoes")
      .insert({
        ...renewal,
        usuario_id: user.id,
        observacoes: renewal.observacoes || null,
      })
      .select()
      .single();

    if (!error && data) {
      setRenewals((prev) => [data as RenewalRecord, ...prev]);
      return data.id;
    }
    return null;
  };

  const deleteRenewal = async (id: string) => {
    const { error } = await supabase
      .from("renovacoes")
      .delete()
      .eq("id", id);
    if (!error) {
      setRenewals((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const totalCost = renewals.reduce((sum, r) => sum + Number(r.custo_renovacao || 0), 0);
  const totalSaved = renewals.reduce((sum, r) => sum + Number(r.multa_evitada || 0), 0);

  return { renewals, isLoading, addRenewal, deleteRenewal, totalCost, totalSaved, refetch: fetchRenewals };
}
