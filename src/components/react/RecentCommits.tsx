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
    fetch('/api/commits')
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
      .then((data: unknown) => {
        if (!Array.isArray(data)) throw new Error('not array');
        const items: Commit[] = data.map((c: { msg: string; repo: string; time: string }) => ({
          msg: c.msg,
          repo: c.repo,
          ago: timeAgo(c.time),
        }));
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
          <div className="commit-msg">no recent activity</div>
          <div className="commit-meta">check back later</div>
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
