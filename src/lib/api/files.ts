import { apiClient } from "@/lib/api-client";

interface UploadResponse {
  url: string;
  message: string;
}

export async function uploadFile(file: File, type: string = "profile"): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  // Note: Content-Type is handled automatically by the interceptor in apiClient
  // removing the default application/json so the browser can attach the multipart boundary
  const res = await apiClient.post<UploadResponse>("/files/upload", formData);
  return res.data.url;
}
