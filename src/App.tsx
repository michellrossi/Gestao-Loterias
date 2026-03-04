import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { 
  LayoutDashboard, 
  Users, 
  CircleDollarSign, 
  Trophy, 
  Settings, 
  LogOut, 
  Moon, 
  Sun,
  Menu,
  X,
  TrendingUp,
  History,
  Trash2,
  Edit,
  Camera,
  AlertTriangle,
  Check,
  FileText,
  Gamepad2,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Participant, Contribution, Draw, Bet, User, DashboardStats } from './types';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 shadow-lg' 
        : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ label, value, icon: Icon, trend, colorClass }: { label: string, value: string, icon: any, trend?: string, colorClass?: string }) => (
  <div className={`card flex flex-col gap-2 border-2 ${colorClass || 'border-zinc-900 dark:border-zinc-50'}`}>
    <div className="flex justify-between items-start">
      <div className={`p-2 rounded-lg ${colorClass ? colorClass.replace('border-', 'bg-').replace('500', '500/10') : 'bg-zinc-100 dark:bg-zinc-800'}`}>
        <Icon size={20} className={colorClass ? colorClass.replace('border-', 'text-') : 'text-zinc-600 dark:text-zinc-400'} />
      </div>
      {trend && (
        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <span className="text-sm text-zinc-500 font-medium">{label}</span>
    <span className="text-2xl font-semibold tracking-tight">{value}</span>
  </div>
);

// --- Pages ---

const Dashboard = ({ stats, draws }: { stats: DashboardStats | null, draws: Draw[] }) => {
  if (!stats) return null;

  const DRAW_COLORS = ['#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444'];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Arrecadado" value={`R$ ${stats.totalCollected.toLocaleString('pt-BR')}`} icon={CircleDollarSign} colorClass="border-amber-500" />
        <StatCard label="Total Investido" value={`R$ ${stats.totalInvested.toLocaleString('pt-BR')}`} icon={TrendingUp} colorClass="border-emerald-500" />
        <StatCard label="Saldo em Caixa" value={`R$ ${stats.cashAvailable.toLocaleString('pt-BR')}`} icon={CircleDollarSign} colorClass="border-blue-500" />
        <StatCard label="Participantes Ativos" value={stats.activeParticipants.toString()} icon={Users} colorClass="border-violet-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card border-2 border-amber-500/20">
          <h3 className="text-lg font-semibold mb-6">Distribuição por Concurso</h3>
          <div className="space-y-6">
            {draws.map((d, i) => {
              const amount = stats.totalCollected * (d.allocation_percentage / 100);
              const color = DRAW_COLORS[i % DRAW_COLORS.length];
              return (
                <div key={d.id} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.realized ? '#94a3b8' : color }} />
                      <span className={d.realized ? 'text-zinc-400' : 'text-zinc-700 dark:text-zinc-300'}>{d.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {d.realized ? (
                        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Realizado</span>
                      ) : (
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {d.allocation_percentage.toFixed(0)}% — R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${d.allocation_percentage}%` }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: d.realized ? '#cbd5e1' : color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card border-2 border-emerald-500/20">
          <h3 className="text-lg font-semibold mb-6">Próximo Concurso</h3>
          {stats.nextDraw ? (
            <div className="space-y-6">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Sorteio</span>
                <h4 className="text-xl font-semibold">{stats.nextDraw.name}</h4>
                <p className="text-zinc-500 mt-1">Data: {new Date(stats.nextDraw.date).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 rounded-xl">
                  <span className="text-xs opacity-70 uppercase font-semibold">Aporte Estimado</span>
                  <p className="text-2xl font-semibold">R$ {(stats.totalCollected * (stats.nextDraw.allocation_percentage / 100)).toLocaleString('pt-BR')}</p>
                </div>
                <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                  <span className="text-xs text-zinc-500 uppercase font-semibold">Percentual Atual</span>
                  <p className="text-2xl font-semibold">{stats.nextDraw.allocation_percentage.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-zinc-500">Nenhum sorteio pendente.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const ParticipantsList = ({ participants, contributions, onUpdate }: { participants: Participant[], contributions: Contribution[], onUpdate: () => void }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editing, setEditing] = useState<Participant | null>(null);
  const [form, setForm] = useState({ name: '', active: true, avatar_url: '' });
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      if (!fileExt) throw new Error('Arquivo sem extensão');
      
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setForm({ ...form, avatar_url: publicUrl });
    } catch (error: any) {
      alert(`Erro no upload: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.name) return;
    const { error } = await supabase
      .from('participants')
      .insert([{ name: form.name, active: form.active, avatar_url: form.avatar_url }]);
    
    if (error) {
      alert(`Erro ao adicionar: ${error.message}`);
      return;
    }
    setForm({ name: '', active: true, avatar_url: '' });
    setIsAdding(false);
    onUpdate();
  };

  const handleUpdate = async () => {
    if (!editing || !form.name) return;
    const { error } = await supabase
      .from('participants')
      .update({ name: form.name, active: form.active, avatar_url: form.avatar_url })
      .eq('id', editing.id);
    
    if (error) {
      alert(`Erro ao atualizar: ${error.message}`);
      return;
    }
    setEditing(null);
    setForm({ name: '', active: true, avatar_url: '' });
    onUpdate();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este participante?')) return;
    const { error } = await supabase
      .from('participants')
      .delete()
      .eq('id', id);
    
    if (error) {
      alert(`Erro ao excluir: ${error.message}`);
      return;
    }
    onUpdate();
  };

  const startEdit = (p: Participant) => {
    setEditing(p);
    setForm({ name: p.name, active: p.active === 1 || p.active === true as any, avatar_url: p.avatar_url || '' });
  };

  const getStatus = (p: Participant) => {
    if (!p.active) return { label: 'Pausado', color: 'bg-zinc-400', sub: 'Inativo' };
    
    const currentMonth = new Date().toISOString().slice(0, 7);
    const hasPaidCurrent = contributions.some(c => c.participant_id === p.id && c.month === currentMonth);
    
    if (hasPaidCurrent) return { label: 'Pago', color: 'bg-emerald-500', sub: 'Ativo' };
    
    const monthName = new Date().toLocaleString('pt-BR', { month: 'short' });
    return { label: `Pendente ${monthName}`, color: 'bg-amber-500', sub: 'Ativo' };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Participantes</h2>
        <button onClick={() => { setIsAdding(true); setEditing(null); setForm({ name: '', active: true, avatar_url: '' }); }} className="btn-primary flex items-center gap-2">
          <Users size={18} />
          Novo Participante
        </button>
      </div>

      <AnimatePresence>
        {(isAdding || editing) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="card w-full max-w-md space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">{editing ? 'Editar Participante' : 'Novo Participante'}</h3>
                <button onClick={() => { setIsAdding(false); setEditing(null); }}><X size={20} /></button>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col items-center gap-4 mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-4 border-white dark:border-zinc-900 shadow-lg relative group">
                    {form.avatar_url ? (
                      <img src={form.avatar_url} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400">
                        <Users size={40} />
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Upload size={24} className="text-white" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                    </label>
                  </div>
                  {uploading && <span className="text-xs text-zinc-500 animate-pulse">Enviando...</span>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-500 mb-1">Nome Completo</label>
                  <input 
                    type="text" 
                    placeholder="Ex: João Silva" 
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-2"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-500 mb-1">URL da Foto (Opcional)</label>
                  <input 
                    type="text" 
                    placeholder="https://..." 
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-2"
                    value={form.avatar_url}
                    onChange={(e) => setForm({...form, avatar_url: e.target.value})}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="active"
                    checked={form.active}
                    onChange={(e) => setForm({...form, active: e.target.checked})}
                  />
                  <label htmlFor="active" className="text-sm font-medium">Participante Ativo</label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button onClick={editing ? handleUpdate : handleAdd} className="btn-primary flex-1" disabled={uploading}>
                  {editing ? 'Salvar Alterações' : 'Adicionar'}
                </button>
                <button onClick={() => { setIsAdding(false); setEditing(null); }} className="btn-secondary">Cancelar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {participants.map(p => {
          const status = getStatus(p);
          const totalPaid = contributions
            .filter(c => c.participant_id === p.id)
            .reduce((acc, c) => acc + c.amount, 0);

          return (
            <div key={p.id} className="card flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-2 border-white dark:border-zinc-900 shadow-sm">
                    {p.avatar_url ? (
                      <img src={p.avatar_url} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400">
                        <Users size={20} />
                      </div>
                    )}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 ${status.color}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 leading-tight">{p.name}</h4>
                  <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider">
                    <span className={status.color.replace('bg-', 'text-')}>{status.label}</span>
                    <span className="text-zinc-300 dark:text-zinc-700">•</span>
                    <span className="text-zinc-400">{status.sub}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-lg font-semibold">R$ {totalPaid.toLocaleString('pt-BR')}</span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(p)} className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-1 text-zinc-400 hover:text-rose-500">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ContributionsList = ({ participants, contributions, onUpdate }: { participants: Participant[], contributions: Contribution[], onUpdate: () => void }) => {
  const currentYear = new Date().getFullYear();
  const currentMonthIdx = new Date().getMonth(); // 0-11
  
  const months = [
    { id: '01', label: 'JAN' },
    { id: '02', label: 'FEV' },
    { id: '03', label: 'MAR' },
    { id: '04', label: 'ABR' },
    { id: '05', label: 'MAI' },
    { id: '06', label: 'JUN' },
    { id: '07', label: 'JUL' },
    { id: '08', label: 'AGO' },
    { id: '09', label: 'SET' },
    { id: '10', label: 'OUT' },
    { id: '11', label: 'NOV' },
    { id: '12', label: 'DEZ' }
  ];

  const handleToggle = async (participantId: number, monthId: string) => {
    const monthStr = `${currentYear}-${monthId}`;
    const existing = contributions.find(c => c.participant_id === participantId && c.month === monthStr);

    if (existing) {
      const { error } = await supabase
        .from('contributions')
        .delete()
        .eq('id', existing.id);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase
        .from('contributions')
        .insert([{ participant_id: participantId, amount: 50, month: monthStr }]);
      if (error) alert(error.message);
    }
    onUpdate();
  };

  const getMonthTotal = (monthId: string) => {
    const monthStr = `${currentYear}-${monthId}`;
    return contributions
      .filter(c => c.month === monthStr)
      .reduce((acc, c) => acc + c.amount, 0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-1">Controle de Aportes</h2>
        <p className="text-zinc-500 font-medium">Clique no ícone para alternar o status de pagamento (R$ 50,00/mês)</p>
      </div>

      <div className="card p-0 overflow-hidden border-zinc-200 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 border-r border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 sticky left-0 z-10">
                  Participante
                </th>
                {months.map(m => (
                  <th key={m.id} className="px-2 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-center">
                    {m.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {participants.filter(p => p.active).map(p => (
                <tr key={p.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100 border-r border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky left-0 z-10">
                    {p.name}
                  </td>
                  {months.map((m, idx) => {
                    const monthStr = `${currentYear}-${m.id}`;
                    const isPaid = contributions.some(c => c.participant_id === p.id && c.month === monthStr);
                    const isPast = idx < currentMonthIdx;
                    const isCurrent = idx === currentMonthIdx;

                    return (
                      <td key={m.id} className="px-2 py-3 text-center">
                        <button 
                          onClick={() => handleToggle(p.id, m.id)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto transition-all transform active:scale-90 ${
                            isPaid 
                              ? 'bg-emerald-500/10 text-emerald-500 border-2 border-emerald-500/20 hover:bg-emerald-500/20' 
                              : (isPast || isCurrent)
                                ? 'bg-rose-500/10 text-rose-500 border-2 border-rose-500/20 hover:bg-rose-500/20'
                                : 'text-zinc-300 dark:text-zinc-700'
                          }`}
                        >
                          {isPaid ? (
                            <Check size={18} strokeWidth={3} />
                          ) : (isPast || isCurrent) ? (
                            <AlertTriangle size={18} strokeWidth={3} />
                          ) : (
                            <span className="font-bold opacity-30">—</span>
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-t-2 border-zinc-200 dark:border-zinc-800">
                <td className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 border-r border-zinc-100 dark:border-zinc-800 sticky left-0 z-10 bg-zinc-50 dark:bg-zinc-900">
                  Arrecadação
                </td>
                {months.map(m => {
                  const total = getMonthTotal(m.id);
                  return (
                    <td key={m.id} className="px-2 py-6 text-center font-bold text-sm">
                      {total > 0 ? (
                        <span className="text-zinc-900 dark:text-zinc-100">{total}</span>
                      ) : (
                        <span className="text-zinc-300 dark:text-zinc-700 opacity-30">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

const CircularProgress = ({ percentage, colorClass }: { percentage: number, colorClass: string }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-20 h-20">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          className="text-zinc-100 dark:text-zinc-800"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={colorClass}
        />
      </svg>
      <span className="absolute text-xs font-bold">{Math.round(percentage)}%</span>
    </div>
  );
};

const DrawsList = ({ draws, stats, onUpdate }: { draws: Draw[], stats: DashboardStats | null, onUpdate: () => void }) => {
  const [editing, setEditing] = useState<Draw | null>(null);

  const DRAW_COLORS = [
    { text: 'text-amber-500', bg: 'bg-amber-500', border: 'border-amber-500', lightBorder: 'border-amber-500/50' },
    { text: 'text-emerald-500', bg: 'bg-emerald-500', border: 'border-emerald-500', lightBorder: 'border-emerald-500/50' },
    { text: 'text-blue-500', bg: 'bg-blue-500', border: 'border-blue-500', lightBorder: 'border-blue-500/50' },
    { text: 'text-violet-500', bg: 'bg-violet-500', border: 'border-violet-500', lightBorder: 'border-violet-500/50' }
  ];

  const formatPrize = (value: number) => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
    return value.toLocaleString('pt-BR');
  };

  const handleSave = async () => {
    if (!editing) return;
    
    const { error: updateError } = await supabase
      .from('draws')
      .update({
        realized: editing.realized === 1,
        result: editing.result,
        prize: editing.prize,
        estimated_prize: editing.estimated_prize,
        allocation_percentage: editing.allocation_percentage
      })
      .eq('id', editing.id);

    if (updateError) {
      alert(`Erro ao salvar: ${updateError.message}`);
      return;
    }

    // Logic for redistribution if realized
    if (editing.realized === 1) {
      const { data: remainingDraws } = await supabase
        .from('draws')
        .select('*')
        .eq('realized', false);

      if (remainingDraws && remainingDraws.length > 0) {
        const totalRemaining = remainingDraws.reduce((acc, d) => acc + d.allocation_percentage, 0);
        const realizedPercentage = editing.allocation_percentage || 0;
        
        for (const d of remainingDraws) {
          const newPercentage = d.allocation_percentage + (d.allocation_percentage / totalRemaining) * realizedPercentage;
          await supabase.from('draws').update({ allocation_percentage: newPercentage }).eq('id', d.id);
        }
        
        await supabase.from('draws').update({ allocation_percentage: 0 }).eq('id', editing.id);
      }
    }

    setEditing(null);
    onUpdate();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Concursos Especiais</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {draws.map((d, i) => {
          const totalPotentialYearly = (stats?.activeParticipants || 0) * 50 * 12;
          const drawGoal = totalPotentialYearly * (d.allocation_percentage / 100);
          const drawCollected = (stats?.totalCollected || 0) * (d.allocation_percentage / 100);
          const progress = drawGoal > 0 ? (drawCollected / drawGoal) * 100 : 0;
          const color = DRAW_COLORS[i % DRAW_COLORS.length];

          return (
            <div key={d.id} className={`card relative overflow-hidden group border-2 transition-all hover:shadow-md ${color.border} dark:${color.lightBorder}`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{d.name}</h3>
                  <p className="text-sm text-zinc-400 font-medium">
                    {new Date(d.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest ${
                  d.realized 
                    ? 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800' 
                    : 'bg-cyan-50 text-cyan-500 dark:bg-cyan-900/20'
                }`}>
                  {d.realized ? 'REALIZADO' : 'ABERTO'}
                </span>
              </div>

              <div className="flex items-center gap-6 mb-8">
                <CircularProgress percentage={progress} colorClass={color.text} />
                <div>
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                    {d.realized ? 'Prêmio Recebido' : 'Prêmio Estimado'}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-semibold">R$</span>
                    <span className="text-3xl font-bold tracking-tight">
                      {d.realized 
                        ? formatPrize(d.prize)
                        : (d.estimated_prize ? formatPrize(d.estimated_prize) : '—')
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-sm text-zinc-500 font-medium">Meta de Arrecadação</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold">R$ {Math.round(drawCollected).toLocaleString('pt-BR')}</span>
                    <span className="text-sm text-zinc-400 font-medium"> / R$ {Math.round(drawGoal).toLocaleString('pt-BR')}</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    className={`h-full rounded-full ${color.bg}`}
                  />
                </div>
              </div>

              {d.result && (
                <div className="mt-6 p-3 bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 rounded-xl">
                  <span className="text-[10px] opacity-70 font-semibold uppercase">Resultado</span>
                  <p className="text-lg font-mono font-semibold">{d.result}</p>
                </div>
              )}

              <button 
                onClick={() => setEditing(d)}
                className="mt-6 w-full py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors uppercase tracking-widest"
              >
                Gerenciar Concurso
              </button>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {editing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="card w-full max-w-md space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">{editing.name}</h3>
                <button onClick={() => setEditing(null)}><X size={20} /></button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="realized"
                    checked={editing.realized === 1}
                    onChange={(e) => setEditing({...editing, realized: e.target.checked ? 1 : 0})}
                  />
                  <label htmlFor="realized" className="font-medium">Sorteio Realizado</label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-500 mb-1">Resultado (Dezenas)</label>
                  <input 
                    type="text" 
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-2"
                    value={editing.result || ''}
                    onChange={(e) => setEditing({...editing, result: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-500 mb-1">Prêmio Estimado (R$)</label>
                  <input 
                    type="number" 
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-2"
                    value={editing.estimated_prize || 0}
                    onChange={(e) => setEditing({...editing, estimated_prize: Number(e.target.value)})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-500 mb-1">Prêmio Recebido (R$)</label>
                  <input 
                    type="number" 
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-2"
                    value={editing.prize}
                    onChange={(e) => setEditing({...editing, prize: Number(e.target.value)})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-500 mb-1">Percentual de Alocação (%)</label>
                  <input 
                    type="number" 
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-2"
                    value={editing.allocation_percentage}
                    onChange={(e) => setEditing({...editing, allocation_percentage: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button onClick={handleSave} className="btn-primary flex-1">Salvar Alterações</button>
                <button onClick={() => setEditing(null)} className="btn-secondary">Cancelar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ReportsList = ({ stats, draws, contributions }: { stats: DashboardStats | null, draws: Draw[], contributions: Contribution[] }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Relatórios de Transparência</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card border-2 border-zinc-100 dark:border-zinc-800">
          <h3 className="text-lg font-semibold mb-4">Resumo Financeiro</h3>
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-zinc-50 dark:border-zinc-900">
              <span className="text-zinc-500">Total Arrecadado</span>
              <span className="font-semibold">R$ {stats?.totalCollected.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-zinc-50 dark:border-zinc-900">
              <span className="text-zinc-500">Total em Apostas</span>
              <span className="font-semibold text-rose-500">R$ {stats?.totalInvested.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-zinc-50 dark:border-zinc-900">
              <span className="text-zinc-500">Saldo Disponível</span>
              <span className="font-semibold text-emerald-500">R$ {stats?.cashAvailable.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>

        <div className="card border-2 border-zinc-100 dark:border-zinc-800">
          <h3 className="text-lg font-semibold mb-4">Próximas Alocações</h3>
          <div className="space-y-4">
            {draws.filter(d => !d.realized).map(d => (
              <div key={d.id} className="flex justify-between py-2 border-b border-zinc-50 dark:border-zinc-900">
                <span className="text-zinc-500">{d.name}</span>
                <span className="font-semibold">R$ {(stats?.totalCollected ? stats.totalCollected * (d.allocation_percentage / 100) : 0).toLocaleString('pt-BR')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card border-2 border-zinc-100 dark:border-zinc-800">
        <h3 className="text-lg font-semibold mb-4">Histórico de Contribuições</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800">
                <th className="pb-3">Participante</th>
                <th className="pb-3">Mês</th>
                <th className="pb-3">Valor</th>
                <th className="pb-3">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
              {contributions.slice(0, 20).map(c => (
                <tr key={c.id} className="text-sm">
                  <td className="py-3 font-medium">{c.participant_name}</td>
                  <td className="py-3 text-zinc-500">{c.month}</td>
                  <td className="py-3 font-semibold">R$ {c.amount.toLocaleString('pt-BR')}</td>
                  <td className="py-3 text-zinc-400">{new Date(c.paid_at).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const GamesList = () => {
  const [activeGame, setActiveGame] = useState('lotofacil');

  const games = {
    lotofacil: {
      name: 'Lotofácil',
      minNumbers: 15,
      maxNumbers: 20,
      range: '1 a 25',
      costs: [
        { qty: '15 números', price: 'R$ 3,50' },
        { qty: '16 números', price: 'R$ 56,00' },
        { qty: '17 números', price: 'R$ 476,00' },
        { qty: '18 números', price: 'R$ 2.856,00' },
        { qty: '19 números', price: 'R$ 13.566,00' },
        { qty: '20 números', price: 'R$ 54.264,00' },
      ],
      prizeRules: 'Ganha prêmio quem acertar 11, 12, 13, 14 ou 15 números.',
      mainPrizeAcertos: 15,
      desc: 'O jogador escolhe de 15 a 20 números entre 1 e 25. Os sorteios acontecem às segundas, quartas e sextas-feiras. É uma das modalidades com maiores chances estatísticas de premiação.',
      prob: '1 em 3.268.760 (15 acertos com 15 números)',
      color: 'bg-violet-600'
    },
    quina: {
      name: 'Quina',
      minNumbers: 5,
      maxNumbers: 15,
      range: '1 a 80',
      costs: [
        { qty: '5 números', price: 'R$ 3,00' },
        { qty: '6 números', price: 'R$ 18,00' },
        { qty: '7 números', price: 'R$ 63,00' },
        { qty: '8 números', price: 'R$ 168,00' },
        { qty: '9 números', price: 'R$ 378,00' },
        { qty: '10 números', price: 'R$ 756,00' },
        { qty: '11 números', price: 'R$ 1.386,00' },
        { qty: '12 números', price: 'R$ 2.376,00' },
        { qty: '13 números', price: 'R$ 3.861,00' },
        { qty: '14 números', price: 'R$ 6.006,00' },
        { qty: '15 números', price: 'R$ 9.009,00' },
      ],
      prizeRules: 'Ganha prêmio quem acertar 2, 3, 4 ou 5 números.',
      mainPrizeAcertos: 5,
      desc: 'O jogador escolhe de 5 a 15 números entre 1 e 80. Os sorteios acontecem de segunda a sábado. É uma das loterias mais tradicionais do país.',
      prob: '1 em 24.040.016 (5 números com 5 apostas)',
      color: 'bg-blue-600'
    },
    mega: {
      name: 'Mega-Sena',
      minNumbers: 6,
      maxNumbers: 20,
      range: '1 a 60',
      costs: [
        { qty: '6 números', price: 'R$ 6,00' },
        { qty: '7 números', price: 'R$ 42,00' },
        { qty: '8 números', price: 'R$ 168,00' },
        { qty: '9 números', price: 'R$ 504,00' },
        { qty: '10 números', price: 'R$ 1.260,00' },
        { qty: '11 números', price: 'R$ 2.772,00' },
        { qty: '12 números', price: 'R$ 5.544,00' },
        { qty: '13 números', price: 'R$ 10.296,00' },
        { qty: '14 números', price: 'R$ 18.018,00' },
        { qty: '15 números', price: 'R$ 30.030,00' },
        { qty: '16 números', price: 'R$ 48.048,00' },
        { qty: '17 números', price: 'R$ 74.256,00' },
        { qty: '18 números', price: 'R$ 111.384,00' },
        { qty: '19 números', price: 'R$ 162.792,00' },
        { qty: '20 números', price: 'R$ 232.560,00' },
      ],
      prizeRules: 'Ganha prêmio quem acertar 4, 5 ou 6 números.',
      mainPrizeAcertos: 6,
      desc: 'O jogador escolhe de 6 a 20 números entre 1 e 60. Os sorteios acontecem às quartas e sábados. É a modalidade que tradicionalmente paga os maiores prêmios.',
      prob: '1 em 50.063.860 (6 números)',
      probabilities: [
        { qty: '6', prob: '50.063.860' },
        { qty: '7', prob: '7.151.980' },
        { qty: '8', prob: '1.787.995' },
        { qty: '9', prob: '595.998' },
        { qty: '10', prob: '238.399' },
        { qty: '11', prob: '108.363' },
        { qty: '12', prob: '54.182' },
        { qty: '13', prob: '29.175' },
        { qty: '14', prob: '16.671' },
        { qty: '15', prob: '10.003' },
        { qty: '16', prob: '6.252' },
        { qty: '17', prob: '4.045' },
        { qty: '18', prob: '2.697' },
        { qty: '19', prob: '1.845' },
        { qty: '20', prob: '1.292' },
      ],
      color: 'bg-emerald-500'
    },
    dupla: {
      name: 'Dupla Sena',
      minNumbers: 6,
      maxNumbers: 15,
      range: '1 a 50',
      costs: [
        { qty: '6 números', price: 'R$ 3,00', bets: '1 aposta' },
        { qty: '7 números', price: 'R$ 21,00', bets: '7 apostas' },
        { qty: '8 números', price: 'R$ 84,00', bets: '28 apostas' },
        { qty: '9 números', price: 'R$ 252,00', bets: '84 apostas' },
        { qty: '10 números', price: 'R$ 630,00', bets: '210 apostas' },
        { qty: '11 números', price: 'R$ 1.386,00', bets: '462 apostas' },
        { qty: '12 números', price: 'R$ 2.772,00', bets: '924 apostas' },
        { qty: '13 números', price: 'R$ 5.148,00', bets: '1.716 apostas' },
        { qty: '14 números', price: 'R$ 9.009,00', bets: '3.003 apostas' },
        { qty: '15 números', price: 'R$ 15.015,00', bets: '5.005 apostas' },
      ],
      prizeRules: 'São realizados dois sorteios por concurso. Ganha prêmio quem acertar 3, 4, 5 ou 6 números em qualquer um dos dois sorteios.',
      mainPrizeAcertos: 6,
      desc: 'O jogador escolhe de 6 a 15 números entre 1 e 50. Cada concurso possui dois sorteios distintos, aumentando as oportunidades de premiação. É uma modalidade estratégica para quem busca duas chances em um único concurso.',
      prob: '1 em 15.890.700 (6 números)',
      color: 'bg-rose-600'
    }
  };

  const active = games[activeGame as keyof typeof games];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Informações dos Jogos</h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(games).map(([id, game]) => (
          <button
            key={id}
            onClick={() => setActiveGame(id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeGame === id 
                ? `${game.color} text-white shadow-lg` 
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            {game.name}
          </button>
        ))}
      </div>

      <motion.div 
        key={activeGame}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card border-2 border-zinc-100 dark:border-zinc-800"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-inner ${active.color}`}>
            <Trophy size={28} />
          </div>
          <div>
            <h3 className="text-3xl font-bold">{active.name}</h3>
            <p className="text-zinc-500 text-sm font-medium">Loterias Caixa</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">Descrição</h4>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
                {active.desc}
              </p>
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Mínimo de Números</h5>
                <p className="text-xl font-bold">{active.minNumbers}</p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Máximo de Números</h5>
                <p className="text-xl font-bold">{active.maxNumbers}</p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Intervalo</h5>
                <p className="text-xl font-bold">{active.range}</p>
              </div>
            </div>

            <section>
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">Regras de Premiação</h4>
              <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <p className="text-zinc-700 dark:text-zinc-300 font-medium mb-4">{active.prizeRules}</p>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <Check size={16} className="text-emerald-500" />
                  <span>Acertos para prêmio principal: <strong>{active.mainPrizeAcertos}</strong></span>
                </div>
              </div>
            </section>

            <section>
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">Probabilidade</h4>
              <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{active.prob}</p>
                <p className="text-sm text-zinc-500 mt-1">Chances de ganhar o prêmio principal com a aposta mínima.</p>
              </div>
            </section>

            {'probabilities' in active && (
              <section>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">Probabilidades por Números Jogados</h4>
                <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-zinc-100 dark:bg-zinc-800/50 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                        <th className="px-4 py-3">Números Jogados</th>
                        <th className="px-4 py-3 text-right">Probabilidade (1 em)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {(active as any).probabilities.map((p: any, i: number) => (
                        <tr key={i} className="hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30 transition-colors">
                          <td className="px-4 py-3 font-medium">{p.qty}</td>
                          <td className="px-4 py-3 font-bold text-right text-zinc-900 dark:text-zinc-50">{p.prob}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">Tabela de Preços</h4>
            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-zinc-100 dark:bg-zinc-800/50 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    <th className="px-4 py-3">Números</th>
                    {'bets' in active.costs[0] && <th className="px-4 py-3">Apostas</th>}
                    <th className="px-4 py-3 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {active.costs.map((c: any, i) => (
                    <tr key={i} className="hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{c.qty}</td>
                      {'bets' in c && <td className="px-4 py-3 text-zinc-500">{c.bets}</td>}
                      <td className="px-4 py-3 font-bold text-right text-zinc-900 dark:text-zinc-50">{c.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'dashboard' | 'participants' | 'contributions' | 'draws' | 'reports' | 'games'>('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [draws, setDraws] = useState<Draw[]>([]);

  const fetchData = async () => {
    try {
      // 1. Fetch Participants
      const { data: pData, error: pError } = await supabase
        .from('participants')
        .select('*')
        .order('name', { ascending: true });
      if (pError) throw pError;
      setParticipants(pData || []);

      // 2. Fetch Contributions with Participant names
      const { data: cData, error: cError } = await supabase
        .from('contributions')
        .select('*, participants(name)')
        .order('month', { ascending: false })
        .order('paid_at', { ascending: false });
      if (cError) throw cError;
      setContributions(cData?.map((c: any) => ({
        ...c,
        participant_name: c.participants?.name
      })) || []);

      // 3. Fetch Draws
      const { data: dData, error: dError } = await supabase
        .from('draws')
        .select('*')
        .order('date', { ascending: true });
      if (dError) throw dError;
      setDraws(dData || []);

      // 4. Fetch Bets for stats
      const { data: bData, error: bError } = await supabase
        .from('bets')
        .select('amount');
      if (bError) throw bError;

      // 5. Calculate Stats
      const totalCollected = cData?.reduce((acc: number, c: any) => acc + Number(c.amount), 0) || 0;
      const totalInvested = bData?.reduce((acc: number, b: any) => acc + Number(b.amount), 0) || 0;
      const activeParticipants = pData?.filter((p: any) => p.active).length || 0;
      const nextDraw = dData?.find((d: any) => !d.realized) || null;

      setStats({
        totalCollected,
        totalInvested,
        cashAvailable: totalCollected - totalInvested,
        activeParticipants,
        nextDraw
      });

    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
    });
    
    if (error) {
      alert(`Erro no login: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-zinc-50"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card w-full max-w-sm space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy size={32} />
            </div>
            <h1 className="text-2xl font-semibold">LotoGroup</h1>
            <p className="text-zinc-500">Gestão de Aportes Coletivos</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-500 mb-1">E-mail</label>
              <input 
                type="email" 
                className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-500 mb-1">Senha</label>
              <input 
                type="password" 
                className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="w-full btn-primary py-3">Entrar com Supabase</button>
          </form>
          <p className="text-xs text-center text-zinc-400">
            Crie seu usuário no painel do Supabase em Authentication &gt; Users.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex">
        
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-xl flex items-center justify-center">
              <Trophy size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">LotoGroup</span>
          </div>

          <nav className="flex-1 space-y-2">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
            <SidebarItem icon={Users} label="Participantes" active={view === 'participants'} onClick={() => setView('participants')} />
            <SidebarItem icon={CircleDollarSign} label="Contribuições" active={view === 'contributions'} onClick={() => setView('contributions')} />
            <SidebarItem icon={Trophy} label="Concursos" active={view === 'draws'} onClick={() => setView('draws')} />
            <SidebarItem icon={FileText} label="Relatórios" active={view === 'reports'} onClick={() => setView('reports')} />
            <SidebarItem icon={Gamepad2} label="Jogos" active={view === 'games'} onClick={() => setView('games')} />
          </nav>

          <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span className="font-medium">{darkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
            >
              <LogOut size={20} />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-12 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            
            {/* Mobile Header */}
            <header className="lg:hidden flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg flex items-center justify-center">
                  <Trophy size={16} />
                </div>
                <span className="text-lg font-bold">LotoGroup</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800"
              >
                <Menu size={20} />
              </button>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[60] lg:hidden">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  />
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    className="absolute inset-y-0 left-0 w-72 bg-white dark:bg-zinc-900 p-6 shadow-2xl"
                  >
                    <div className="flex justify-between items-center mb-12">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-xl flex items-center justify-center">
                          <Trophy size={20} />
                        </div>
                        <span className="text-xl font-bold tracking-tight">LotoGroup</span>
                      </div>
                      <button onClick={() => setIsMobileMenuOpen(false)}>
                        <X size={24} />
                      </button>
                    </div>

                    <nav className="space-y-2">
                      <SidebarItem icon={LayoutDashboard} label="Dashboard" active={view === 'dashboard'} onClick={() => { setView('dashboard'); setIsMobileMenuOpen(false); }} />
                      <SidebarItem icon={Users} label="Participantes" active={view === 'participants'} onClick={() => { setView('participants'); setIsMobileMenuOpen(false); }} />
                      <SidebarItem icon={CircleDollarSign} label="Contribuições" active={view === 'contributions'} onClick={() => { setView('contributions'); setIsMobileMenuOpen(false); }} />
                      <SidebarItem icon={Trophy} label="Concursos" active={view === 'draws'} onClick={() => { setView('draws'); setIsMobileMenuOpen(false); }} />
                      <SidebarItem icon={FileText} label="Relatórios" active={view === 'reports'} onClick={() => { setView('reports'); setIsMobileMenuOpen(false); }} />
                      <SidebarItem icon={Gamepad2} label="Jogos" active={view === 'games'} onClick={() => { setView('games'); setIsMobileMenuOpen(false); }} />
                    </nav>

                    <div className="absolute bottom-6 left-6 right-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                      <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                      >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        <span className="font-medium">{darkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
                      >
                        <LogOut size={20} />
                        <span className="font-medium">Sair</span>
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Page Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {view === 'dashboard' && <Dashboard stats={stats} draws={draws} />}
                {view === 'participants' && <ParticipantsList participants={participants} contributions={contributions} onUpdate={fetchData} />}
                {view === 'contributions' && <ContributionsList participants={participants} contributions={contributions} onUpdate={fetchData} />}
                {view === 'draws' && <DrawsList draws={draws} stats={stats} onUpdate={fetchData} />}
                {view === 'reports' && <ReportsList stats={stats} draws={draws} contributions={contributions} />}
                {view === 'games' && <GamesList />}
              </motion.div>
            </AnimatePresence>

          </div>
        </main>
      </div>
    </div>
  );
}
