import { Car, FileText, Coins, Plane, CreditCard, Vote, Briefcase, Building2, ClipboardList, KeyRound, Plus, type LucideIcon } from "lucide-react";

export type DocumentType =
  | "CNH"
  | "CRLV"
  | "IPVA"
  | "PASSAPORTE"
  | "RG"
  | "TITULO_ELEITOR"
  | "CARTEIRA_TRABALHO"
  | "MEI_DAS"
  | "ALVARA"
  | "CERTIFICADO_DIGITAL"
  | "OUTRO";

export interface DocumentTypeInfo {
  label: string;
  icon: LucideIcon;
  description: string;
}

export const DOCUMENT_TYPES: Record<DocumentType, DocumentTypeInfo> = {
  CNH: { label: "CNH", icon: Car, description: "Carteira Nacional de Habilitação" },
  CRLV: { label: "CRLV", icon: FileText, description: "Certificado de Registro e Licenciamento" },
  IPVA: { label: "IPVA", icon: Coins, description: "Imposto sobre Veículos" },
  PASSAPORTE: { label: "Passaporte", icon: Plane, description: "Passaporte brasileiro" },
  RG: { label: "RG", icon: CreditCard, description: "Registro Geral" },
  TITULO_ELEITOR: { label: "Título de Eleitor", icon: Vote, description: "Título de Eleitor" },
  CARTEIRA_TRABALHO: { label: "Carteira de Trabalho", icon: Briefcase, description: "CTPS Digital" },
  MEI_DAS: { label: "MEI - DAS", icon: Building2, description: "Documento de Arrecadação do Simples" },
  ALVARA: { label: "Alvará", icon: ClipboardList, description: "Alvará de funcionamento" },
  CERTIFICADO_DIGITAL: { label: "Certificado Digital", icon: KeyRound, description: "e-CPF ou e-CNPJ" },
  OUTRO: { label: "Outro", icon: Plus, description: "Outro tipo de documento" },
};

export interface RenewalStep {
  title: string;
  description: string;
  time?: string;
  cost?: string;
  link?: string;
}

export const RENEWAL_GUIDES: Partial<Record<DocumentType, { steps: RenewalStep[]; totalTime: string; totalCost: string }>> = {
  CNH: {
    steps: [
      { title: "Agende exame médico", description: "Procure uma clínica credenciada pelo DETRAN", time: "1-2 semanas", cost: "R$ 80-150" },
      { title: "Pague a taxa DETRAN", description: "Gere o boleto no site do DETRAN do seu estado", time: "1 dia", cost: "R$ 89,00 (SP)" },
      { title: "Compareça ao DETRAN", description: "Leve documento com foto e comprovante de pagamento", time: "1 dia" },
      { title: "Aguarde entrega", description: "A nova CNH será entregue no endereço cadastrado", time: "20 dias úteis" },
    ],
    totalTime: "3 semanas",
    totalCost: "R$ 220",
  },
  CRLV: {
    steps: [
      { title: "Pague o IPVA e taxas", description: "Quite todos os débitos do veículo", time: "1 dia", cost: "Varia por estado" },
      { title: "Acesse o app ou site do DETRAN", description: "Baixe o CRLV digital ou solicite a via impressa", time: "Imediato" },
    ],
    totalTime: "1-3 dias",
    totalCost: "Varia",
  },
  PASSAPORTE: {
    steps: [
      { title: "Preencha formulário online", description: "Acesse o site da Polícia Federal", time: "30 minutos" },
      { title: "Pague a GRU", description: "Taxa de emissão do passaporte", time: "1 dia", cost: "R$ 257,25" },
      { title: "Agende atendimento", description: "Escolha data e local na Polícia Federal", time: "1-4 semanas" },
      { title: "Compareça ao atendimento", description: "Leve documentos originais e comprovante de pagamento", time: "1 hora" },
      { title: "Retire o passaporte", description: "No mesmo posto ou receba por correio", time: "6-10 dias úteis" },
    ],
    totalTime: "3-6 semanas",
    totalCost: "R$ 257,25",
  },
};

export const PENALTY_INFO: Partial<Record<DocumentType, { penalty: string; estimatedValue?: number; points?: string; extras?: string[] }>> = {
  CNH: { penalty: "R$ 293,47", estimatedValue: 293.47, points: "5 pontos na carteira", extras: ["Risco de apreensão do veículo", "Infração gravíssima"] },
  CRLV: { penalty: "R$ 293,47", estimatedValue: 293.47, extras: ["Veículo pode ser apreendido", "Responsabilidade civil em acidentes"] },
  IPVA: { penalty: "Multa de 0,33% ao dia + juros", estimatedValue: 450, extras: ["Veículo não pode ser licenciado", "Pode ir a dívida ativa"] },
  PASSAPORTE: { penalty: "Viagem cancelada", estimatedValue: 3000, extras: ["Prejuízo médio: R$ 3.000", "Stress e transtorno"] },
};

export function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const diff = expiry.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export type StatusLevel = "success" | "info" | "warning" | "destructive";

export function getStatusLevel(daysLeft: number): StatusLevel {
  if (daysLeft > 90) return "success";
  if (daysLeft > 30) return "info";
  if (daysLeft > 7) return "warning";
  return "destructive";
}

export function getStatusLabel(daysLeft: number): string {
  if (daysLeft < 0) return "Vencido";
  if (daysLeft === 0) return "Vence hoje";
  if (daysLeft <= 7) return "Urgente";
  if (daysLeft <= 30) return "Atenção";
  if (daysLeft <= 90) return "Em breve";
  return "Em dia";
}

export function getProgressPercent(daysLeft: number, totalDays: number = 365): number {
  if (daysLeft <= 0) return 100;
  const elapsed = totalDays - daysLeft;
  return Math.min(100, Math.max(0, (elapsed / totalDays) * 100));
}
