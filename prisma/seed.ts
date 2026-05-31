import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123';
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin',
    },
  });
  console.log(`Admin user created: ${adminEmail}`);

  // Create services
  const services = [
    {
      slug: 'web-development',
      icon: '🌐',
      order: 1,
      translations: {
        en: {
          title: 'Web Development',
          description:
            'We build high-performance, SEO-friendly web applications using Next.js, React, and modern backend technologies. From landing pages to complex SaaS platforms.',
          features: [
            'Next.js / React / TypeScript',
            'REST & GraphQL APIs',
            'PostgreSQL / MongoDB',
            'CI/CD deployment',
            'Performance optimization',
            'SEO best practices',
          ],
        },
        uk: {
          title: 'Веб-розробка',
          description:
            'Ми створюємо високопродуктивні, SEO-оптимізовані веб-застосунки з використанням Next.js, React та сучасних серверних технологій. Від лендингів до складних SaaS-платформ.',
          features: [
            'Next.js / React / TypeScript',
            'REST та GraphQL API',
            'PostgreSQL / MongoDB',
            'CI/CD деплой',
            'Оптимізація продуктивності',
            'SEO-оптимізація',
          ],
        },
        pl: {
          title: 'Tworzenie stron WWW',
          description:
            'Tworzymy wydajne, przyjazne SEO aplikacje webowe używając Next.js, React i nowoczesnych technologii backendowych. Od landing page po złożone platformy SaaS.',
          features: [
            'Next.js / React / TypeScript',
            'REST i GraphQL API',
            'PostgreSQL / MongoDB',
            'Wdrożenie CI/CD',
            'Optymalizacja wydajności',
            'Najlepsze praktyki SEO',
          ],
        },
        lt: {
          title: 'Žiniatinklio kūrimas',
          description:
            'Kuriame našias, SEO draugiškas žiniatinklio programas naudojant Next.js, React ir šiuolaikines backend technologijas. Nuo nukreipimo puslapių iki sudėtingų SaaS platformų.',
          features: [
            'Next.js / React / TypeScript',
            'REST ir GraphQL API',
            'PostgreSQL / MongoDB',
            'CI/CD diegimas',
            'Našumo optimizavimas',
            'SEO geroji praktika',
          ],
        },
      },
      price: { amount: 1500, currency: 'USD', period: 'per project' },
    },
    {
      slug: 'mobile-development',
      icon: '📱',
      order: 2,
      translations: {
        en: {
          title: 'Mobile Development',
          description:
            'Cross-platform mobile apps with React Native that look and feel native on iOS and Android. We handle everything from design to App Store submission.',
          features: [
            'React Native / Expo',
            'iOS & Android',
            'Push notifications',
            'Offline support',
            'App Store submission',
            'Analytics integration',
          ],
        },
        uk: {
          title: 'Мобільна розробка',
          description:
            'Крос-платформені мобільні застосунки з React Native, що виглядають і відчуваються нативними на iOS та Android. Ми займаємося всім — від дизайну до публікації в App Store.',
          features: [
            'React Native / Expo',
            'iOS та Android',
            'Push-сповіщення',
            'Офлайн-підтримка',
            'Публікація в App Store',
            'Інтеграція аналітики',
          ],
        },
        pl: {
          title: 'Tworzenie aplikacji mobilnych',
          description:
            'Wieloplatformowe aplikacje mobilne z React Native, które wyglądają i działają natywnie na iOS i Android. Zajmujemy się wszystkim od projektu do publikacji w App Store.',
          features: [
            'React Native / Expo',
            'iOS i Android',
            'Powiadomienia push',
            'Wsparcie offline',
            'Publikacja w App Store',
            'Integracja analityki',
          ],
        },
        lt: {
          title: 'Mobilių programėlių kūrimas',
          description:
            'Kelių platformų mobiliosios programėlės su React Native, kurios atrodo ir veikia natūraliai iOS ir Android. Mes tvarkome viską nuo dizaino iki App Store pateikimo.',
          features: [
            'React Native / Expo',
            'iOS ir Android',
            'Push pranešimai',
            'Offline palaikymas',
            'App Store pateikimas',
            'Analitikos integracija',
          ],
        },
      },
      price: { amount: 2500, currency: 'USD', period: 'per project' },
    },
    {
      slug: 'api-development',
      icon: '⚡',
      order: 3,
      translations: {
        en: {
          title: 'API & Backend',
          description:
            'Robust, scalable APIs and backend systems built with Node.js, Express, NestJS, or Python FastAPI. Designed for high availability and performance.',
          features: [
            'Node.js / NestJS / FastAPI',
            'RESTful & GraphQL',
            'Authentication & Authorization',
            'Database design',
            'Microservices architecture',
            'API documentation',
          ],
        },
        uk: {
          title: 'API та Бекенд',
          description:
            'Надійні, масштабовані API та серверні системи на Node.js, Express, NestJS або Python FastAPI. Розроблені для високої доступності та продуктивності.',
          features: [
            'Node.js / NestJS / FastAPI',
            'RESTful та GraphQL',
            'Автентифікація та авторизація',
            'Проектування БД',
            'Мікросервісна архітектура',
            'Документація API',
          ],
        },
        pl: {
          title: 'API i Backend',
          description:
            'Solidne, skalowalne API i systemy backendowe zbudowane z Node.js, Express, NestJS lub Python FastAPI. Zaprojektowane dla wysokiej dostępności i wydajności.',
          features: [
            'Node.js / NestJS / FastAPI',
            'RESTful i GraphQL',
            'Uwierzytelnianie i autoryzacja',
            'Projektowanie baz danych',
            'Architektura mikroserwisów',
            'Dokumentacja API',
          ],
        },
        lt: {
          title: 'API ir Backend',
          description:
            'Tvirti, keičiamo dydžio API ir backend sistemos sukurtos su Node.js, Express, NestJS ar Python FastAPI. Suprojektuotos dideliam prieinamumui ir našumui.',
          features: [
            'Node.js / NestJS / FastAPI',
            'RESTful ir GraphQL',
            'Autentifikacija ir autorizacija',
            'Duomenų bazės projektavimas',
            'Mikroservisų architektūra',
            'API dokumentacija',
          ],
        },
      },
      price: { amount: 1000, currency: 'USD', period: 'per project' },
    },
    {
      slug: 'ui-ux-design',
      icon: '🎨',
      order: 4,
      translations: {
        en: {
          title: 'UI/UX Design',
          description:
            'Beautiful, user-centered designs that convert visitors into customers. We create wireframes, prototypes, and production-ready design systems.',
          features: [
            'Figma design',
            'User research',
            'Wireframing & prototyping',
            'Design systems',
            'Accessibility (WCAG)',
            'Responsive design',
          ],
        },
        uk: {
          title: 'UI/UX Дизайн',
          description:
            'Красиві, орієнтовані на користувача дизайни, що перетворюють відвідувачів на клієнтів. Ми створюємо вайрфрейми, прототипи та готові дизайн-системи.',
          features: [
            'Дизайн у Figma',
            'Дослідження користувачів',
            'Вайрфреймінг та прототипування',
            'Дизайн-системи',
            'Доступність (WCAG)',
            'Адаптивний дизайн',
          ],
        },
        pl: {
          title: 'Projektowanie UI/UX',
          description:
            'Piękne, zorientowane na użytkownika projekty, które zamieniają odwiedzających w klientów. Tworzymy wireframes, prototypy i gotowe systemy projektowe.',
          features: [
            'Projekt w Figma',
            'Badania użytkowników',
            'Wireframing i prototypowanie',
            'Systemy projektowe',
            'Dostępność (WCAG)',
            'Responsywny design',
          ],
        },
        lt: {
          title: 'UI/UX Dizainas',
          description:
            'Gražūs, vartotojui orientuoti dizainai, kurie paverčia lankytojus klientais. Kuriame karkasus, prototipus ir gamybai paruoštas dizaino sistemas.',
          features: [
            'Figma dizainas',
            'Vartotojų tyrimai',
            'Karkasavimas ir prototipavimas',
            'Dizaino sistemos',
            'Prieinamumas (WCAG)',
            'Reaguojantis dizainas',
          ],
        },
      },
      price: { amount: 800, currency: 'USD', period: 'per project' },
    },
    {
      slug: 'seo-optimization',
      icon: '🔍',
      order: 5,
      translations: {
        en: {
          title: 'SEO Optimization',
          description:
            'Technical SEO audits and optimization to improve your search rankings. We handle Core Web Vitals, structured data, sitemap, and content strategy.',
          features: [
            'Technical SEO audit',
            'Core Web Vitals',
            'Structured data (JSON-LD)',
            'Sitemap & robots.txt',
            'Page speed optimization',
            'Monthly reporting',
          ],
        },
        uk: {
          title: 'SEO Оптимізація',
          description:
            'Технічний SEO-аудит та оптимізація для покращення позицій у пошуку. Ми займаємося Core Web Vitals, структурованими даними, картою сайту та контент-стратегією.',
          features: [
            'Технічний SEO-аудит',
            'Core Web Vitals',
            'Структуровані дані (JSON-LD)',
            'Sitemap та robots.txt',
            'Оптимізація швидкості',
            'Щомісячна звітність',
          ],
        },
        pl: {
          title: 'Optymalizacja SEO',
          description:
            'Techniczne audyty SEO i optymalizacja w celu poprawy pozycji w wyszukiwarkach. Zajmujemy się Core Web Vitals, danymi strukturalnymi, sitemap i strategią treści.',
          features: [
            'Techniczny audyt SEO',
            'Core Web Vitals',
            'Dane strukturalne (JSON-LD)',
            'Sitemap i robots.txt',
            'Optymalizacja szybkości strony',
            'Miesięczne raportowanie',
          ],
        },
        lt: {
          title: 'SEO Optimizavimas',
          description:
            'Techniniai SEO auditai ir optimizavimas siekiant pagerinti paieškos reitingus. Tvarkome Core Web Vitals, struktūrizuotus duomenis, svetainės žemėlapį ir turinio strategiją.',
          features: [
            'Techninis SEO auditas',
            'Core Web Vitals',
            'Struktūrizuoti duomenys (JSON-LD)',
            'Svetainės žemėlapis ir robots.txt',
            'Puslapio greičio optimizavimas',
            'Mėnesinės ataskaitos',
          ],
        },
      },
      price: { amount: 500, currency: 'USD', period: 'per month' },
    },
    {
      slug: 'devops-cloud',
      icon: '☁️',
      order: 6,
      translations: {
        en: {
          title: 'DevOps & Cloud',
          description:
            'Infrastructure setup, CI/CD pipelines, and cloud deployment on AWS, GCP, or Render.com. We ensure your app is reliable, secure, and scalable.',
          features: [
            'Docker & Kubernetes',
            'CI/CD pipelines',
            'AWS / GCP / Render',
            'Monitoring & alerts',
            'SSL & security hardening',
            'Auto-scaling setup',
          ],
        },
        uk: {
          title: 'DevOps та Хмара',
          description:
            'Налаштування інфраструктури, CI/CD пайплайни та хмарне розгортання на AWS, GCP або Render.com. Ми забезпечуємо надійність, безпеку та масштабованість вашого застосунку.',
          features: [
            'Docker та Kubernetes',
            'CI/CD пайплайни',
            'AWS / GCP / Render',
            'Моніторинг та сповіщення',
            'SSL та захист безпеки',
            'Налаштування автомасштабування',
          ],
        },
        pl: {
          title: 'DevOps i Chmura',
          description:
            'Konfiguracja infrastruktury, potoki CI/CD i wdrożenie w chmurze na AWS, GCP lub Render.com. Zapewniamy niezawodność, bezpieczeństwo i skalowalność Twojej aplikacji.',
          features: [
            'Docker i Kubernetes',
            'Potoki CI/CD',
            'AWS / GCP / Render',
            'Monitoring i alerty',
            'SSL i wzmocnienie bezpieczeństwa',
            'Konfiguracja auto-skalowania',
          ],
        },
        lt: {
          title: 'DevOps ir Debesija',
          description:
            'Infrastruktūros sąranka, CI/CD vamzdynai ir debesų diegimas AWS, GCP ar Render.com. Užtikriname, kad jūsų programa būtų patikima, saugi ir keičiamo dydžio.',
          features: [
            'Docker ir Kubernetes',
            'CI/CD vamzdynai',
            'AWS / GCP / Render',
            'Stebėjimas ir perspėjimai',
            'SSL ir saugumo stiprinimas',
            'Automatinio mastelio keitimo sąranka',
          ],
        },
      },
      price: { amount: 600, currency: 'USD', period: 'per month' },
    },
  ];

  for (const svc of services) {
    const service = await prisma.service.upsert({
      where: { slug: svc.slug },
      update: {},
      create: {
        slug: svc.slug,
        icon: svc.icon,
        order: svc.order,
        isActive: true,
      },
    });

    for (const [locale, translation] of Object.entries(svc.translations)) {
      await prisma.serviceTranslation.upsert({
        where: { serviceId_locale: { serviceId: service.id, locale } },
        update: {},
        create: {
          serviceId: service.id,
          locale,
          title: translation.title,
          description: translation.description,
          features: translation.features,
        },
      });
    }

    await prisma.price.deleteMany({ where: { serviceId: service.id } });
    await prisma.price.create({
      data: {
        serviceId: service.id,
        currency: svc.price.currency,
        amount: svc.price.amount,
        period: svc.price.period,
        isActive: true,
      },
    });

    console.log(`Service seeded: ${svc.slug}`);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
