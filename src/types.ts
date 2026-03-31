export type RiskLevel = "Low" | "Medium" | "High";

export interface Clause {
  id: string;
  originalText: string;
  simplifiedText: string;
  category: string;
  riskLevel: RiskLevel;
  riskExplanation: string;
}

export interface ContractRecord {
  id: string;
  name: string;
  date: string;
  result: AnalysisResult;
  text: string;
}

export interface AnalysisResult {
  clauses: Clause[];
  summary: string;
}

export interface QAHistoryItem {
  role: "user" | "assistant";
  content: string;
}
