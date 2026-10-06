// ============================================================
//  API Endpoints Catalog — Universal Auth
//  Source: http://localhost:8080/v3/api-docs
//  Total: 41 endpoints across 5 groups
// ============================================================

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface EndpointParam {
  name: string;
  in: "path" | "query";
  required?: boolean;
  example?: string;
  description?: string;
}

export interface EndpointField {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  required?: boolean;
  example?: string | number | boolean;
  description?: string;
}

export interface ApiEndpoint {
  id: string;
  method: HttpMethod;
  path: string;
  summary: string;
  requiresAuth: boolean;
  requiresAdmin?: boolean;
  devOnly?: boolean;
  params?: EndpointParam[];
  body?: EndpointField[];
}

export interface EndpointGroup {
  key: string;
  label: string;
  description: string;
  icon: string;
  endpoints: ApiEndpoint[];
}

export const API_ENDPOINTS: EndpointGroup[] = [
  // ==========================================================
  //  🔐 AUTHENTICATION
  // ==========================================================
  {
    key: "auth",
    label: "Authentication",
    description: "Register, login, tokens, password recovery",
    icon: "🔐",
    endpoints: [
      {
        id: "auth-register",
        method: "POST",
        path: "/api/v1/auth/register",
        summary: "Register a new user account",
        requiresAuth: false,
        body: [
          { name: "name", type: "string", required: true, example: "John Doe" },
          { name: "email", type: "string", required: true, example: "john@example.com" },
          { name: "password", type: "string", required: true, example: "StrongP@ss123" },
        ],
      },
      {
        id: "auth-login",
        method: "POST",
        path: "/api/v1/auth/login",
        summary: "Login with email and password",
        requiresAuth: false,
        body: [
          { name: "email", type: "string", required: true, example: "john@example.com" },
          { name: "password", type: "string", required: true, example: "StrongP@ss123" },
        ],
      },
      {
        id: "auth-logout",
        method: "POST",
        path: "/api/v1/auth/logout",
        summary: "Logout and revoke refresh token",
        requiresAuth: true,
      },
      {
        id: "auth-refresh",
        method: "POST",
        path: "/api/v1/auth/refresh",
        summary: "Refresh access token using refresh cookie",
        requiresAuth: false,
      },
      {
        id: "auth-forgot-password",
        method: "POST",
        path: "/api/v1/auth/forgot-password",
        summary: "Request a password reset email",
        requiresAuth: false,
        body: [
          { name: "email", type: "string", required: true, example: "john@example.com" },
        ],
      },
      {
        id: "auth-reset-password",
        method: "POST",
        path: "/api/v1/auth/reset-password",
        summary: "Reset password using token from email",
        requiresAuth: false,
        body: [
          { name: "token", type: "string", required: true, example: "abc123-reset-token" },
          { name: "newPassword", type: "string", required: true, example: "NewStrongP@ss456" },
        ],
      },
      {
        id: "auth-verify-email",
        method: "POST",
        path: "/api/v1/auth/verify-email",
        summary: "Verify email address using token",
        requiresAuth: false,
        body: [
          { name: "token", type: "string", required: true, example: "verify-token-here" },
        ],
      },
      {
        id: "auth-resend-verification",
        method: "POST",
        path: "/api/v1/auth/resend-verification",
        summary: "Resend email verification link",
        requiresAuth: false,
        body: [
          { name: "email", type: "string", required: true, example: "john@example.com" },
        ],
      },
    ],
  },

  // ==========================================================
  //  🔑 TWO-FACTOR AUTHENTICATION
  // ==========================================================
  {
    key: "2fa",
    label: "Two-Factor Auth",
    description: "TOTP setup, verification, and management",
    icon: "🔑",
    endpoints: [
      {
        id: "2fa-setup",
        method: "POST",
        path: "/api/v1/auth/2fa/setup",
        summary: "Generate TOTP secret and QR code",
        requiresAuth: true,
      },
      {
        id: "2fa-verify",
        method: "POST",
        path: "/api/v1/auth/2fa/verify",
        summary: "Verify TOTP code to complete setup",
        requiresAuth: true,
        body: [
          { name: "code", type: "string", required: true, example: "123456" },
        ],
      },
      {
        id: "2fa-enable",
        method: "POST",
        path: "/api/v1/auth/2fa/enable",
        summary: "Enable 2FA for the current user",
        requiresAuth: true,
      },
      {
        id: "2fa-disable",
        method: "POST",
        path: "/api/v1/auth/2fa/disable",
        summary: "Disable 2FA for the current user",
        requiresAuth: true,
        body: [
          { name: "code", type: "string", required: true, example: "123456" },
        ],
      },
      {
        id: "2fa-status",
        method: "GET",
        path: "/api/v1/auth/2fa/status",
        summary: "Check if 2FA is enabled",
        requiresAuth: true,
      },
    ],
  },

  // ==========================================================
  //  👤 USER PROFILE
  // ==========================================================
  {
    key: "users",
    label: "User Profile",
    description: "Current user profile and session management",
    icon: "👤",
    endpoints: [
      {
        id: "users-me-get",
        method: "GET",
        path: "/api/v1/users/me",
        summary: "Get current user profile",
        requiresAuth: true,
      },
      {
        id: "users-me-update",
        method: "PUT",
        path: "/api/v1/users/me",
        summary: "Update current user profile",
        requiresAuth: true,
        body: [
          { name: "name", type: "string", example: "John Updated" },
          { name: "image", type: "string", example: "https://example.com/avatar.png" },
        ],
      },
      {
        id: "users-change-password",
        method: "POST",
        path: "/api/v1/users/me/change-password",
        summary: "Change current user password",
        requiresAuth: true,
        body: [
          { name: "currentPassword", type: "string", required: true, example: "OldP@ss123" },
          { name: "newPassword", type: "string", required: true, example: "NewP@ss456" },
        ],
      },
      {
        id: "users-sessions-list",
        method: "GET",
        path: "/api/v1/users/me/sessions",
        summary: "List all active sessions",
        requiresAuth: true,
      },
      {
        id: "users-sessions-revoke-all",
        method: "DELETE",
        path: "/api/v1/users/me/sessions",
        summary: "Revoke all active sessions",
        requiresAuth: true,
      },
      {
        id: "users-session-revoke",
        method: "DELETE",
        path: "/api/v1/users/me/sessions/{sessionId}",
        summary: "Revoke a specific session",
        requiresAuth: true,
        params: [
          { name: "sessionId", in: "path", required: true, example: "1", description: "Session ID" },
        ],
      },
    ],
  },

  // ==========================================================
  //  🛡️ ADMIN
  // ==========================================================
  {
    key: "admin",
    label: "Admin",
    description: "User, role, and permission management (ADMIN role required)",
    icon: "🛡️",
    endpoints: [
      // ----- Users -----
      {
        id: "admin-users-list",
        method: "GET",
        path: "/api/v1/admin/users",
        summary: "List all users",
        requiresAuth: true,
        requiresAdmin: true,
      },
      {
        id: "admin-user-get",
        method: "GET",
        path: "/api/v1/admin/users/{userId}",
        summary: "Get user by ID",
        requiresAuth: true,
        requiresAdmin: true,
        params: [{ name: "userId", in: "path", required: true, example: "1" }],
      },
      {
        id: "admin-user-update",
        method: "PUT",
        path: "/api/v1/admin/users/{userId}",
        summary: "Update user details",
        requiresAuth: true,
        requiresAdmin: true,
        params: [{ name: "userId", in: "path", required: true, example: "1" }],
        body: [
          { name: "name", type: "string", example: "Updated Name" },
          { name: "email", type: "string", example: "updated@example.com" },
        ],
      },
      {
        id: "admin-user-delete",
        method: "DELETE",
        path: "/api/v1/admin/users/{userId}",
        summary: "Delete user",
        requiresAuth: true,
        requiresAdmin: true,
        params: [{ name: "userId", in: "path", required: true, example: "1" }],
      },
      {
        id: "admin-user-status",
        method: "PATCH",
        path: "/api/v1/admin/users/{userId}/status",
        summary: "Change user status (ACTIVE / SUSPENDED / LOCKED)",
        requiresAuth: true,
        requiresAdmin: true,
        params: [{ name: "userId", in: "path", required: true, example: "1" }],
        body: [
          { name: "status", type: "string", required: true, example: "ACTIVE" },
        ],
      },
      {
        id: "admin-user-unlock",
        method: "POST",
        path: "/api/v1/admin/users/{userId}/unlock",
        summary: "Unlock a locked user account",
        requiresAuth: true,
        requiresAdmin: true,
        params: [{ name: "userId", in: "path", required: true, example: "1" }],
      },

      // ----- Roles -----
      {
        id: "admin-roles-list",
        method: "GET",
        path: "/api/v1/admin/roles",
        summary: "List all roles",
        requiresAuth: true,
        requiresAdmin: true,
      },
      {
        id: "admin-role-create",
        method: "POST",
        path: "/api/v1/admin/roles",
        summary: "Create a new role",
        requiresAuth: true,
        requiresAdmin: true,
        body: [
          { name: "name", type: "string", required: true, example: "MODERATOR" },
          { name: "description", type: "string", example: "Content moderator role" },
        ],
      },
      {
        id: "admin-role-get",
        method: "GET",
        path: "/api/v1/admin/roles/{roleId}",
        summary: "Get role by ID",
        requiresAuth: true,
        requiresAdmin: true,
        params: [{ name: "roleId", in: "path", required: true, example: "1" }],
      },
      {
        id: "admin-role-update",
        method: "PUT",
        path: "/api/v1/admin/roles/{roleId}",
        summary: "Update role",
        requiresAuth: true,
        requiresAdmin: true,
        params: [{ name: "roleId", in: "path", required: true, example: "1" }],
        body: [
          { name: "name", type: "string", example: "SUPER_MODERATOR" },
          { name: "description", type: "string", example: "Elevated moderator" },
        ],
      },
      {
        id: "admin-role-delete",
        method: "DELETE",
        path: "/api/v1/admin/roles/{roleId}",
        summary: "Delete role",
        requiresAuth: true,
        requiresAdmin: true,
        params: [{ name: "roleId", in: "path", required: true, example: "1" }],
      },
      {
        id: "admin-user-roles",
        method: "GET",
        path: "/api/v1/admin/roles/users/{userId}",
        summary: "Get roles assigned to a user",
        requiresAuth: true,
        requiresAdmin: true,
        params: [{ name: "userId", in: "path", required: true, example: "1" }],
      },
      {
        id: "admin-user-role-assign",
        method: "POST",
        path: "/api/v1/admin/roles/users/{userId}/assign/{roleId}",
        summary: "Assign a role to a user",
        requiresAuth: true,
        requiresAdmin: true,
        params: [
          { name: "userId", in: "path", required: true, example: "1" },
          { name: "roleId", in: "path", required: true, example: "2" },
        ],
      },
      {
        id: "admin-user-role-remove",
        method: "DELETE",
        path: "/api/v1/admin/roles/users/{userId}/remove/{roleId}",
        summary: "Remove a role from a user",
        requiresAuth: true,
        requiresAdmin: true,
        params: [
          { name: "userId", in: "path", required: true, example: "1" },
          { name: "roleId", in: "path", required: true, example: "2" },
        ],
      },

      // ----- Permissions -----
      {
        id: "admin-permissions-list",
        method: "GET",
        path: "/api/v1/admin/permissions",
        summary: "List all permissions",
        requiresAuth: true,
        requiresAdmin: true,
      },
      {
        id: "admin-permission-create",
        method: "POST",
        path: "/api/v1/admin/permissions",
        summary: "Create a new permission",
        requiresAuth: true,
        requiresAdmin: true,
        body: [
          { name: "name", type: "string", required: true, example: "USER_DELETE" },
          { name: "description", type: "string", example: "Can delete users" },
        ],
      },
      {
        id: "admin-permission-get",
        method: "GET",
        path: "/api/v1/admin/permissions/{permissionId}",
        summary: "Get permission by ID",
        requiresAuth: true,
        requiresAdmin: true,
        params: [{ name: "permissionId", in: "path", required: true, example: "1" }],
      },
      {
        id: "admin-permission-update",
        method: "PUT",
        path: "/api/v1/admin/permissions/{permissionId}",
        summary: "Update permission",
        requiresAuth: true,
        requiresAdmin: true,
        params: [{ name: "permissionId", in: "path", required: true, example: "1" }],
        body: [
          { name: "name", type: "string", example: "USER_DELETE_HARD" },
          { name: "description", type: "string", example: "Hard delete users" },
        ],
      },
      {
        id: "admin-permission-delete",
        method: "DELETE",
        path: "/api/v1/admin/permissions/{permissionId}",
        summary: "Delete permission",
        requiresAuth: true,
        requiresAdmin: true,
        params: [{ name: "permissionId", in: "path", required: true, example: "1" }],
      },
    ],
  },

  // ==========================================================
  //  🧪 DEV (Development only — disable in production)
  // ==========================================================
  {
    key: "dev",
    label: "Dev Tools",
    description: "Email preview endpoints — DEV environment only",
    icon: "🧪",
    endpoints: [
      {
        id: "dev-email-welcome",
        method: "GET",
        path: "/dev/email/welcome",
        summary: "Preview welcome email template",
        requiresAuth: false,
        devOnly: true,
      },
      {
        id: "dev-email-verification",
        method: "GET",
        path: "/dev/email/verification",
        summary: "Preview email verification template",
        requiresAuth: false,
        devOnly: true,
      },
      {
        id: "dev-email-reset",
        method: "GET",
        path: "/dev/email/reset",
        summary: "Preview password reset email template",
        requiresAuth: false,
        devOnly: true,
      },
    ],
  },
];

// ============================================================
//  Helpers
// ============================================================

export const ALL_ENDPOINTS: ApiEndpoint[] = API_ENDPOINTS.flatMap(
  (group) => group.endpoints
);

export const getEndpointById = (id: string): ApiEndpoint | undefined =>
  ALL_ENDPOINTS.find((e) => e.id === id);

export const getTotalEndpointCount = (): number => ALL_ENDPOINTS.length;

// Method colors for UI badges
export const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  POST: "bg-green-500/10 text-green-600 border-green-500/20",
  PUT: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  PATCH: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  DELETE: "bg-red-500/10 text-red-600 border-red-500/20",
};