interface JsonLdProps {
  data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export interface OrganizationJsonLdOptions {
  locale?: string;
  description?: string;
  email?: string | null;
  /** Social / messaging profile URLs, e.g. Telegram, WhatsApp. */
  sameAs?: string[];
}

export function getOrganizationJsonLd(
  siteUrl: string,
  siteName: string,
  options: OrganizationJsonLdOptions = {}
) {
  const { locale, description, email, sameAs = [] } = options;

  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': `${siteUrl}/#organization`,
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/icon`,
    image: `${siteUrl}/opengraph-image`,
    ...(locale ? { inLanguage: locale } : {}),
    description:
      description ||
      'Professional software development services: web apps, mobile apps, APIs, UI/UX design, SEO, and DevOps.',
    serviceType: 'Software Development',
    areaServed: 'Worldwide',
    ...(email ? { email } : {}),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Software Development Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Web Development' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Mobile Development' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'API & Backend Development' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'UI/UX Design' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'SEO Optimization' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'DevOps & Cloud' } },
      ],
    },
    sameAs,
  };
}
