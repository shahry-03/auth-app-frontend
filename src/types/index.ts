export interface RoleDto {
  id?: string;
  role?: string;
}

export interface UserDto {
  id?: string;
  email?: string;
  name?: string;
  password?: string;
  image?: string;
  enable?: boolean;
  createdAt?: string;
  updatedAt?: string;
  provider?: "LOCAL" | "GOOGLE" | "FACEBOOK" | "GITHUB";
  roles?: RoleDto[];
}

export interface LoginRequest {
  email?: string;
  password?: string;
}

export interface RefreshTokenRequest {
  refreshToken?: string;
}

export interface TokenResponse {
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  userDto?: UserDto;
}
