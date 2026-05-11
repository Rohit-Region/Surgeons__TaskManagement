import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import UserManagementPanel from '../components/admin/UserManagementPanel';
import CreateUserForm from '../components/admin/CreateUserForm';
import TaskManagementPanel from '../components/admin/TaskManagementPanel';
import CreateTaskForm from '../components/admin/CreateTaskForm';
import Spinner from '../components/Spinner';
import { listUsers } from '../api/usersApi';
import { listTasks } from '../api/tasksApi';
import { useAuth } from '../context/AuthContext';

function StatCard({ label, value, gradient, icon, sub }) {
  return (
    <div style={{ ...sc.card, background: gradient }}>
      <div style={sc.inner}>
        <div>
          <p style={sc.label}>{label}</p>
          <p style={sc.value}>{value}</p>
          {sub && <p style={sc.sub}>{sub}</p>}
        </div>
        <div style={sc.iconBox}>{icon}</div>
      </div>
      <div style={sc.shine} />
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers]           = useState([]);
  const [tasks, setTasks]           = useState([]);
  const [loadingUsers, setLU]       = useState(true);
  const [loadingTasks, setLT]       = useState(true);

  const fetchUsers = useCallback(async () => {
    setLU(true);
    try { setUsers(await listUsers()); } catch {}
    finally { setLU(false); }
  }, []);

  const fetchTasks = useCallback(async () => {
    setLT(true);
    try { setTasks(await listTasks(user?.userId, user?.role || 'admin')); } catch {}
    finally { setLT(false); }
  }, [user]);

  useEffect(() => { fetchUsers(); fetchTasks(); }, [fetchUsers, fetchTasks]);

  const pending    = tasks.filter(t => t.status === 'Pending').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const completed  = tasks.filter(t => t.status === 'Completed').length;
  const assigned   = tasks.filter(t => t.assignee).length;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <AdminLayout>
      {/* Hero header */}
      <div style={s.hero}>
        <div style={s.heroContent}>
          <div style={s.heroLeft}>
            <div style={s.greetingBadge}>
              <span>👋</span> {greeting}
            </div>
            <h1 style={s.heroTitle}>
              Welcome back, <span style={s.heroName}>{user?.username || 'Admin'}</span>
            </h1>
            <p style={s.heroSub}>
              Here's what's happening with your team today.
            </p>
          </div>
          <div style={s.heroRight}>
            <div style={s.heroStat}>
              <span style={s.heroStatNum}>{tasks.length}</span>
              <span style={s.heroStatLabel}>Total Tasks</span>
            </div>
            <div style={s.heroStatDivider} />
            <div style={s.heroStat}>
              <span style={s.heroStatNum}>{users.length}</span>
              <span style={s.heroStatLabel}>Team Members</span>
            </div>
          </div>
        </div>
        <div style={s.heroBg1} />
        <div style={s.heroBg2} />
      </div>

      {/* Stat cards */}
      <div style={s.statsGrid}>
        <StatCard
          label="Pending"
          value={pending}
          gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/></svg>}
          sub="Awaiting action"
        />
        <StatCard
          label="In Progress"
          value={inProgress}
          gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          sub="Being worked on"
        />
        <StatCard
          label="Completed"
          value={completed}
          gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/><polyline points="22 4 12 14.01 9 11.01" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          sub="Successfully done"
        />
        <StatCard
          label="Assigned"
          value={assigned}
          gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/></svg>}
          sub="Tasks with owners"
        />
      </div>

      {/* Two-column layout */}
      <div style={s.grid}>
        {/* Left: Users */}
        <div style={s.col}>
          <div style={s.sectionHeader}>
            <div style={s.sectionIcon('linear-gradient(135deg,#667eea,#764ba2)')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="9" cy="7" r="4" stroke="#fff" strokeWidth="2"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h2 style={s.sectionTitle}>Team Members</h2>
              <p style={s.sectionSub}>{users.length} member{users.length !== 1 ? 's' : ''} registered</p>
            </div>
          </div>
          <CreateUserForm onUserCreated={fetchUsers} />
          {loadingUsers
            ? <div style={s.loadBox}><Spinner size="md" color="#6366F1" /></div>
            : <UserManagementPanel users={users} onUserDeleted={fetchUsers} />}
        </div>

        {/* Right: Tasks */}
        <div style={s.col}>
          <div style={s.sectionHeader}>
            <div style={s.sectionIcon('linear-gradient(135deg,#f093fb,#f5576c)')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 11l3 3L22 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h2 style={s.sectionTitle}>Task Board</h2>
              <p style={s.sectionSub}>{tasks.length} task{tasks.length !== 1 ? 's' : ''} total</p>
            </div>
          </div>
          <CreateTaskForm onTaskCreated={fetchTasks} />
          {loadingTasks
            ? <div style={s.loadBox}><Spinner size="md" color="#6366F1" /></div>
            : <TaskManagementPanel tasks={tasks} users={users} onTasksChanged={fetchTasks} />}
        </div>
      </div>

      <style>{`
        @keyframes blobMove {
          0%,100% { transform: scale(1) translate(0,0); }
          50%      { transform: scale(1.15) translate(15px,-15px); }
        }
      `}</style>
    </AdminLayout>
  );
}

