import { jwtVerify } from "jose"; // npm install jose

export interface AuthPayload {
  id: string;
  role: string;
  exp: number;
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

/**
 * Verifies a JWT in the Edge runtime. `jsonwebtoken` needs Node's `crypto`
 * module, which isn't available in Next.js middleware — `jose` is the
 * standard Edge-compatible replacement.
 *
 * IMPORTANT: JWT_SECRET must match the backend's exactly, and must be set
 * as a frontend env var too (not just NEXT_PUBLIC_ — middleware runs
 * server-side so a plain env var is fine and safer).
 */
export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as AuthPayload;
  } catch {
    return null;
  }
}