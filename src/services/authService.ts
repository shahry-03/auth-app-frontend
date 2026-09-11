"use server";

import { LoginRequest, TokenResponse, UserDto } from "@/types";
import { fetchApi } from "./api";
import { clearTokens, setTokens } from "@/app/actions/auth";

export async function login(credentials: LoginRequest): Promise<TokenResponse> {
  const tokens = await fetchApi<TokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
    requireAuth: false,
  });
  
  await setTokens(tokens);
  return tokens;
}

export async function registerUser(userDto: UserDto): Promise<UserDto> {
  return fetchApi<UserDto>("/auth/register", {
    method: "POST",
    body: JSON.stringify(userDto),
    requireAuth: false,
  });
}

export async function logout(): Promise<void> {
  try {
    await fetchApi<void>("/auth/logout", {
      method: "POST",
      requireAuth: true,
    });
  } catch (error) {
    console.error("Logout API failed, but clearing tokens anyway.");
  } finally {
    await clearTokens();
  }
}

export async function getCurrentUser(email: string): Promise<UserDto> {
  return fetchApi<UserDto>(`/users/email/${email}`, {
    method: "GET",
    requireAuth: true,
  });
}

export async function getUserById(userId: string): Promise<UserDto> {
  return fetchApi<UserDto>(`/users/${userId}`, {
    method: "GET",
    requireAuth: true,
  });
}

export async function updateUser(userId: string, data: UserDto): Promise<UserDto> {
  return fetchApi<UserDto>(`/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(data),
    requireAuth: true,
  });
}
