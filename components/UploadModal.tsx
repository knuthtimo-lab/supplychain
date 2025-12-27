
import React, { useState } from 'react';
import { X, Upload, FileCheck, Loader2, Sparkles, ListChecks } from 'lucide-react';
import { extractSupplierFromImage, parseSupplierCSV } from '../geminiService';
import { Supplier } from '../types';

interface UploadModalProps {
  onClose: () => void;
  onSuccess: (supplier: Supplier) => void;
  onBulkSuccess?: (suppliers: Supplier[]) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onSuccess, onBulkSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [processType, setProcessType] = useState<'extract' | 'parse' | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    const isCSV = file.name.endsWith('.csv') || file.type === 'text/csv';

    try {
      if (isCSV) {
        setProcessType('parse');
        const reader = new FileReader();
        reader.onload = async () => {
          const text = reader.result as string;
          const suppliersData = await parseSupplierCSV(text);
          
          const newSuppliers: Supplier[] = suppliersData.map((data: any) => ({
            id: Math.random().toString(36).substr(2, 9),
            name: data.name || "Unknown Company",
            legalName: data.legalName,
            country: data.country || "Unknown",
            industry: data.industry || "General",
            riskScore: Math.floor(Math.random() * 40) + 10, // Simulated initial score
            sanctionsHit: false,
            status: 'ACTIVE',
            lastScreenedAt: new Date().toISOString(),
            news: [],
          }));

          if (onBulkSuccess) {
            onBulkSuccess(newSuppliers);
          } else if (newSuppliers.length > 0) {
            onSuccess(newSuppliers[0]);
          }
          onClose();
        };
        reader.readAsText(file);
      } else {
        setProcessType('extract');
        const reader = new FileReader();
        reader.onload = async () => {
          const base64 = (reader.result as string).split(',')[1];
          const data = await extractSupplierFromImage(base64, file.type);
          
          const newSupplier: Supplier = {
            id: Math.random().toString(36).substr(2, 9),
            name: data.name || "Unknown Company",
            legalName: data.legalName,
            country: data.country || "Unknown",
            industry: data.industry || "General",
            riskScore: Math.floor(Math.random() * 60), 
            sanctionsHit: false,
            status: 'ACTIVE',
            lastScreenedAt: new Date().toISOString(),
            news: [],
          };

          onSuccess(newSupplier);
          onClose();
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to process file. Please ensure it is a valid format.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold">Import Suppliers</h3>
            <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter border border-blue-100">AI Powered</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-8">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="relative">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                <Sparkles className="w-6 h-6 text-amber-500 absolute -top-2 -right-2 animate-bounce" />
              </div>
              <div className="text-center">
                <p className="font-bold text-lg">
                  {processType === 'parse' ? 'Mapping CSV List...' : 'Analyzing Document...'}
                </p>
                <p className="text-sm text-slate-500">Processing "{fileName}" via Gemini 3</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center bg-slate-50 group hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer relative">
                <Upload className="w-12 h-12 text-slate-300 group-hover:text-blue-500 transition-colors mb-4" />
                <p className="font-bold text-slate-600 group-hover:text-blue-700 text-center">
                  Drag & Drop CSV, Images or PDFs<br/>
                  <span className="text-xs font-normal text-slate-400">or click to browse local files</span>
                </p>
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleFileUpload}
                  accept=".csv,.xlsx,.jpg,.jpeg,.png,.pdf"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <ListChecks className="w-5 h-5 text-blue-600 mb-2" />
                  <p className="text-xs font-bold text-slate-900">Bulk Import</p>
                  <p className="text-[10px] text-slate-500 mt-1">Upload CSV lists for automated smart mapping.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <FileCheck className="w-5 h-5 text-emerald-600 mb-2" />
                  <p className="text-xs font-bold text-slate-900">AI OCR Extraction</p>
                  <p className="text-[10px] text-slate-500 mt-1">Extract data from registration docs & invoices.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
