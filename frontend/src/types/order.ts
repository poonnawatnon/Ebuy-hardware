export interface Order {
    id: string;
    buyerId: string;
    sellerId: string;
    status: OrderStatus;
    totalAmount: number;
    shippingAddress: {
      fullName: string;
      address1: string;
      address2?: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    items: Array<OrderItem>;
    buyer: {
      username: string;
      email: string;
    };
    seller: {
      username: string;
      email: string;
    };
    createdAt: string;
    updatedAt: string;
  }
  
  export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  
  export interface OrderItem {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product: {
      title: string;
      images: string[];
    };
  }
  
  export interface UpdateOrderStatusDto {
    status: OrderStatus;
  }

  export interface UpdateStatusVariables {
    status: OrderStatus;
  }
  