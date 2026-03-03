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
  Check
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
  <div className={`card flex flex-col gap-2 border-t-4 ${colorClass || 'border-zinc-900 dark:border-zinc-50'}`}>
    <div className="flex justify-between items-start">
      <div className={`p-2 rounded-lg ${colorClass ? colorClass.replace('border-', 'bg-').replace('900', '100').replace('50', '800') : 'bg-zinc-100 dark:bg-zinc-800'}`}>
        <Icon size={20} className={colorClass ? colorClass.replace('border-', 'text-').replace('50', '400') : 'text-zinc-600 dark:text-zinc-400'} />
      </div>
      {trend && (
        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <span className="text-sm text-zinc-500 font-medium">{label}</span>
    <span className="text-2xl font-bold tracking-tight">{value}</span>
  </div>
);

// --- Pages ---

const Dashboard = ({ stats, draws }: { stats: DashboardStats | null, draws: Draw[] }) => {
  if (!stats) return null;

  const pieData = draws.map(d => ({
    name: d.name,
    value: d.allocation_percentage
  })).filter(d => d.value > 0);

  const COLORS = ['#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444'];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Arrecadado" value={`R$ ${stats.totalCollected.toLocaleString('pt-BR')}`} icon={CircleDollarSign} colorClass="border-amber-500" />
        <StatCard label="Total Investido" value={`R$ ${stats.totalInvested.toLocaleString('pt-BR')}`} icon={TrendingUp} colorClass="border-emerald-500" />
        <StatCard label="Saldo em Caixa" value={`R$ ${stats.cashAvailable.toLocaleString('pt-BR')}`} icon={CircleDollarSign} colorClass="border-blue-500" />
        <StatCard label="Participantes Ativos" value={stats.activeParticipants.toString()} icon={Users} colorClass="border-violet-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-lg font-bold mb-6">Distribuição por Sorteio</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-zinc-500">{d.name}</span>
                </div>
                <span className="font-bold">{d.value.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold mb-6">Próximo Concurso</h3>
          {stats.nextDraw ? (
            <div className="space-y-6">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Sorteio</span>
                <h4 className="text-xl font-bold">{stats.nextDraw.name}</h4>
                <p className="text-zinc-500 mt-1">Data: {new Date(stats.nextDraw.date).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 rounded-xl">
                  <span className="text-xs opacity-70 uppercase font-bold">Aporte Estimado</span>
                  <p className="text-2xl font-bold">R$ {(stats.cashAvailable * (stats.nextDraw.allocation_percentage / 100)).toLocaleString('pt-BR')}</p>
                </div>
                <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                  <span className="text-xs text-zinc-500 uppercase font-bold">Percentual Atual</span>
                  <p className="text-2xl font-bold">{stats.nextDraw.allocation_percentage.toFixed(1)}%</p>
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
    
    if (hasPaidCurrent) return { label: 'Pago YTD', color: 'bg-emerald-500', sub: 'Ativo' };
    
    const monthName = new Date().toLocaleString('pt-BR', { month: 'short' });
    return { label: `Pendente ${monthName}`, color: 'bg-amber-500', sub: 'Ativo' };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Participantes</h2>
        <button onClick={() => { setIsAdding(true); setEditing(null); setForm({ name: '', active: true, avatar_url: '' }); }} className="btn-primary flex items-center gap-2">
          <Users size={18} />
          Novo Participante
        </button>
      </div>

      {(isAdding || editing) && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card space-y-4">
          <h3 className="font-bold">{editing ? 'Editar Participante' : 'Novo Participante'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Nome completo" 
              className="bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-2"
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="URL da Foto de Perfil" 
              className="bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-2"
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
          <div className="flex gap-2">
            <button onClick={editing ? handleUpdate : handleAdd} className="btn-primary flex-1">
              {editing ? 'Salvar Alterações' : 'Adicionar'}
            </button>
            <button onClick={() => { setIsAdding(false); setEditing(null); }} className="btn-secondary">Cancelar</button>
          </div>
        </motion.div>
      )}

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
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-50 leading-tight">{p.name}</h4>
                  <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider">
                    <span className={status.color.replace('bg-', 'text-')}>{status.label}</span>
                    <span className="text-zinc-300 dark:text-zinc-700">•</span>
                    <span className="text-zinc-400">{status.sub}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-lg font-bold">R$ {totalPaid.toLocaleString('pt-BR')}</span>
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
        <h2 className="text-3xl font-black tracking-tight mb-1">Controle de Aportes</h2>
        <p className="text-zinc-500 font-medium">Clique no ícone para alternar o status de pagamento (R$ 50,00/mês)</p>
      </div>

      <div className="card p-0 overflow-hidden border-zinc-200 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 border-r border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 sticky left-0 z-10">
                  Participante
                </th>
                {months.map(m => (
                  <th key={m.id} className="px-2 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">
                    {m.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {participants.filter(p => p.active).map(p => (
                <tr key={p.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-zinc-900 dark:text-zinc-100 border-r border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky left-0 z-10">
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
                            <span className="font-black opacity-30">—</span>
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
                <td className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100 border-r border-zinc-100 dark:border-zinc-800 sticky left-0 z-10 bg-zinc-50 dark:bg-zinc-900">
                  Arrecadação
                </td>
                {months.map(m => {
                  const total = getMonthTotal(m.id);
                  return (
                    <td key={m.id} className="px-2 py-6 text-center font-black text-sm">
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
    'text-amber-500',
    'text-emerald-500',
    'text-blue-500',
    'text-violet-500'
  ];

  const handleSave = async () => {
    if (!editing) return;
    
    const { error: updateError } = await supabase
      .from('draws')
      .update({
        realized: editing.realized === 1,
        result: editing.result,
        prize: editing.prize,
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
      <h2 className="text-2xl font-bold">Concursos Especiais</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {draws.map((d, i) => {
          const totalPotentialYearly = (stats?.activeParticipants || 0) * 50 * 12;
          const drawGoal = totalPotentialYearly * (d.allocation_percentage / 100);
          const drawCollected = (stats?.totalCollected || 0) * (d.allocation_percentage / 100);
          const progress = drawGoal > 0 ? (drawCollected / drawGoal) * 100 : 0;
          const colorClass = DRAW_COLORS[i % DRAW_COLORS.length];

          return (
            <div key={d.id} className="card relative overflow-hidden group">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{d.name}</h3>
                  <p className="text-sm text-zinc-400 font-medium">
                    {new Date(d.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  d.realized 
                    ? 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800' 
                    : 'bg-cyan-50 text-cyan-500 dark:bg-cyan-900/20'
                }`}>
                  {d.realized ? 'REALIZADO' : 'ABERTO'}
                </span>
              </div>

              <div className="flex items-center gap-6 mb-8">
                <CircularProgress percentage={progress} colorClass={colorClass} />
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Prêmio Estimado</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold">R$</span>
                    <span className="text-3xl font-black tracking-tight">
                      {d.prize >= 1000000 
                        ? `${(d.prize / 1000000).toFixed(0)}M` 
                        : d.prize.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-sm text-zinc-500 font-medium">Meta de Arrecadação</span>
                  <div className="text-right">
                    <span className="text-sm font-bold">R$ {Math.round(drawCollected).toLocaleString('pt-BR')}</span>
                    <span className="text-sm text-zinc-400 font-medium"> / R$ {Math.round(drawGoal).toLocaleString('pt-BR')}</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    className={`h-full rounded-full ${colorClass.replace('text-', 'bg-')}`}
                  />
                </div>
              </div>

              {d.result && (
                <div className="mt-6 p-3 bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 rounded-xl">
                  <span className="text-[10px] opacity-70 font-bold uppercase">Resultado</span>
                  <p className="text-lg font-mono font-bold">{d.result}</p>
                </div>
              )}

              <button 
                onClick={() => setEditing(d)}
                className="mt-6 w-full py-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors uppercase tracking-widest"
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
                  <label className="block text-sm font-bold text-zinc-500 mb-1">Resultado (Dezenas)</label>
                  <input 
                    type="text" 
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-2"
                    value={editing.result || ''}
                    onChange={(e) => setEditing({...editing, result: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-500 mb-1">Prêmio Recebido (R$)</label>
                  <input 
                    type="number" 
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-2"
                    value={editing.prize}
                    onChange={(e) => setEditing({...editing, prize: Number(e.target.value)})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-500 mb-1">Percentual de Alocação (%)</label>
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

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'dashboard' | 'participants' | 'contributions' | 'draws'>('dashboard');
  const [darkMode, setDarkMode] = useState(false);
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
            <h1 className="text-2xl font-bold">LotoGroup</h1>
            <p className="text-zinc-500">Gestão de Aportes Coletivos</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-zinc-500 mb-1">E-mail</label>
              <input 
                type="email" 
                className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-500 mb-1">Senha</label>
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
              <button className="p-2 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <Menu size={20} />
              </button>
            </header>

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
              </motion.div>
            </AnimatePresence>

          </div>
        </main>
      </div>
    </div>
  );
}
