import { useEffect, useState } from 'react';
import { fetchRecentBlogPost, type RecentBlogPost } from '../../lib/recentBlog';

interface Props {
  lang: 'zh' | 'en';
  initialPost: RecentBlogPost | null;
}

function GlowText({ text }: { text: string }) {
  return <>{Array.from(text).map((character, index) => <span className="gc" key={`${index}-${character}`}>{character}</span>)}</>;
}

export default function RecentThought({ lang, initialPost }: Props) {
  const [post, setPost] = useState(initialPost);

  useEffect(() => {
    let active = true;
    void fetchRecentBlogPost().then((latest) => {
      if (active && latest) setPost(latest);
    });
    return () => { active = false; };
  }, []);

  const title = post?.title ?? (lang === 'zh' ? '打开博客' : 'Open the blog');
  const description = post?.description ?? (lang === 'zh'
    ? '最近的文章暂时没有载入，仍可进入博客继续阅读。'
    : 'The latest post is temporarily unavailable. Open the blog to keep reading.');

  return (
    <a
      className="blog-card"
      data-recent-thought
      href={post?.url ?? 'https://blog.ysoseri.us'}
      target="_blank"
      rel="noreferrer"
    >
      <div className="blog-title"><GlowText text={title} /></div>
      <div className="blog-description" title={description}><GlowText text={description} /></div>
    </a>
  );
}
