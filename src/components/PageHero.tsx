import type { ReactNode } from 'react';

interface PageHeroProps {
  /** Small overline chip — e.g. "Narrative Analysis Engine" */
  badge?: string;
  /** Optional colored badge (e.g. "Act II: The Descent") — renders as a pill */
  contextTag?: string;
  /** Main page h1 — supports inline accent word via `accentWord` */
  title: string;
  /** If provided, this exact word inside `title` is rendered in italic primary color */
  accentWord?: string;
  /** Optional subtitle paragraph */
  subtitle?: string;
  /** Optional right-side slot for action buttons / stats */
  actions?: ReactNode;
  /** Extra className forwarded to the container */
  className?: string;
}

/**
 * Standardized page hero section — consistent h1/subtitle/badge across all pages.
 * Replaces the 3 different header patterns found when auditing the codebase.
 */
export default function PageHero({
  badge,
  contextTag,
  title,
  accentWord,
  subtitle,
  actions,
  className = '',
}: PageHeroProps) {
  /** Render title with optional italic primary-colored accent word */
  const renderTitle = () => {
    if (!accentWord || !title.includes(accentWord)) {
      return <span>{title}</span>;
    }
    const [before, after] = title.split(accentWord);
    return (
      <>
        {before}
        <span className="italic text-primary">{accentWord}</span>
        {after}
      </>
    );
  };

  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 ${className}`}>
      <div className="space-y-2">
        {/* Overline label */}
        {badge && (
          <span className="block text-[10px] font-headline font-bold text-primary tracking-[0.2em] uppercase">
            {badge}
          </span>
        )}

        {/* Context tag chip (e.g. Act II) */}
        {contextTag && (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-headline font-bold uppercase tracking-widest mb-1">
            {contextTag}
          </span>
        )}

        {/* Main h1 */}
        <h1 className="font-body text-[2.75rem] leading-none font-light tracking-tight text-on-surface">
          {renderTitle()}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="font-body text-lg text-on-surface-variant max-w-xl leading-relaxed mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right-side actions slot */}
      {actions && (
        <div className="flex items-center gap-4 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
