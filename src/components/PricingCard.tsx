import Link from 'next/link';
import type { Locale } from '@/i18n';

interface PricingCardProps {
  title: string;
  description: string;
  features: string[];
  amount: number | string;
  currency: string;
  period?: string | null;
  isPopular?: boolean;
  locale: Locale;
  fromLabel: string;
  getStartedLabel: string;
  mostPopularLabel: string;
}

export default function PricingCard({
  title,
  description,
  features,
  amount,
  currency,
  period,
  isPopular,
  locale,
  fromLabel,
  getStartedLabel,
  mostPopularLabel,
}: PricingCardProps) {
  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency;

  return (
    <div
      className={`relative rounded-2xl p-6 flex flex-col transition-all duration-300 ${
        isPopular ? 'border shadow-xl' : 'bg-gradient-card border border-white/10'
      }`}
      style={
        isPopular
          ? {
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
              borderColor: 'color-mix(in srgb, var(--color-primary) 50%, transparent)',
              boxShadow: '0 20px 40px -10px color-mix(in srgb, var(--color-primary) 30%, transparent)',
            }
          : {}
      }
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            {mostPopularLabel}
          </span>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2 text-text-base">{title}</h3>
        <p className={`text-sm ${isPopular ? 'text-white/80' : 'text-text-muted'}`}>{description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className={`text-sm ${isPopular ? 'text-white/70' : 'text-text-muted'}`}>
            {fromLabel}
          </span>
          <span className="text-4xl font-bold text-text-base">
            {currencySymbol}{Number(amount).toLocaleString()}
          </span>
        </div>
        {period && (
          <span className={`text-sm ${isPopular ? 'text-white/70' : 'text-text-muted'}`}>
            / {period}
          </span>
        )}
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm">
            <svg
              className={`w-4 h-4 flex-shrink-0 ${isPopular ? 'text-white' : ''}`}
              style={!isPopular ? { color: 'var(--color-accent)' } : {}}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className={isPopular ? 'text-white/90' : 'text-text-base'}>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={`/${locale}/contact`}
        className="w-full py-3 rounded-xl text-center text-sm font-semibold transition-all duration-200"
        style={
          isPopular
            ? { backgroundColor: 'white', color: 'var(--color-primary)' }
            : { backgroundColor: 'var(--color-primary)', color: 'white' }
        }
      >
        {getStartedLabel}
      </Link>
    </div>
  );
}
