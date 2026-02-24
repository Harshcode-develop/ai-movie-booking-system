// User related types
export interface User {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  age: number;
}

export interface Address {
  id: number;
  label: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  fullName: string;
}
