import React, { useState, useEffect } from 'react';
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
  History
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

const ParticipantsList = ({ participants, onUpdate }: { participants: Participant[], onUpdate: () => void }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const handleAdd = async () => {
    if (!newName) return;
    await fetch('/api/participants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, active: true })
    });
    setNewName('');
    setIsAdding(false);
    onUpdate();
  };

  const toggleStatus = async (p: Participant) => {
    await fetch(`/api/participants/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: p.name, active: !p.active })
    });
    onUpdate();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Participantes</h2>
        <button onClick={() => setIsAdding(true)} className="btn-primary flex items-center gap-2">
          <Users size={18} />
          Novo Participante
        </button>
      </div>

      {isAdding && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card flex gap-4">
          <input 
            type="text" 
            placeholder="Nome completo" 
            className="flex-1 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 focus:ring-2 ring-zinc-200"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button onClick={handleAdd} className="btn-primary">Salvar</button>
          <button onClick={() => setIsAdding(false)} className="btn-secondary">Cancelar</button>
        </motion.div>
      )}

      <div className="card overflow-hidden p-0">
        <table className="w-full text-left">
          <thead>
            <tr className="border-bottom border-zinc-100 dark:border-zinc-800">
              <th className="px-6 py-4 text-sm font-bold text-zinc-500">Nome</th>
              <th className="px-6 py-4 text-sm font-bold text-zinc-500">Status</th>
              <th className="px-6 py-4 text-sm font-bold text-zinc-500">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {participants.map(p => (
              <tr key={p.id}>
                <td className="px-6 py-4 font-medium">{p.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    p.active ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20'
                  }`}>
                    {p.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => toggleStatus(p)} className="text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
                    {p.active ? 'Desativar' : 'Ativar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ContributionsList = ({ participants, contributions, onUpdate }: { participants: Participant[], contributions: Contribution[], onUpdate: () => void }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ participant_id: '', amount: 50, month: new Date().toISOString().slice(0, 7) });

  const handleAdd = async () => {
    if (!form.participant_id) return;
    await fetch('/api/contributions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setIsAdding(false);
    onUpdate();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contribuições</h2>
        <button onClick={() => setIsAdding(true)} className="btn-primary flex items-center gap-2">
          <CircleDollarSign size={18} />
          Registrar Pagamento
        </button>
      </div>

      {isAdding && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card grid grid-cols-1 md:grid-cols-4 gap-4">
          <select 
            className="bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-2"
            value={form.participant_id}
            onChange={(e) => setForm({...form, participant_id: e.target.value})}
          >
            <option value="">Selecionar Participante</option>
            {participants.filter(p => p.active).map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input 
            type="number" 
            className="bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-2"
            value={form.amount}
            onChange={(e) => setForm({...form, amount: Number(e.target.value)})}
          />
          <input 
            type="month" 
            className="bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-2"
            value={form.month}
            onChange={(e) => setForm({...form, month: e.target.value})}
          />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="btn-primary flex-1">Salvar</button>
            <button onClick={() => setIsAdding(false)} className="btn-secondary">X</button>
          </div>
        </motion.div>
      )}

      <div className="card overflow-hidden p-0">
        <table className="w-full text-left">
          <thead>
            <tr className="border-bottom border-zinc-100 dark:border-zinc-800">
              <th className="px-6 py-4 text-sm font-bold text-zinc-500">Participante</th>
              <th className="px-6 py-4 text-sm font-bold text-zinc-500">Mês</th>
              <th className="px-6 py-4 text-sm font-bold text-zinc-500">Valor</th>
              <th className="px-6 py-4 text-sm font-bold text-zinc-500">Data Pagto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {contributions.map(c => (
              <tr key={c.id}>
                <td className="px-6 py-4 font-medium">{c.participant_name}</td>
                <td className="px-6 py-4 text-zinc-500">{c.month}</td>
                <td className="px-6 py-4 font-bold">R$ {c.amount.toLocaleString('pt-BR')}</td>
                <td className="px-6 py-4 text-zinc-500">{new Date(c.paid_at).toLocaleDateString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
    await fetch(`/api/draws/${editing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing)
    });
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
  const [user, setUser] = useState<User | null>(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [draws, setDraws] = useState<Draw[]>([]);

  const fetchData = async () => {
    const [sRes, pRes, cRes, dRes] = await Promise.all([
      fetch('/api/stats'),
      fetch('/api/participants'),
      fetch('/api/contributions'),
      fetch('/api/draws')
    ]);
    setStats(await sRes.json());
    setParticipants(await pRes.json());
    setContributions(await cRes.json());
    setDraws(await dRes.json());
  };

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
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm)
    });
    if (res.ok) {
      setUser(await res.json());
    } else {
      alert('Login inválido');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card w-full max-w-sm space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-zinc-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy size={32} />
            </div>
            <h1 className="text-2xl font-bold">LotoGroup</h1>
            <p className="text-zinc-500">Gestão de Aportes Coletivos</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-zinc-500 mb-1">Usuário</label>
              <input 
                type="text" 
                className="w-full bg-zinc-50 border-none rounded-xl px-4 py-3"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-500 mb-1">Senha</label>
              <input 
                type="password" 
                className="w-full bg-zinc-50 border-none rounded-xl px-4 py-3"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              />
            </div>
            <button type="submit" className="w-full btn-primary py-3">Entrar</button>
          </form>
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
              onClick={() => setUser(null)}
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
                {view === 'participants' && <ParticipantsList participants={participants} onUpdate={fetchData} />}
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
