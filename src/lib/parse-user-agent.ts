// ============================================================
//  Parse user agent string to get browser + OS info
// ============================================================
export interface DeviceInfo {
  browser: string;
  os: string;
  type: "desktop" | "mobile" | "tablet" | "unknown";
}

export function parseUserAgent(userAgent: string | null | undefined): DeviceInfo {
  if (!userAgent) {
    return { browser: "Unknown browser", os: "Unknown OS", type: "unknown" };
  }

  const ua = userAgent.toLowerCase();

  // ─── OS Detection ───
  let os = "Unknown OS";
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("mac os x") || ua.includes("macintosh")) os = "macOS";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("iphone") || ua.includes("ipad")) os = "iOS";
  else if (ua.includes("linux")) os = "Linux";
  else if (ua.includes("cros")) os = "ChromeOS";

  // ─── Browser Detection ───
  let browser = "Unknown browser";
  if (ua.includes("edg/")) browser = "Edge";
  else if (ua.includes("chrome/") && !ua.includes("edg/")) browser = "Chrome";
  else if (ua.includes("firefox/")) browser = "Firefox";
  else if (ua.includes("safari/") && !ua.includes("chrome/")) browser = "Safari";
  else if (ua.includes("opera/") || ua.includes("opr/")) browser = "Opera";

  // ─── Device Type ───
  let type: DeviceInfo["type"] = "desktop";
  if (ua.includes("mobile") || ua.includes("iphone") || ua.includes("android")) {
    type = "mobile";
  }
  if (ua.includes("ipad") || ua.includes("tablet")) {
    type = "tablet";
  }

  return { browser, os, type };
}