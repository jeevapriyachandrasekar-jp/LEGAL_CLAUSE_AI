import React, { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, ShieldCheck, ShieldAlert, Shield, FileText } from "lucide-react";
import { Clause, RiskLevel } from "../types";
import { cn } from "../lib/utils";

interface ClauseCardProps {
  clause: Clause;
}

const riskStyles: Record<RiskLevel, { bg: string; text: string; icon: any; border: string }> = {
  High: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-100",
    icon: ShieldAlert,
  },
  Medium: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-100",
    icon: Shield,
  },
  Low: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-100",
    icon: ShieldCheck,
  },
};

export function ClauseCard({ clause }: ClauseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const style = riskStyles[clause.riskLevel];
  const Icon = style.icon;

  return (
    <div className={cn("rounded-xl border transition-all duration-200 overflow-hidden bg-white", style.border)}>
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className={cn("p-2 rounded-lg", style.bg, style.text)}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{clause.category}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={cn("text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded", style.bg, style.text)}>
                {clause.riskLevel} Risk
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 truncate max-w-[200px] md:max-w-md">
                {clause.originalText.slice(0, 80)}...
              </span>
            </div>
          </div>
        </div>
        <div className="text-gray-400">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-gray-100 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 flex items-center gap-1.5">
                <FileText className="w-3 h-3" /> Original Clause
              </label>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                "{clause.originalText}"
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3" /> Simplified Language
              </label>
              <p className="text-sm text-gray-900 leading-relaxed font-medium">
                {clause.simplifiedText}
              </p>
            </div>
          </div>

          <div className={cn("p-4 rounded-lg flex gap-3", style.bg)}>
            <AlertTriangle className={cn("w-5 h-5 shrink-0", style.text)} />
            <div className="space-y-1">
              <p className={cn("text-xs font-bold uppercase tracking-wider", style.text)}>Risk Analysis</p>
              <p className={cn("text-sm leading-relaxed", style.text)}>
                {clause.riskExplanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