/* Stat card styles */
const sc = {
  card: {
    borderRadius: 20, padding: '24px',
    position: 'relative', overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    animation: 'scaleIn 0.4s cubic-bezier(0.4,0,0.2,1) both',
  },
  inner: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 },
  label: { fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 },
  value: { fontSize: '2.5rem', fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: '-0.03em' },
  sub:   { fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  iconBox: { background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 10, backdropFilter: 'blur(4px)' },
  shine: {
    position: 'absolute', top: -40, right: -40,
    width: 120, height: 120,
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '50%',
  },
};

const s = {
  hero: {
    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4c1d95 100%)',
    borderRadius: 24, padding: '36px 40px',
    marginBottom: 28, position: 'relative', overflow: 'hidden',
    boxShadow: '0 12px 40px rgba(49,46,129,0.4)',
    animation: 'fadeInUp 0.5s cubic-bezier(0.4,0,0.2,1) both',
  },
  heroContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1, flexWrap: 'wrap', gap: 20 },
  heroLeft: {},
  greetingBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 999, padding: '4px 12px',
    fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
  },
  heroTitle: { fontSize: '1.8rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 },
  heroName: { background: 'linear-gradient(135deg,#a5b4fc,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  heroSub: { fontSize: '0.95rem', color: 'rgba(255,255,255,0.65)' },
  heroRight: { display: 'flex', alignItems: 'center', gap: 24, background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: '16px 24px', border: '1px solid rgba(255,255,255,0.12)' },
  heroStat: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  heroStatNum: { fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1 },
  heroStatLabel: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 },
  heroStatDivider: { width: 1, height: 40, background: 'rgba(255,255,255,0.15)' },
  heroBg1: { position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'rgba(139,92,246,0.3)', borderRadius: '50%', animation: 'blobMove 8s ease-in-out infinite' },
  heroBg2: { position: 'absolute', bottom: -40, left: '30%', width: 150, height: 150, background: 'rgba(99,102,241,0.2)', borderRadius: '50%', animation: 'blobMove 10s ease-in-out infinite reverse' },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 20, marginBottom: 32,
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
    gap: 28, alignItems: 'start',
  },
  col: { display: 'flex', flexDirection: 'column', gap: 20 },

  sectionHeader: {
    display: 'flex', alignItems: 'center', gap: 14,
    marginBottom: 4,
  },
  sectionIcon: (bg) => ({
    width: 40, height: 40,
    background: bg, borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)', flexShrink: 0,
  }),
  sectionTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' },
  sectionSub: { fontSize: '0.8rem', color: '#64748B', marginTop: 2 },

  loadBox: { display: 'flex', justifyContent: 'center', padding: 40 },
};
