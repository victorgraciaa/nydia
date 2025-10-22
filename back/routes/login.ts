import { Router } from "https://deno.land/x/oak/mod.ts";
import usersCollection from "../db/mongodb.ts";
import { compare } from "https://deno.land/x/bcrypt/mod.ts";
import { create, getNumericDate } from "https://deno.land/x/djwt/mod.ts";



const loginRouter = new Router();

loginRouter.post("/login", async (ctx) => {

  try {
    const { username, password } = await ctx.request.body.json();

    if (!username || !password) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Nombre de usuario y contraseña son obligatorios" };
      return;
    }

    const user = await usersCollection.findOne({ username });
    if (!user) {
      ctx.response.status = 401;
      ctx.response.body = { error: "Usuario no encontrado" };
      return;
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      ctx.response.status = 401;
      ctx.response.body = { error: "Contraseña incorrecta" };
      return;
    }

    
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(Deno.env.get("JWT_SECRET")!), // tu clave secreta
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );


    const jwt = await create(
      { alg: "HS256", typ: "JWT" },
      {
        userId: user._id.toString(),
        exp: getNumericDate(60 * 60), 
      },
      key
    );

    ctx.response.status = 200;
    ctx.response.body = {
      token: jwt,
      user: {
        username: user.username,
        age: user.age,
        height: user.height,
        weight: user.weight,
        gender: user.gender,
        activity_level: user.activity_level,
      },
    };
  } catch (error) {
    console.error("Error en login:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Error interno del servidor" };
  }
});

export default loginRouter;