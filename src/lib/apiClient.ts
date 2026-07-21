import { API_BASE } from "./config";

export interface ApiError {
  message: string;
}

async function parseError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: ApiError };
    return body.error?.message ?? res.statusText;
  } catch {
    return res.statusText;
  }
}

export async function startDeviceFlow(): Promise<{ user_code: string; device_code: string }> {
  const res = await fetch(`${API_BASE}/auth/device/start`, { method: "POST" });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function approveDevice(userCode: string, credential: string): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/device/approve`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ user_code: userCode, credential }),
  });
  if (!res.ok) throw new Error(await parseError(res));
}

export async function createCheckout(
  accessToken: string,
  amountInr: number,
  phone: string,
): Promise<{ order_id: string; payment_session_id: string }> {
  const res = await fetch(`${API_BASE}/billing/checkout`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ amount_inr: amountInr, phone }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}
