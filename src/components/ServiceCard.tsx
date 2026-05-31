import Link from 'next/link';
import type { Locale } from '@/i18n';

interface ServiceCardProps {
  slug: string;
  icon?: string | null;
  title: string;
  description: string;
  features: string[];
  locale: Locale;
  learnMoreLabel: string;
}

export default function ServiceCard({
  slug,
  icon,
  title,
  description,
  features,
  locale,
  learnMoreLabel,
}: ServiceCardProps) {
  return (
    <div className="group relative bg-gradient-card border border-white/10 rounded-2xl p-6 hover:border-brand-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/10">
      {/* Icon */}
      <div className="text-4xl mb-4">{icon || '⚡'}</div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>

      {/* Description */}
      <p className="text-gray-400 text-sm leading-relaxed mb-4">{description}</p>

      {/* Features */}
      <ul className="space-y-2 mb-6">
        {features.slice(0, 4).map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
            <svg
              className="w-4 h-4 text-brand-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href={`/${locale}/services#${slug}`}
        className="inline-flex items-center gap-1 text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors group-hover:gap-2"
      >
        {learnMoreLabel}
        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500/0 to-brand-600/0 group-hover:from-brand-500/5 group-hover:to-brand-600/5 transition-all duration-300 pointer-events-none" />
    </div>
  );
}
