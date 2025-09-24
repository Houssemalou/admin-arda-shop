export interface ProductDTO {
  id: number;
  name: string;
  description: string;
  photoPath: string;
  category: string;
  price: number;
  originalPrice: number;
  stock: number;
  status: string;
  discount?: number; 
  promo: boolean;
}


export interface CategoryReqDTO {
  id?: number; 
  name: string;
  description: string;
}

export interface CategoryResDTO {
  id: number;
  name: string;
  description: string;
  products: ProductDTO[];
}

export interface CustomerInfo {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface OrderDTO {
  orderId: string;
  status: string;
  date: string;
  time: string;
  
  customerInfo: CustomerInfo;
  items: OrderProduct[];
  total: string;
}

export interface CategoryDiscountRequest {
  categoryName: string;
  discount: number;
}

export interface DiscountRequest {
  discount: number;
}

export interface StatusRequest {
  status: string;
}


export interface OrderProduct {
     productName: string,
    quantity: number,
    price: number
}
export interface RegistrationRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface AuthenticationRequest {
  email: string;
  password: string;
}
export interface AuthenticationResponse {
  token: string;
}