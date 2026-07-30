const RECENT_POSTS_URL = 'https://blog.ysoseri.us/api/public/recent?limit=1';

export interface RecentBlogPost {
  id: string;
  title: string;
  description: string;
  url: string;
  repositoryKey: string;
  repositoryName: string;
  language: string;
  firstPublishedAt: string;
  lastPublishedAt: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseRecentPost(value: unknown): RecentBlogPost | null {
  if (!isRecord(value)) return null;
  const fields = ['id', 'title', 'description', 'url', 'repositoryKey', 'repositoryName', 'language', 'firstPublishedAt', 'lastPublishedAt'] as const;
  if (!fields.every((field) => typeof value[field] === 'string')) return null;
  try {
    if (new URL(value.url as string).origin !== 'https://blog.ysoseri.us') return null;
  } catch {
    return null;
  }
  return Object.fromEntries(fields.map((field) => [field, value[field]])) as unknown as RecentBlogPost;
}

export async function fetchRecentBlogPost(): Promise<RecentBlogPost | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4_000);
  try {
    const response = await fetch(RECENT_POSTS_URL, {
      headers: { accept: 'application/json' },
      signal: controller.signal,
    });
    if (!response.ok) return null;
    const payload: unknown = await response.json();
    if (!isRecord(payload) || !Array.isArray(payload.posts)) return null;
    return parseRecentPost(payload.posts[0]);
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
