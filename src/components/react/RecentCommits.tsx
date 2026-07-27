import { useState, useEffect, useRef } from 'react';

interface Commit {
  msg: string;
  repo: string;
  ago: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

export default function RecentCommits() {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('https://api.github.com/users/Ysoseri1224/events?per_page=30')
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
      .then((events: any[]) => {
        if (!Array.isArray(events)) throw new Error('not array');
        const items: Commit[] = [];
        for (const ev of events) {
          if (ev.type !== 'PushEvent') continue;
          for (const c of (ev.payload?.commits || [])) {
            items.push({ msg: c.message.split('\n')[0], repo: ev.repo.name.split('/')[1], ago: timeAgo(ev.created_at) });
            if (items.length >= 4) break;
          }
          if (items.length >= 4) break;
        }
        setCommits(items);
      })
      .catch(() => setCommits([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || !listRef.current) return;
    const items = listRef.current.querySelectorAll('.commit-item');
    items.forEach((el, i) => {
      const e = el as HTMLElement;
      e.style.opacity = '0';
      e.style.transform = 'translateY(5px)';
      e.style.transition = `opacity .4s ${i * 70}ms ease,transform .4s cubic-bezier(0.16,1,0.3,1) ${i * 70}ms`;
      setTimeout(() => { e.style.opacity = '1'; e.style.transform = 'translateY(0)'; }, 80);
    });
  }, [loading]);

  if (loading) {
    return (
      <div className="commit-list">
        {[0,1,2,3].map(i => (
          <div key={i} className="commit-item">
            <div className="commit-skeleton" style={{ width: `${60 + i * 8}%`, marginBottom: '4px' }} />
            <div className="commit-skeleton" style={{ width: '40%' }} />
          </div>
        ))}
      </div>
    );
  }

  if (!commits.length) {
    return (
      <div className="commit-list">
        <div className="commit-item">
          <div className="commit-msg">rate limited</div>
          <div className="commit-meta">GitHub API 60/hr · try later</div>
        </div>
      </div>
    );
  }

  return (
    <div className="commit-list" ref={listRef}>
      {commits.map((c, i) => (
        <div key={i} className="commit-item">
          <div className="commit-msg">{c.msg}</div>
          <div className="commit-meta">{c.ago} · {c.repo}</div>
        </div>
      ))}
    </div>
  );
}
