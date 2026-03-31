import React from "react";
import { 
  FileText, 
  ShieldAlert, 
  Shield, 
  ShieldCheck, 
  History, 
  ChevronRight, 
  BarChart3, 
  Clock,
  Trash2
} from "lucide-react";
import { ContractRecord } from "../types";
import { cn } from "../lib/utils";

interface GlobalDashboardProps {
  records: ContractRecord[];
  onSelectRecord: (record: ContractRecord) => void;
  onDeleteRecord: (id: string) => void;
  onNewAnalysis: () => void;
}

export function GlobalDashboard({ records, onSelectRecord, onDeleteRecord, onNewAnalysis }: GlobalDashboardProps) {
  const totalHighRisk = records.reduce(
    (acc, rec) => acc + rec.result.clauses.filter(c => c.riskLevel === "High").length, 
    0
  );
  
  const totalMediumRisk = records.reduce(
    (acc, rec) => acc + rec.result.clauses.filter(c => c.riskLevel === "Medium").length, 
    0
  );

  const recentActivities = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Analysis Dashboard</h2>
          <p className="text-gray-500 mt-1">Overview of your legal risk profile across all documents.</p>
        </div>
        <button 
          onClick={onNewAnalysis}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
        >
          <FileText className="w-5 h-5" />
          New Analysis
        </button>
      </div>

      {/* Aggregate Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Contracts</p>
            <p className="text-2xl font-bold text-gray-900">{records.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-red-50 text-red-600">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">High Risk Clauses</p>
            <p className="text-2xl font-bold text-gray-900">{totalHighRisk}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Medium Risk</p>
            <p className="text-2xl font-bold text-gray-900">{totalMediumRisk}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">System Health</p>
            <p className="text-2xl font-bold text-gray-900">Active</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-gray-900">
            <History className="w-5 h-5 text-blue-500" />
            <h3 className="text-xl font-bold">Recent Analysis Activity</h3>
          </div>
          
          {records.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-gray-200 border-dashed text-center space-y-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No contracts analyzed yet. Start your first analysis to see it here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((record) => {
                const highRisk = record.result.clauses.filter(c => c.riskLevel === "High").length;
                return (
                  <div 
                    key={record.id}
                    className="group bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all duration-200 flex items-center justify-between cursor-pointer"
                    onClick={() => onSelectRecord(record)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-3 rounded-lg",
                        highRisk > 0 ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                      )}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{record.name}</h4>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(record.date).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-gray-300">•</span>
                          <span className={cn(
                            "text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded",
                            highRisk > 0 ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                          )}>
                            {highRisk} High Risk Clauses
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteRecord(record.id);
                        }}
                        className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar - Summary Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Risk Distribution
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span className="text-red-600">High Risk</span>
                  <span className="text-gray-900">{totalHighRisk}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500" 
                    style={{ width: `${Math.min(100, (totalHighRisk / (totalHighRisk + totalMediumRisk + 1)) * 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span className="text-amber-600">Medium Risk</span>
                  <span className="text-gray-900">{totalMediumRisk}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500" 
                    style={{ width: `${Math.min(100, (totalMediumRisk / (totalHighRisk + totalMediumRisk + 1)) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 leading-relaxed italic">
                * Risk distribution is calculated across all analyzed clauses in your current session.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
