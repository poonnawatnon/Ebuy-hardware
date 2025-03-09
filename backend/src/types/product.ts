export interface CreateProductDTO {
    title: string;
    description?: string;
    price: number;
    condition: string;
    category: string;
    images: string[];
    specs?: Record<string, any>;
  }
  
  export interface UpdateProductDTO extends Partial<CreateProductDTO> {
    status?: string;
  }
  
  export interface ProductResponse {
    id: string;
    title: string;
    description: string | null;
    price: number;
    condition: string;
    category: string;
    images: string[];
    specs: Record<string, any> | null;
    status: string;
    sellerId: string;
    createdAt: Date;
    updatedAt: Date;
    seller: {
      username: string;
      email: string;
    };
  }
  
  export interface ProductFilters {
    category?: string;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    search?: string;
  }