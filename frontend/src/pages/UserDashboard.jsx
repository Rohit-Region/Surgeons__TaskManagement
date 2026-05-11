import React, { useState, useEffect, useCallback } from 'react';
import UserLayout from '../layouts/UserLayout';
import TaskCard from '../components/user/TaskCard';
import { listTasks } from '../api/tasksApi';
import { useAuth } from '../context/AuthContext';

function SkeletonCard() {
  return (
    <div style={sk.card}>
      <div style={sk.line('60%', 20)} />
      <div style={sk.line('100%', 14)} />
      <div style={sk.line('80%', 14)} />
      <div style={sk.line('40%', 32)} />
    </div>
  );
}
const sk = {
  card: {
    background: '#fff', borderRadius: 20, padding: 24,
    display: 'flex', flexDirection: 'column', gap: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  line: (w, h) => ({
    width: w, height: h,
    background: 'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: 8,
  }),
};

function ProgressBar({ pending, inProgress, completed, total }) {
  if (total === 0) return null;
  const pPct = (pending / total) * 100;
  const iPct = (inProgress / total) * 100;
  const cPct = (completed / total) * 100;
  return (
    <div style={pb.wrap}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={pb.label}>Overall Progress</span>
        <span style={pb.pct}>{Math.round((completed / total) * 100)}% complete</span>
      </div>
      <div style={pb.track}>
        <div style={{ ...pb.seg, width: `${cPct}%`, background: 'linear-gradient(90deg,#10B981,#34D399)' }} />
        <div style={{ ...pb.seg, width: `${iPct}%`, background: 'linear-gradient(90deg,#F59E0B,#FBBF24)' }} />
        <div style={{ ...pb.seg, width: `${pPct}%`, background: 'linear-gradient(90deg,#94A3B8,#CBD5E1)' }} />
      </div>
      <div style={pb.legend}>
        <span style={pb.dot('#10B981')}>Completed ({completed})</span>
        <span style={pb.dot('#F59E0B')}>In Progress ({inProgress})</span>
        <span style={pb.dot('#94A3B8')}>Pending ({pending})</span>
      </div>
    </div>
  );
}
const pb = {
  wrap: {
    background: '#fff', borderRadius: 16, padding: '20px 24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #E2E8F0',
  },
  label: { fontSize: '0.85rem', fontWeight: 600, color: '#374151' },
  pct:   { fontSize: '0.85rem', fontWeight: 700, color: '#10B981' },
  track: {
    height: 10, borderRadius: 999,
    background: '#F1F5F9', overflow: 'hidden',
    display: 'flex',
  },
  seg: { height: '100%', transition: 'width 600ms ease' },
  dot: (color) => ({
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontSize: '0.75rem', color: '#64748B',
    '::before': { content: '""', width: 8, height: 8, borderRadius: '50%', background: color },
  }),
  legend: { display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' },
};

export default function UserDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks]   = useState([]);
  const [loading, setLoad]  = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchTasks = useCallback(async () => {
    setLoad(true);
    try { setTasks(await listTasks(user?.userId, user?.role)); } catch {}
    finally { setLoad(false); }
  }, [user]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  function handleStatusUpdated(taskId, newStatus) {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  }

  const pending    = tasks.filter(t => t.status === 'Pending').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const completed  = tasks.filter(t => t.status === 'Completed').length;

  const filtered = filter === 'All' ? tasks : tasks.filter(t => t.status === filter);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? '🌅 Good morning' : hour < 17 ? '☀️ Good afternoon' : '🌙 Good evening';

  return (
    <UserLayout>
      {/* Hero */}
      <div style={s.hero}>
        <div style={s.heroContent}>
          <div>
            <p style={s.greet}>{greeting}</p>
            <h1 style={s.heroTitle}>
              {user?.username || 'there'}<span style={s.wave}>!</span>
            </h1>
            <p style={s.heroSub}>You have <strong style={{ color: '#34D399' }}>{tasks.length} task{tasks.length !== 1 ? 's' : ''}</strong> assigned to you.</p>
          </div>
          <div style={s.heroStats}>
            {[
              { n: pending,    l: 'Pending',     c: '#94A3B8' },
              { n: inProgress, l: 'In Progress',  c: '#FBBF24' },
              { n: completed,  l: 'Completed',    c: '#34D399' },
            ].map(({ n, l, c }) => (
              <div key={l} style={s.heroStat}>
                <span style={{ ...s.heroNum, color: c }}>{n}</span>
                <span style={s.heroLabel}>{l}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={s.heroBg1} />
        <div style={s.heroBg2} />
      </div>

      {/* Progress bar */}
      {!loading && tasks.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <ProgressBar pending={pending} inProgress={inProgress} completed={completed} total={tasks.length} />
        </div>
      )}

      {/* Filter tabs */}
      {!loading && tasks.length > 0 && (
        <div style={s.tabs}>
          {['All', 'Pending', 'In Progress', 'Completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...s.tab,
                ...(filter === f ? s.tabActive : {}),
              }}
            >
              {f === 'All' && '📋 '}
              {f === 'Pending' && '⏳ '}
              {f === 'In Progress' && '⚡ '}
              {f === 'Completed' && '✅ '}
              {f}
              <span style={{
                ...s.tabCount,
                background: filter === f ? 'rgba(255,255,255,0.25)' : '#F1F5F9',
                color: filter === f ? '#fff' : '#64748B',
              }}>
                {f === 'All' ? tasks.length
                  : f === 'Pending' ? pending
                  : f === 'In Progress' ? inProgress
                  : completed}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Task grid */}
      {loading ? (
        <div style={s.grid}>
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>
            {filter === 'Completed' ? '🎉' : filter === 'In Progress' ? '⚡' : '📭'}
          </div>
          <h2 style={s.emptyTitle}>
            {filter === 'All' ? 'No tasks yet' : `No ${filter} tasks`}
          </h2>
          <p style={s.emptySub}>
            {filter === 'All'
              ? 'Your admin will assign tasks to you soon!'
              : `You have no tasks with "${filter}" status.`}
          </p>
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.map((task, i) => (
            <div key={task.id} style={{ animation: `fadeInUp 0.4s cubic-bezier(0.4,0,0.2,1) ${i * 0.06}s both` }}>
              <TaskCard task={task} onStatusUpdated={handleStatusUpdated} />
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes blobMove {
          0%,100% { transform: scale(1) translate(0,0); }
          50%      { transform: scale(1.15) translate(15px,-15px); }
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </UserLayout>
  );
}

const s = {
  hero: {
    background: 'linear-gradient(135deg, #064e3b 0%, #065f46 60%, #047857 100%)',
    borderRadius: 24, padding: '36px 40px',
    marginBottom: 24, position: 'relative', overflow: 'hidden',
    boxShadow: '0 12px 40px rgba(6,78,59,0.35)',
    animation: 'fadeInUp 0.5s cubic-bezier(0.4,0,0.2,1) both',
  },
  heroContent: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', position: 'relative', zIndex: 1,
    flexWrap: 'wrap', gap: 20,
  },
  greet: { fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500, marginBottom: 6 },
  heroTitle: { fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 },
  wave: { color: '#34D399' },
  heroSub: { fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)' },
  heroStats: {
    display: 'flex', gap: 8,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 16, padding: '16px 20px',
  },
  heroStat: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 4, padding: '0 16px',
    borderRight: '1px solid rgba(255,255,255,0.12)',
  },
  heroNum: { fontSize: '1.8rem', fontWeight: 800, lineHeight: 1 },
  heroLabel: { fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500, whiteSpace: 'nowrap' },
  heroBg1: { position: 'absolute', top: -50, right: -50, width: 180, height: 180, background: 'rgba(52,211,153,0.2)', borderRadius: '50%', animation: 'blobMove 8s ease-in-out infinite' },
  heroBg2: { position: 'absolute', bottom: -30, left: '40%', width: 120, height: 120, background: 'rgba(16,185,129,0.15)', borderRadius: '50%', animation: 'blobMove 10s ease-in-out infinite reverse' },

  tabs: {
    display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap',
  },
  tab: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '9px 16px', borderRadius: 12,
    fontSize: '0.875rem', fontWeight: 600,
    background: '#fff', color: '#475569',
    border: '1.5px solid #E2E8F0',
    cursor: 'pointer', transition: 'all 200ms ease',
  },
  tabActive: {
    background: 'linear-gradient(135deg,#065f46,#047857)',
    color: '#fff', border: '1.5px solid transparent',
    boxShadow: '0 4px 12px rgba(6,95,70,0.3)',
  },
  tabCount: {
    fontSize: '0.7rem', fontWeight: 700,
    padding: '2px 7px', borderRadius: 999,
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 20,
  },

  empty: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '80px 24px',
    background: '#fff', borderRadius: 24,
    border: '2px dashed #E2E8F0',
    textAlign: 'center',
  },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: 8 },
  emptySub: { fontSize: '0.95rem', color: '#64748B', maxWidth: 320 },
};
