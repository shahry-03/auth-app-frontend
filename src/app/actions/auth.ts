"use server";

import { cookies } from "next/headers";
import { TokenResponse } from "@/types";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export async function setTokens(tokens: TokenResponse) {
  const cookieStore = await cookies();
  
  if (tokens.accessToken) {
    cookieStore.set(ACCESS_TOKEN_KEY, tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: tokens.expiresIn, // Use expiresIn from response if available, otherwise fallback
    });
  }

  if (tokens.refreshToken) {
    cookieStore.set(REFRESH_TOKEN_KEY, tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days fallback for refresh token
    });
  }

  if (tokens.userDto?.id) {
    cookieStore.set("userId", tokens.userDto.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, 
    });
  }
}

export async function clearTokens() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_KEY);
  cookieStore.delete(REFRESH_TOKEN_KEY);
  cookieStore.delete("userId");
}

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_KEY)?.value;
}

export async function getRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_KEY)?.value;
}

export async function getUserId() {
  const cookieStore = await cookies();
  return cookieStore.get("userId")?.value;
}
