import ApiService from './api-service';

export enum ProductType {
  SOFTWARE = 'SOFTWARE',
  ECOMMERCE = 'ECOMMERCE',
}

export interface Product {
  id: number;
  type: ProductType;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  category: string;
  images: string[];
  url?: string;
  
  // Software specific
  techStack?: string[];
  features?: string[];
  liveUrl?: string;
  
  // Ecommerce specific
  price?: number;
  
  createdAt: string;
  updatedAt: string;
}

export const getProducts = () => ApiService.get<Product[]>('/products');
export const getProductBySlug = (slug: string) => ApiService.get<Product>(`/products/${slug}`);
