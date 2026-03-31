import React, { useState, useEffect } from "react";
import { Gavel, Loader2, RefreshCcw, ShieldCheck, FileText, AlertCircle, LayoutDashboard, Plus } from "lucide-react";
import { FileUploader } from "./components/FileUploader";
import { AnalysisDashboard } from "./components/AnalysisDashboard";
import { GlobalDashboard } from "./components/GlobalDashboard";
import { analyzeContract } from "./services/geminiService";
import { AnalysisResult, ContractRecord } from "./types";
import { cn } from "./lib/utils";

type View = "dashboard" | "new-analysis" | "detail-view";

export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const [isProcessing, setIsProcessing] = useState(false);
  const [records, setRecords] = useState<ContractRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState<ContractRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load records from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("legal-risk-records");
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load records", e);
      }
    }
  }, []);

  // Save records to localStorage
  useEffect(() => {
    localStorage.setItem("legal-risk-records", JSON.stringify(records));
  }, [records]);

  const handleTextExtracted = async (text: string) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await analyzeContract(text);
      const newRecord: ContractRecord = {
        id: crypto.randomUUID(),
        name: `Contract Analysis ${records.length + 1}`,
        date: new Date().toISOString(),
        result,
        text
      };
      setRecords(prev => [newRecord, ...prev]);
      setCurrentRecord(newRecord);
      setView("detail-view");
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError("AI Analysis failed. Please try again with a shorter or clearer document.");
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    if (currentRecord?.id === id) {
      setCurrentRecord(null);
      setView("dashboard");
    }
  };

  const selectRecord = (record: ContractRecord) => {
    setCurrentRecord(record);
    setView("detail-view");
  };

  const startNewAnalysis = () => {
    setCurrentRecord(null);
    setView("new-analysis");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setView("dashboard")}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Gavel className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-gray-900">LegalRisk AI</h1>
              <p className="text-[10px] uppercase tracking-widest font-bold text-blue-600 -mt-0.5">Contract Analysis</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView("dashboard")}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
                view === "dashboard" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-100"
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button 
              onClick={startNewAnalysis}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
                view === "new-analysis" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-100"
              )}
            >
              <Plus className="w-4 h-4" />
              New Analysis
            </button>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Secure</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-12 px-6">
        {view === "dashboard" && (
          <GlobalDashboard 
            records={records} 
            onSelectRecord={selectRecord} 
            onDeleteRecord={deleteRecord}
            onNewAnalysis={startNewAnalysis}
          />
        )}

        {view === "new-analysis" && (
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
                Analyze contracts in <span className="text-blue-600">seconds.</span>
              </h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Upload your legal documents and let our AI extract clauses, detect risks, and simplify complex legal jargon.
              </p>
            </div>

            <div className="animate-in fade-in zoom-in-95 duration-1000 delay-200">
              <FileUploader 
                onTextExtracted={handleTextExtracted} 
                isProcessing={isProcessing} 
              />
            </div>

            {error && (
              <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-bold">Analysis Error</p>
                  <p className="text-sm opacity-90">{error}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {view === "detail-view" && currentRecord && (
          <AnalysisDashboard 
            result={currentRecord.result} 
            contractText={currentRecord.text} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50 grayscale">
            <Gavel className="w-5 h-5" />
            <span className="text-sm font-bold tracking-tighter">LEGALRISK AI</span>
          </div>
          <p className="text-xs text-gray-400 font-medium tracking-wide">
            POWERED BY GEMINI 3.1 FLASH • FOR INFORMATIONAL PURPOSES ONLY
          </p>
          <div className="flex gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
