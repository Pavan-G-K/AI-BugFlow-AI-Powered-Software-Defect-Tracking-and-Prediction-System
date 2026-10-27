import { useEffect, useMemo, useState } from 'react'
import { Activity, AlertTriangle, CheckCircle2, CircleDot, Bug, Plus, RefreshCw, Search, Sparkles, Trash2, X } from 'lucide-react'

const API = 'http://localhost:8080/api'
const emptyForm = { title: '', description: '', component: 'Frontend', environment: 'Development', severity: 'MEDIUM' }
const nice = s => (s || '').replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())

export default function App() {
  const [bugs, setBugs] = useState([])
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 })
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [prediction, setPrediction] = useState(null)
  const [predicting, setPredicting] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  async function load() {
    try {
      const [b, s] = await Promise.all([fetch(`${API}/bugs`), fetch(`${API}/dashboard`)])
      if (!b.ok || !s.ok) throw new Error('Backend returned an error')
      setBugs(await b.json()); setStats(await s.json()); setError('')
    } catch { setError('Cannot connect to backend. Start the Spring Boot service on port 8080.'); }
  }
  useEffect(() => { load() }, [])
  const visible = useMemo(() => bugs.filter(b => (filter === 'ALL' || b.status === filter) &&
    `${b.title} ${b.description} ${b.component}`.toLowerCase().includes(search.toLowerCase())), [bugs, filter, search])

  function notify(message) { setToast(message); setTimeout(() => setToast(''), 2800) }
  function change(name, value) { setForm(old => ({ ...old, [name]: value })); setPrediction(null) }

  async function predict() {
    if (!form.title.trim() || !form.description.trim()) { setError('Enter a title and description before predicting severity.'); return }
    setPredicting(true); setError('')
    try {
      const res = await fetch(`${API}/predict`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(form) })
      if (!res.ok) throw new Error('Prediction request failed')
      const data = await res.json(); setPrediction(data); setForm(old => ({ ...old, severity: data.severity }))
    } catch { setError('Could not get a prediction. Check the Java backend.'); }
    finally { setPredicting(false) }
  }

  async function createBug(e) {
    e.preventDefault(); setBusy(true); setError('')
    try {
      const res = await fetch(`${API}/bugs`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(form) })
      if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(body.message || 'Could not save bug') }
      setForm(emptyForm); setPrediction(null); setShowForm(false); await load(); notify('Bug reported successfully')
    } catch (e) { setError(e.message || 'Could not save bug.'); }
    finally { setBusy(false) }
  }

  async function updateStatus(bug, status) {
    try {
      const res = await fetch(`${API}/bugs/${bug.id}/status`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({status}) })
      if (!res.ok) throw new Error()
      await load(); notify(`Bug #${bug.id} moved to ${nice(status)}`)
    } catch { setError('Could not update status. Check the backend.'); }
  }
  async function removeBug(bug) {
    if (!window.confirm(`Delete bug #${bug.id}: ${bug.title}?`)) return
    try { const res = await fetch(`${API}/bugs/${bug.id}`, {method:'DELETE'}); if (!res.ok) throw new Error(); await load(); notify('Bug deleted') }
    catch { setError('Could not delete bug.') }
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-icon"><Bug size={23}/></div><div><strong>BugFlow</strong><span>INTELLIGENCE SUITE</span></div></div>
      <div className="nav-label">WORKSPACE</div>
      <div className="nav-item active"><Activity size={18}/> Overview</div>
      <div className="nav-item"><CircleDot size={18}/> Issue tracker <span className="nav-count">{stats.total}</span></div>
      <div className="sidebar-bottom"><div className="ai-orb"><Sparkles size={18}/></div><strong>AI insights</strong><p>Predict defects earlier and focus on the issues that matter most.</p><span className="powered">POWERED BY ML</span></div>
    </aside>
    <main className="main">
      <header className="topbar"><div><div className="eyebrow">ENGINEERING / QUALITY</div><h1>Defect overview</h1><p className="subtitle">Track issues. Predict risk. Ship with confidence.</p></div><div className="top-actions"><span className="live-dot">● System workspace</span><button className="primary" onClick={() => {setShowForm(true);setError('')}}><Plus size={17}/> Report a bug</button></div></header>
      {error && <div className="error-banner"><AlertTriangle size={17}/>{error}<button onClick={() => setError('')}><X size={16}/></button></div>}
      <section className="stats-grid">
        <Stat icon={<Bug/>} label="Total defects" value={stats.total} hint="All reported issues" tone="blue"/>
        <Stat icon={<AlertTriangle/>} label="Open issues" value={stats.open} hint="Awaiting investigation" tone="orange"/>
        <Stat icon={<Activity/>} label="In progress" value={stats.inProgress} hint="Currently being fixed" tone="purple"/>
        <Stat icon={<CheckCircle2/>} label="Resolved" value={stats.resolved} hint="Successfully closed" tone="green"/>
      </section>
      <section className="panel">
        <div className="panel-head"><div><h2>Issue tracker</h2><p>Review reported defects and manage their lifecycle.</p></div><button className="icon-button" title="Refresh" onClick={load}><RefreshCw size={17}/></button></div>
        <div className="toolbar"><div className="search-box"><Search size={17}/><input placeholder="Search defects..." value={search} onChange={e=>setSearch(e.target.value)}/></div><div className="filters">{['ALL','OPEN','IN_PROGRESS','RESOLVED'].map(f=><button key={f} className={filter===f?'filter active-filter':'filter'} onClick={()=>setFilter(f)}>{f==='ALL'?'All issues':nice(f)}</button>)}</div></div>
        <div className="table-wrap"><table><thead><tr><th>DEFECT</th><th>COMPONENT</th><th>SEVERITY</th><th>STATUS</th><th>REPORTED</th><th></th></tr></thead>
          <tbody>{visible.map(b=><tr key={b.id}><td><div className="bug-title"><span className="bug-id">#{b.id}</span><strong>{b.title}</strong></div><div className="bug-desc">{b.description}</div></td><td><span className="component-pill">{b.component}</span><div className="environment">{b.environment}</div></td><td><span className={`severity sev-${b.severity.toLowerCase()}`}><i/>{nice(b.severity)}</span></td><td><select className={`status-select status-${b.status.toLowerCase()}`} value={b.status} onChange={e=>updateStatus(b,e.target.value)} aria-label={`Status for bug ${b.id}`}><option value="OPEN">Open</option><option value="IN_PROGRESS">In progress</option><option value="RESOLVED">Resolved</option></select></td><td className="date-cell">{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '—'}</td><td><button className="delete-button" title="Delete bug" onClick={()=>removeBug(b)}><Trash2 size={16}/></button></td></tr>)}
          {!visible.length && <tr><td colSpan="6"><div className="empty-state"><Bug size={28}/><strong>No defects found</strong><span>Report a bug or change your filters.</span></div></td></tr>}</tbody></table></div>
        <div className="table-footer"><span>Showing <strong>{visible.length}</strong> of <strong>{bugs.length}</strong> defects</span><span className="footer-status"><span/> Data synced with API</span></div>
      </section>
      <footer>BUGFLOW <span>•</span> AI-ASSISTED SOFTWARE QUALITY <span className="footer-right">Portfolio project · Demo ML predictions</span></footer>
    </main>
    {showForm && <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setShowForm(false)}}><section className="modal"><div className="modal-head"><div><div className="eyebrow">NEW ISSUE</div><h2>Report a defect</h2><p>Describe the issue, then use AI to estimate severity.</p></div><button className="icon-button" onClick={()=>setShowForm(false)}><X/></button></div>
      <form onSubmit={createBug}><label>Bug title<input required maxLength="140" placeholder="e.g. Checkout fails after payment" value={form.title} onChange={e=>change('title',e.target.value)}/></label>
      <label>Description<textarea required maxLength="3000" rows="4" placeholder="What happened? What did you expect to happen?" value={form.description} onChange={e=>change('description',e.target.value)}/></label>
      <div className="form-row"><label>Component<select value={form.component} onChange={e=>change('component',e.target.value)}>{['Frontend','Backend API','Authentication','Database','Payments','Reporting','Infrastructure','Other'].map(x=><option key={x}>{x}</option>)}</select></label><label>Environment<select value={form.environment} onChange={e=>change('environment',e.target.value)}>{['Development','Testing','Staging','Production'].map(x=><option key={x}>{x}</option>)}</select></label></div>
      <label>Severity<select value={form.severity} onChange={e=>change('severity',e.target.value)}>{['LOW','MEDIUM','HIGH','CRITICAL'].map(x=><option key={x} value={x}>{nice(x)}</option>)}</select></label>
      {prediction && <div className="prediction-card"><div className="prediction-icon"><Sparkles size={18}/></div><div><strong>AI prediction: {nice(prediction.severity)}</strong><p>Confidence: {Math.round((prediction.confidence || 0)*100)}% · {prediction.source || prediction.model || 'prediction service'}</p><small>{prediction.disclaimer || 'Use this as a recommendation; confirm severity with your team.'}</small></div></div>}
      <div className="modal-actions"><button type="button" className="secondary" onClick={predict} disabled={predicting}>{predicting?<RefreshCw size={16} className="spin"/>:<Sparkles size={16}/>} {predicting?'Predicting...':'Predict severity'}</button><button className="primary" disabled={busy}>{busy?'Saving...':'Create defect'}</button></div></form></section></div>}
    {toast && <div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
  </div>
}
function Stat({icon,label,value,hint,tone}) { return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-hint">{hint}</div></div> }
