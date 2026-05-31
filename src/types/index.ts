export type OrderStatus = 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Order {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  description: string;
  status: OrderStatus;
  locale: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceTranslation {
  id: string;
  serviceId: string;
  locale: string;
  title: string;
  description: string;
  features: string[];
}

export interface Price {
  id: string;
  serviceId: string;
  currency: string;
  amount: number | string;
  period?: string | null;
  isActive: boolean;
}

export interface Service {
  id: string;
  slug: string;
  icon?: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  translations: ServiceTranslation[];
  prices: Price[];
}

export interface AdminUser {
  id: string;
  email: string;
  name?: string | null;
  createdAt: Date;
}

export interface OrderFormData {
  name: string;
  email: string;
  phone?: string;
  description: string;
  locale: string;
}

export type Locale = 'en' | 'uk' | 'pl' | 'lt';
