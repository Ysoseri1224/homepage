import { motion } from 'motion/react';

interface Props {
  name: string;
  description: string;
  tags?: string[];
  url?: string;
}

export default function ProjectCard({ name, description, tags = [], url }: Props) {
  const Wrapper = url ? motion.a : motion.div;
  const props = url ? { href: url, target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <Wrapper
      {...props}
      className="block py-4 px-5 -mx-5 rounded-xl border border-transparent transition-colors duration-150 cursor-pointer"
      whileHover={{
        y: -2,
        scale: 1.005,
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-bg-card)',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-[var(--color-text)] font-medium">{name}</h3>
        {url && (
          <svg className="w-3.5 h-3.5 text-[var(--color-text-muted)] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        )}
      </div>
      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{description}</p>
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-border)] text-[var(--color-text-muted)]">
              {tag}
            </span>
          ))}
        </div>
      )}
    </Wrapper>
  );
}
