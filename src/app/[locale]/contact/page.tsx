import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import OrderForm from '@/components/OrderForm';
import { locales, type Locale } from '@/i18n';
import prisma from '@/lib/prisma';
import { getSiteName } from '@/lib/getSiteName';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: PageProps): Promise<Metadata> {
  const [t, siteName] = await Promise.all([
    getTranslations({ locale, namespace: 'meta' }),
    getSiteName(),
  ]);
  return {
    title: `${t('contactTitle')} | ${siteName}`,
    description: t('contactDescription'),
  };
}

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const TelegramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const ViberIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.398.002C9.473.028 5.331.344 3.014 2.467 1.294 4.177.693 6.698.623 9.82c-.07 3.12-.154 8.97 5.5 10.564h.005l-.005 2.424s-.038.975.607 1.172c.79.24 1.253-.504 2.006-1.312.413-.444.982-1.094 1.41-1.59 3.888.327 6.882-.42 7.228-.531.787-.254 5.241-.826 5.97-6.738.75-6.087-.364-9.93-2.883-11.662h-.002C18.226.581 15.553-.047 11.398.002zm.074 1.8c3.673-.047 6.104.545 7.583 1.63 2.013 1.462 2.924 4.815 2.267 9.974-.614 4.986-4.22 5.386-4.876 5.598-.293.094-2.98.755-6.33.536 0 0-2.508 3.025-3.289 3.81-.122.122-.266.17-.361.146-.135-.035-.172-.195-.17-.432l.021-3.73c-4.762-1.306-4.485-6.22-4.428-8.956.057-2.736.554-4.847 2.003-6.273C5.44 2.297 8.84 1.848 11.472 1.802zm.16 2.735c-.225-.001-.451.016-.676.05-.39.058-.655.424-.597.817.059.393.424.66.817.6.192-.028.386-.04.578-.04 2.655 0 4.815 2.16 4.815 4.814 0 .196-.012.39-.04.583-.058.394.214.757.607.816.394.059.758-.214.817-.607.036-.254.054-.509.054-.766 0-3.653-2.97-6.623-6.622-6.627-.25 0-.503.01-.753.031zm-4.468.907a.79.79 0 00-.564.21C5.003 7.119 4.25 9.06 4.374 11.058c.122 1.97.959 3.704 2.302 4.892a.797.797 0 001.126-.057.797.797 0 00-.057-1.126c-1.035-.922-1.685-2.29-1.783-3.823-.097-1.56.427-3.01 1.37-3.886a.797.797 0 00.024-1.128.797.797 0 00-.564-.261.806.806 0 00-.502.175zm4.444 1.327c-.105 0-.21.005-.314.016-.394.042-.682.392-.64.786s.393.682.787.64c.055-.006.11-.009.167-.009 1.397 0 2.534 1.137 2.534 2.534 0 .058-.003.115-.009.172-.04.394.248.745.642.785.394.04.745-.249.785-.642.01-.105.015-.21.015-.315 0-2.388-1.945-4.32-4.333-4.327zm-2.11 1.946a.796.796 0 00-.697.432 5.547 5.547 0 00-.571 2.438c0 .44.394.797.834.797.44 0 .797-.357.797-.797 0-.578.125-1.128.352-1.622a.797.797 0 00-.364-1.063.793.793 0 00-.35-.185zm2.11.754c-.44 0-.796.356-.796.796v.012c0 .44.356.797.796.797.44 0 .797-.357.797-.797v-.012c0-.44-.357-.796-.797-.796z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

async function getContactSettings() {
  try {
    const s = await prisma.siteSettings.upsert({
      where: { id: 'singleton' },
      update: {},
      create: { id: 'singleton' },
    });
    return {
      email: s.contactEmailVisible ? (s.contactEmail ?? '') : '',
      telegram: s.contactTelegramVisible ? (s.contactTelegram ?? '') : '',
      viber: s.contactViberVisible ? (s.contactViber ?? '') : '',
      whatsapp: s.contactWhatsappVisible ? (s.contactWhatsapp ?? '') : '',
    };
  } catch {
    return { email: '', telegram: '', viber: '', whatsapp: '' };
  }
}

function telegramHref(value: string) {
  if (value.startsWith('http')) return value;
  const username = value.startsWith('@') ? value.slice(1) : value;
  return `https://t.me/${username}`;
}

function telegramDisplay(value: string) {
  if (value.startsWith('http')) {
    const match = value.match(/t\.me\/(.+)/);
    return match ? `@${match[1]}` : value;
  }
  return value.startsWith('@') ? value : `@${value}`;
}

export default async function ContactPage({ params: { locale } }: PageProps) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const contacts = await getContactSettings();

  const contactItems: { icon: ReactNode; label: string; value: string; href: string; color: string }[] = [
    contacts.email ? {
      icon: <EmailIcon />,
      label: 'Email',
      value: contacts.email,
      href: `mailto:${contacts.email}`,
      color: '#6366f1',
    } : null,
    contacts.telegram ? {
      icon: <TelegramIcon />,
      label: 'Telegram',
      value: telegramDisplay(contacts.telegram),
      href: telegramHref(contacts.telegram),
      color: '#29b6f6',
    } : null,
    contacts.viber ? {
      icon: <ViberIcon />,
      label: 'Viber',
      value: contacts.viber,
      href: `viber://chat?number=%2B${contacts.viber.replace(/\D/g, '')}`,
      color: '#7360f2',
    } : null,
    contacts.whatsapp ? {
      icon: <WhatsAppIcon />,
      label: 'WhatsApp',
      value: contacts.whatsapp,
      href: `https://wa.me/${contacts.whatsapp.replace(/\D/g, '')}`,
      color: '#25d366',
    } : null,
  ].filter((x): x is NonNullable<typeof x> => x !== null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left side */}
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-text-base mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-text-muted text-lg mb-10">{t('contact.subtitle')}</p>

          {/* Contact channels */}
          {contactItems.length > 0 && (
            <div className="space-y-3 mb-10">
              {contactItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.label !== 'Email' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${item.color}22`, color: item.color }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs text-text-muted mb-0.5">{item.label}</div>
                    <div className="text-text-base text-sm font-medium group-hover:underline">{item.value}</div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Features */}
          <div className="space-y-6">
            {[
              { icon: '⚡', title: 'Fast Response', desc: 'We reply to all inquiries within 24 hours.' },
              { icon: '🔒', title: 'NDA Available', desc: 'Your project details are always kept confidential.' },
              { icon: '🌍', title: 'Global Team', desc: 'We work across all time zones and speak 4 languages.' },
              { icon: '💡', title: 'Free Consultation', desc: 'Get expert advice on your project at no cost.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="text-2xl">{item.icon}</div>
                <div>
                  <h3 className="text-text-base font-semibold mb-1">{item.title}</h3>
                  <p className="text-text-muted text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - form */}
        <div className="bg-gradient-card border border-white/10 rounded-2xl p-8">
          <OrderForm locale={locale as Locale} />
        </div>
      </div>
    </div>
  );
}
