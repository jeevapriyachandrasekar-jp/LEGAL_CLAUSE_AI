import React from "react";
import { ShieldAlert, Shield, ShieldCheck, FileText, LayoutDashboard, Search, MessageSquare } from "lucide-react";
import { AnalysisResult, Clause } from "../types";
import { ClauseCard } from "./ClauseCard";
import { QAPanel } from "./QAPanel";
import { cn } from "../lib/utils";

interface AnalysisDashboardProps {
  result: AnalysisResult;
  contractText: string;
}

export function AnalysisDashboard({ result, contractText }: AnalysisDashboardProps) {
  const riskCounts = result.clauses.reduce(
    (acc, clause) => {
      acc[clause.riskLevel]++;
      return acc;
    },
    { High: 0, Medium: 0, Low: 0 }
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Clauses</p>
            <p className="text-2xl font-bold text-gray-900">{result.clauses.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-red-50 text-red-600">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">High Risk</p>
            <p className="text-2xl font-bold text-gray-900">{riskCounts.High}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Medium Risk</p>
            <p className="text-2xl font-bold text-gray-900">{riskCounts.Medium}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Low Risk</p>
            <p className="text-2xl font-bold text-gray-900">{riskCounts.Low}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Analysis Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Section */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-gray-900">
              <LayoutDashboard className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-bold">Executive Summary</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg">
              {result.summary}
            </p>
          </div>

          {/* Clause List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-900">
                <Search className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-bold">Analyzed Clauses</h2>
              </div>
              <span className="text-xs font-medium text-gray-400">
                Sorted by extraction order
              </span>
            </div>
            <div className="space-y-3">
              {result.clauses.map((clause) => (
                <ClauseCard key={clause.id} clause={clause} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - QA Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <QAPanel contractText={contractText} clauses={result.clauses} />
          </div>
        </div>
      </div>
    </div>
  );
}
