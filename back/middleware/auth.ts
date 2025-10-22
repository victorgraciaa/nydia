import { verify } from "https://deno.land/x/djwt/mod.ts";
import { Context } from "https://deno.land/x/oak/mod.ts";

const key = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(Deno.env.get("JWT_SECRET")!),
  { name: "HMAC", hash: "SHA-256" },
  false,
  ["sign", "verify"]
);

export const authMiddleware = async (ctx: Context, next: () => Promise<unknown>) => {
  const authHeader = ctx.request.headers.get("Authorization");
  if (!authHeader) {
    ctx.response.status = 401;
    ctx.response.body = { error: "No autorizado" };
    return;
  }

  const token = authHeader.replace("Bearer ", "");
  try {
    const payload = await verify(token, key);
    ctx.state.user = payload;
    await next();
  } catch {
    ctx.response.status = 401;
    ctx.response.body = { error: "Token inválido o expirado" };
  }
};