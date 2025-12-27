
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Globe, 
  Mail, 
  ShieldAlert, 
  History, 
  ExternalLink,
  MessageSquare,
  Volume2,
  FileCheck
} from 'lucide-react';
import { Supplier, RiskLevel } from '../types';
import RiskBadge from './RiskBadge';
import { analyzeSupplierNews, generateAlertSpeech } from '../geminiService';
import QuestionnaireWorkflow from './QuestionnaireWorkflow';

interface SupplierDetailProps {
  supplier: Supplier;
  onBack: () => void;
  onUpdateSupplier?: (updated: Supplier) => void;
}

const SupplierDetail: React.FC<SupplierDetailProps> = ({ supplier, onBack, onUpdateSupplier }) => {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeTab, setActiveTab] = useState<'monitoring' | 'questionnaire'>('monitoring');

  const getAiAnalysis = async () => {
    setIsLoadingInsight(true);
    try {
      const analysis = await analyzeSupplierNews(supplier.name);
      setAiInsight(analysis.text);
    } catch (err) {
      console.error(err);
      setAiInsight("Failed to fetch AI insights. Check API key.");
    } finally {
      setIsLoadingInsight(false);
    }
  };

  const playAlertSpeech = async (text: string) => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    try {
      const base64 = await generateAlertSpeech(text.substring(0, 500));
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const dataInt16 = new Int16Array(bytes.buffer);
      const frameCount = dataInt16.length;
      const buffer = audioCtx.createBuffer(1, frameCount, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }

      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.onended = () => setIsPlayingAudio(false);
      source.start();
    } catch (err) {
      console.error(err);
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to List
      </button>

      {/* Header Section */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-3xl font-bold shadow-xl">
            {supplier.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{supplier.name}</h1>
            <div className="flex flex-wrap gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin className="w-4 h-4" /> {supplier.country}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <Globe className="w-4 h-4" /> {supplier.industry}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${supplier.status === 'BLOCKED' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                {supplier.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 bg-slate-50 px-8 py-4 rounded-2xl border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Risk Score</p>
          <div className="text-4xl font-black text-slate-900">{supplier.riskScore}</div>
          <RiskBadge score={supplier.riskScore} showText={false} />
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex border-b border-slate-200">
        <TabButton 
          active={activeTab === 'monitoring'} 
          onClick={() => setActiveTab('monitoring')}
          label="Risk Monitoring"
          icon={<History className="w-4 h-4" />}
        />
        <TabButton 
          active={activeTab === 'questionnaire'} 
          onClick={() => setActiveTab('questionnaire')}
          label="Compliance Questionnaire"
          icon={<FileCheck className="w-4 h-4" />}
        />
      </div>

      {activeTab === 'monitoring' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details & News */}
          <div className="lg:col-span-2 space-y-8">
            {/* News Feed */}
            <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">News & Incidents</h3>
                <button 
                  onClick={getAiAnalysis}
                  disabled={isLoadingInsight}
                  className="flex items-center gap-2 text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors disabled:opacity-50"
                >
                  <MessageSquare className="w-3 h-3" />
                  {isLoadingInsight ? 'Analyzing...' : 'Refresh AI Analysis'}
                </button>
              </div>

              {aiInsight && (
                <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100 relative group">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-blue-800 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" /> SupplyGuard AI Insights
                    </h4>
                    <button 
                      onClick={() => playAlertSpeech(aiInsight)}
                      className="p-1 hover:bg-blue-200 rounded transition-colors text-blue-600"
                      title="Read aloud"
                    >
                      <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
                    </button>
                  </div>
                  <p className="text-sm text-blue-700 leading-relaxed italic">
                    "{aiInsight}"
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Source: Real-time News Search</span>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {supplier.news.length > 0 ? (
                  supplier.news.map(article => (
                    <div key={article.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer">{article.title}</h4>
                          <div className="flex gap-4 mt-1 text-xs text-slate-400">
                            <span>{article.source}</span>
                            <span>•</span>
                            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded text-[10px] font-bold ${article.severity > 7 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                          Severity: {article.severity}/10
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-slate-600 leading-relaxed">{article.summary}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {article.risks.map(risk => (
                          <span key={risk} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase">{risk}</span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <History className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">No negative incidents recorded in the last 12 months.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Actions & Compliance Info */}
          <div className="space-y-8">
            <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold">Quick Actions</h3>
              <div className="space-y-3">
                <ActionButton 
                  label="Initiate Audit" 
                  icon={<Mail />} 
                  color="blue" 
                  onClick={() => setActiveTab('questionnaire')}
                />
                <ActionButton label="Internal Report" icon={<History />} color="slate" />
                <ActionButton label="Block Supplier" icon={<ShieldAlert />} color="red" />
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold">Verified Certificates</h3>
              <div className="space-y-3">
                <DocItem name="ISO 14001 Certification" status="Valid" date="Expires 2025" />
                <DocItem name="Labor Rights Agreement" status="Pending" date="Awaiting Signature" />
                <DocItem name="Code of Conduct" status="Valid" date="Last signed Nov 2024" />
              </div>
            </section>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto py-4">
          <QuestionnaireWorkflow 
            supplier={supplier} 
            onUpdate={(updated) => onUpdateSupplier?.(updated)} 
          />
        </div>
      )}
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all border-b-2 ${active ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
  >
    {icon}
    {label}
  </button>
);

const ActionButton: React.FC<{ label: string; icon: React.ReactNode; color: 'blue' | 'red' | 'slate'; onClick?: () => void }> = ({ label, icon, color, onClick }) => {
  const styles = {
    blue: 'bg-blue-600 text-white hover:bg-blue-700',
    red: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100',
    slate: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  };
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${styles[color]}`}>
      {React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4' })}
      {label}
    </button>
  );
};

const DocItem: React.FC<{ name: string; status: string; date: string }> = ({ name, status, date }) => (
  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-100 text-slate-400">
        <ExternalLink className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-900">{name}</p>
        <p className="text-[10px] text-slate-400">{date}</p>
      </div>
    </div>
    <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${status === 'Valid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
      {status}
    </span>
  </div>
);

export default SupplierDetail;
