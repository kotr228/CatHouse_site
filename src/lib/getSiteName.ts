import prisma from './prisma';

export async function getSiteName(): Promise<string> {
  try {
    const s = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
    return s?.siteName || process.env.NEXT_PUBLIC_SITE_NAME || 'DevStudio';
  } catch {
    return process.env.NEXT_PUBLIC_SITE_NAME || 'DevStudio';
  }
}
