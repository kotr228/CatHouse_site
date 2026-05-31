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

export function getOrganizationJsonLd(siteUrl: string, siteName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    name: siteName,
    url: siteUrl,
    description:
      'Professional software development services: web apps, mobile apps, APIs, UI/UX design, SEO, and DevOps.',
    serviceType: 'Software Development',
    areaServed: 'Worldwide',
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
    sameAs: [],
  };
}
