import { type ReactNode } from 'react';

interface ContactCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  responseTime: string;
  href: string;
  ctaLabel: string;
  external?: boolean;
}

export function ContactCard({
  icon,
  title,
  value,
  responseTime,
  href,
  ctaLabel,
  external = false,
}: ContactCardProps) {
  const linkProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <div className="group bg-[#1e1e26] rounded-2xl p-6 border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/20">
      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500/20 transition-colors">
        {icon}
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-emerald-400 font-medium mb-2">{value}</p>
      <p className="text-sm text-zinc-500 mb-4">Respon: {responseTime}</p>
      
      <a
        href={href}
        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-500 transition-colors"
        {...linkProps}
      >
        {ctaLabel}
        {external && (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        )}
      </a>
    </div>
  );
}
