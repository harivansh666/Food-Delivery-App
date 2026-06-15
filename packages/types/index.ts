export enum UserRole {
  CUSTOMER = "CUSTOMER",
  RESTAURANT_OWNER = "RESTAURANT_OWNER",
  DELIVERYMAN = "DELIVERYMAN",
  ADMIN = "ADMIN",
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
}
export interface HealthCheckResponse {
  status: string;
  timestamp: Date;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: Date;
}
