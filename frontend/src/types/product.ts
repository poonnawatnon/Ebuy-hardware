export interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  condition: string;
  category: string;
  subcategory?: string;
  images: string[];
  specs: Record<string, any> | null;
  status: string;
  sellerId: string;
  quantity: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  seller: {
    username: string;
    email: string;
  };
}
export interface ProductDetailResponse {
  id: string;
  title: string;
  description: string | null;
  price: number;
  condition: string;
  category: string;
  subcategory?: string;
  images: string[];
  specs: Record<string, any> | null;
  status: string;
  featured: boolean;
  views: number;
  sellerId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  seller: {
    username: string;
    email: string;
  };
}
  
export interface ProductResponse {
  products: Product[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
} 
export interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}
  export type MainCategory =
  | 'NEW'
  | 'GAMING_PCS'
  | 'GPUS'
  | 'CPUS'
  | 'COMPONENTS'
  | 'PERIPHERALS'
  | 'ACCESSORIES'
  | 'OTHER_SYSTEMS';
  export type SubCategory = {
    GAMING_PCS: 'PREBUILT' | 'CUSTOM' | 'REFURBISHED';
    GPUS: 'NVIDIA' | 'AMD' | 'WORKSTATION';
    CPUS: 'INTEL' | 'AMD' | 'SERVER';
    COMPONENTS: 'MOTHERBOARD' | 'MEMORY' | 'STORAGE' | 'PSU' | 'CASE' | 'COOLING';
    PERIPHERALS: 'MONITOR' | 'KEYBOARD' | 'MOUSE' | 'HEADSET' | 'SPEAKERS';
    ACCESSORIES: 'CABLES' | 'TOOLS' | 'THERMAL_PASTE' | 'FANS';
    OTHER_SYSTEMS: 'WORKSTATION' | 'SERVER' | 'MINI_PC';
  };

  export type ProductStatus = 'ACTIVE' | 'SOLD' | 'RESERVED';

  export interface CreateProductDTO {
    title: string;
    description?: string;
    price: number;
    condition: string;
    category: string;
    subcategory?: string;
    images: string[];
    specs?: Record<string, any>;
    quantity: number;  // Added this field
  }
  
  
  export interface UpdateProductDTO {
    title?: string;
    description?: string;
    price?: number;
    condition?: string;
    category?: string;
    subcategory?: string;
    images?: string[];
    specs?: Record<string, string>;
    status?: 'ACTIVE' | 'SOLD' | 'RESERVED';
    quantity?: number;
  }

  export type ProductCondition = 'NEW' | 'LIKE_NEW' | 'USED';

  