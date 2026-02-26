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
  external = false,
}: ContactCardProps) {
  const linkProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <a
      href={href}
      {...linkProps}
      className="group relative flex items-center justify-between p-6 rounded-2xl bg-[#14141a] border border-white/5 hover:border-slate-400/30 transition-all duration-500 overflow-hidden hover:shadow-[0_0_40px_rgba(203,213,225,0.1)]"
    >
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-400/0 via-slate-400/0 to-slate-400/0 opacity-0 group-hover:opacity-5 group-hover:via-slate-400/10 transition-all duration-500" />
      
      <div className="flex items-center gap-6 relative z-10">
        {/* Icon Box */}
        <div className="w-14 h-14 rounded-2xl bg-[#0a0a0f] border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-slate-300 group-hover:border-slate-400/30 group-hover:scale-110 transition-all duration-500 shadow-xl">
          <div className="w-6 h-6">
            {icon}
          </div>
        </div>
        
        {/* Text Content */}
        <div>
          <h3 className="text-lg font-medium text-white mb-1 group-hover:text-slate-50 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-zinc-500 font-mono mb-2 group-hover:text-zinc-400 transition-colors">
            {value}
          </p>
          <div className="flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <p className="text-xs text-emerald-400/80 font-medium">
               Respon: {responseTime}
             </p>
          </div>
        </div>
      </div>

      {/* Action Arrow */}
      <div className="relative z-10 w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-zinc-500 group-hover:text-slate-300 group-hover:border-slate-400/30 transition-all duration-300 group-hover:translate-x-1">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </a>
  );
}
