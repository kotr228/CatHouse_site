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
    startingPrice?.currency === 'USD' ? '$' :
    startingPrice?.currency === 'EUR' ? '€' :
    startingPrice?.currency || '';

  return (
    <div className="service-card group relative rounded-2xl p-6 transition-all duration-300">
      <div className="text-4xl mb-4">{icon || '⚡'}</div>

      <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
        {title}
      </h3>

      <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-muted)' }}>
        {description}
      </p>

      <ul className="space-y-2 mb-4">
        {features.slice(0, 4).map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text)' }}>
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

      {startingPrice && (
        <div className="service-card__price inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mb-4 border">
          From {currencySymbol}{Number(startingPrice.amount).toLocaleString()}
        </div>
      )}

      <Link
        href={`/${locale}/services#${slug}`}
        className="inline-flex items-center gap-1 text-sm font-medium transition-all group-hover:gap-2"
        style={{ color: 'var(--color-primary)' }}
      >
        {learnMoreLabel}
        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>

      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none service-card__glow" />
    </div>
  );
}
