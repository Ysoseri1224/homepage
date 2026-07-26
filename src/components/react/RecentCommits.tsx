import { useState, useEffect } from 'react';

interface Commit {
  repo: string;
  message: string;
  time: string;
}

function relativeTime(dateStr: string, lang: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (lang === 'zh') {
    if (mins < 60) return `${mins} 分钟前`;
    if (hours < 24) return `${hours} 小时前`;
    return `${days} 天前`;
  }
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function RecentCommits({ lang = 'zh' }: { lang?: string }) {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.github.com/users/Ysoseri1224/events?per_page=10')
      .then((r) => (r.ok ? r.json() : []))
      .then((events: any[]) => {
        const pushes = events
          .filter((e) => e.type === 'PushEvent')
          .flatMap((e) =>
            e.payload.commits.map((c: any) => ({
              repo: e.repo.name.split('/')[1],
              message: c.message.split('\n')[0],
              time: e.created_at,
            }))
          )
          .slice(0, 5);
        setCommits(pushes);
      })
      .catch(() => setCommits([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-4 rounded bg-[var(--color-border)] animate-pulse" style={{ width: `${70 - i * 10}%` }} />
        ))}
      </div>
    );
  }

  if (commits.length === 0) {
    return <p className="text-sm text-[var(--color-text-muted)]">...</p>;
  }

  return (
    <ul className="space-y-2">
      {commits.map((c, i) => (
        <li key={i} className="text-sm leading-snug">
          <span className="text-[var(--color-text-muted)]">{c.repo}</span>
          <span className="mx-1.5 text-[var(--color-border)]">·</span>
          <span className="text-[var(--color-text-secondary)]">{c.message.slice(0, 50)}</span>
          <span className="ml-2 text-xs text-[var(--color-text-muted)]">{relativeTime(c.time, lang)}</span>
        </li>
      ))}
    </ul>
  );
}
