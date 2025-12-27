
import React, { useState } from 'react';
import { 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Languages, 
  RefreshCcw,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Supplier, QuestionnaireStatus, QuestionnaireType } from '../types';
import { validateQuestionnaireResponse } from '../geminiService';

interface QuestionnaireWorkflowProps {
  supplier: Supplier;
  onUpdate: (updatedSupplier: Supplier) => void;
}

const QuestionnaireWorkflow: React.FC<QuestionnaireWorkflowProps> = ({ supplier, onUpdate }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'preview'>('status');

  const getQuestionnaireType = (score: number): QuestionnaireType => {
    if (score > 60) return QuestionnaireType.COMPREHENSIVE;
    if (score >= 30) return QuestionnaireType.STANDARD;
    return QuestionnaireType.BASIC;
  };

  const type = supplier.questionnaire?.type || getQuestionnaireType(supplier.riskScore);

  const handleSend = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      const updatedSupplier: Supplier = {
        ...supplier,
        questionnaire: {
          id: `q-${Date.now()}`,
          type: type,
          status: QuestionnaireStatus.SENT,
          language: 'EN',
          sentAt: new Date().toISOString(),
        }
      };
      onUpdate(updatedSupplier);
      setIsProcessing(false);
    }, 1200);
  };

  const handleMockResponse = async () => {
    setIsProcessing(true);
    const mockResponses = {
      "child_labor_policy": "We strictly prohibit child labor and conduct biannual audits of all subcontractors.",
      "environmental_impact": "We have reduced carbon emissions by 15% and recycled 80% of factory waste.",
      "code_of_conduct": "Yes, all employees sign our code of conduct upon hiring."
    };

    try {
      const aiResult = await validateQuestionnaireResponse(mockResponses);
      
      const updatedSupplier: Supplier = {
        ...supplier,
        questionnaire: {
          ...supplier.questionnaire!,
          status: QuestionnaireStatus.COMPLETED,
          completedAt: new Date().toISOString(),
          responses: mockResponses,
          aiScore: aiResult.score,
          aiFeedback: aiResult.feedback
        }
      };
      onUpdate(updatedSupplier);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendReminder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const updatedSupplier: Supplier = {
        ...supplier,
        questionnaire: {
          ...supplier.questionnaire!,
          lastReminderAt: new Date().toISOString(),
        }
      };
      onUpdate(updatedSupplier);
      setIsProcessing(false);
    }, 800);
  };

  const status = supplier.questionnaire?.status || QuestionnaireStatus.NOT_SENT;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
            <RefreshCcw className={`w-5 h-5 text-blue-600 ${isProcessing ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Automated Questionnaire</h3>
            <p className="text-xs text-slate-500">Tier: {type} based on risk score {supplier.riskScore}</p>
          </div>
        </div>

        <div className="flex bg-white border border-slate-200 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('status')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'status' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Workflow
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'preview' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Preview
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'status' ? (
          <div className="space-y-8">
            {/* Progress Track */}
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
              <Step icon={<Send />} label="Sent" active={status !== QuestionnaireStatus.NOT_SENT} />
              <Step icon={<Clock />} label="Pending" active={status === QuestionnaireStatus.SENT || status === QuestionnaireStatus.PENDING} />
              <Step icon={<CheckCircle2 />} label="Completed" active={status === QuestionnaireStatus.COMPLETED} />
            </div>

            {/* Content Based on Status */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              {status === QuestionnaireStatus.NOT_SENT && (
                <div className="text-center space-y-4">
                  <p className="text-sm text-slate-600">No questionnaire has been sent to this supplier yet.</p>
                  <div className="flex items-center justify-center gap-4">
                    <button 
                      onClick={handleSend}
                      disabled={isProcessing}
                      className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      Send {type} Questionnaire
                    </button>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Languages className="w-4 h-4" />
                      <span className="text-xs font-medium">Auto-detected: English</span>
                    </div>
                  </div>
                </div>
              )}

              {status === QuestionnaireStatus.SENT && (
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-slate-900">Awaiting Response</p>
                      <p className="text-xs text-slate-500 mt-1">Sent on {new Date(supplier.questionnaire?.sentAt!).toLocaleDateString()}</p>
                    </div>
                    <button 
                      onClick={handleSendReminder}
                      disabled={isProcessing}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      {supplier.questionnaire?.lastReminderAt ? 'Resend Reminder' : 'Send Reminder'}
                    </button>
                  </div>
                  {supplier.questionnaire?.lastReminderAt && (
                    <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider bg-amber-50 px-2 py-1 rounded inline-block">
                      Last Reminder: {new Date(supplier.questionnaire.lastReminderAt).toLocaleTimeString()}
                    </p>
                  )}
                  <div className="pt-4 border-t border-slate-200">
                    <button 
                      onClick={handleMockResponse}
                      disabled={isProcessing}
                      className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 italic"
                    >
                      (Simulate Response Arrival)
                    </button>
                  </div>
                </div>
              )}

              {status === QuestionnaireStatus.COMPLETED && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      <h4 className="font-bold text-slate-900">AI Validation Complete</h4>
                    </div>
                    <div className="bg-white px-3 py-1 rounded-full border border-slate-200 flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">AI Score</span>
                      <span className={`text-sm font-black ${supplier.questionnaire?.aiScore! > 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {supplier.questionnaire?.aiScore}/100
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed bg-white p-4 rounded-xl border border-slate-100 shadow-sm italic">
                    "{supplier.questionnaire?.aiFeedback}"
                  </p>
                  <button className="flex items-center justify-center gap-2 w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">
                    View Full Responses <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4 opacity-50 select-none">
            <h4 className="text-sm font-bold text-slate-900">Preview: {type} Template</h4>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Q1: Child Labor Policy</p>
                <div className="h-2 w-3/4 bg-slate-200 rounded" />
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Q2: Environmental Certification</p>
                <div className="h-2 w-1/2 bg-slate-200 rounded" />
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Q3: Supplier Code of Conduct</p>
                <div className="h-2 w-2/3 bg-slate-200 rounded" />
              </div>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-4">Multi-language support (DE, CN, ES, FR) applied during delivery.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Step: React.FC<{ icon: React.ReactNode; label: string; active: boolean }> = ({ icon, label, active }) => (
  <div className="flex flex-col items-center gap-2 relative z-10">
    <div className={`p-2.5 rounded-full border transition-all duration-500 ${active ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border-slate-200 text-slate-300'}`}>
      {React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4' })}
    </div>
    <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? 'text-blue-600' : 'text-slate-400'}`}>{label}</span>
  </div>
);

export default QuestionnaireWorkflow;
