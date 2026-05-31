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
  startingPrice?: { amount: string | number; currency: string } | null;
}

export default function ServiceCard({
  slug,
  icon,
  title,
  description,
  features,
  locale,
  learnMoreLabel,
  startingPrice,
}: ServiceCardProps) {
  const currencySymbol =
    startingPrice?.currency === 'USD'
      ? '$'
      : startingPrice?.currency === 'EUR'
      ? '€'
      : startingPrice?.currency || '';

  return (
    <div
      className="group relative bg-gradient-card border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
      style={{
        ['--hover-border' as string]: 'var(--color-primary)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 25px -5px rgba(var(--color-primary-rgb, 99 102 241) / 0.15)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
        (e.currentTarget as HTMLElement).style.boxShadow = '';
      }}
    >
      {/* Icon */}
      <div className="text-4xl mb-4">{icon || '⚡'}</div>

      {/* Title */}
      <h3 className="text-xl font-bold text-text-base mb-3">{title}</h3>

      {/* Description */}
      <p className="text-text-muted text-sm leading-relaxed mb-4">{description}</p>

      {/* Features */}
      <ul className="space-y-2 mb-4">
        {features.slice(0, 4).map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-text-base">
            <svg
              className="w-4 h-4 flex-shrink-0"
              style={{ color: 'var(--color-primary)' }}
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

      {/* Starting price chip */}
      {startingPrice && (
        <div
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mb-4 border"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)',
            borderColor: 'color-mix(in srgb, var(--color-primary) 30%, transparent)',
            color: 'var(--color-primary)',
          }}
        >
          From {currencySymbol}{Number(startingPrice.amount).toLocaleString()}
        </div>
      )}

      {/* CTA */}
      <div>
        <Link
          href={`/${locale}/services#${slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium transition-colors group-hover:gap-2"
          style={{ color: 'var(--color-primary)' }}
        >
          {learnMoreLabel}
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 5%, transparent), color-mix(in srgb, var(--color-secondary) 5%, transparent))' }}
      />
    </div>
  );
}
