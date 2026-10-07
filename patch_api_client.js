const fs = require('fs');
const file = 'src/lib/api-client.ts';
let content = fs.readFileSync(file, 'utf8');

const replacement = `  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined;

    // Do not attempt to refresh token if the 401 came from a login/2FA endpoint
    // where 401 typically means "Invalid Code" or "Invalid Password" rather than "Expired JWT"
    const isAuthEndpoint = originalRequest?.url && (
      originalRequest.url.includes('/auth/login') ||
      originalRequest.url.includes('/auth/2fa/enable') ||
      originalRequest.url.includes('/auth/2fa/disable') ||
      originalRequest.url.includes('/auth/2fa/verify') ||
      originalRequest.url.includes('/auth/refresh')
    );

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {`;

content = content.replace(
  `  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {`,
  replacement
);

fs.writeFileSync(file, content, 'utf8');
console.log('Patched api-client.ts');
