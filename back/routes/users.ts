import { Router } from "https://deno.land/x/oak/mod.ts";
import { UserModel } from "../models/user.ts";
import usersCollection from "../db/mongodb.ts";
const userRouter = new Router();

userRouter.post("/users", async (ctx) => {
  
try {
    const body = await ctx.request.body.json();

    const { username, password, age, height, weight, gender } = body;

    // Validación básica
    if (!username || !password || !age || !height || !weight || !gender) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Faltan campos obligatorios" };
      return;
    }

    // Crear objeto de usuario
    const newUser: UserModel = {
      username,
      password,
      age,
      height,
      weight,
      gender,
      created_at: new Date(),
    };

    // Insertar en MongoDB
    const insertId = await usersCollection.insertOne(newUser);

    ctx.response.status = 201;
    ctx.response.body = { id: insertId };
  } catch (error) {
    console.error("Error al crear usuario:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Error interno del servidor" };
  }

});

export default userRouter;
