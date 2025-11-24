import { Router } from "https://deno.land/x/oak/mod.ts";
import { UserModel } from "../models/userModel.ts";
import usersCollection from "../db/mongodb.ts";
import { hash } from "https://deno.land/x/bcrypt/mod.ts";

const registerRouter = new Router();

function isValidPassword(password: string): boolean {
  const regex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
  return regex.test(password);
}

registerRouter.post("/register", async (ctx) => {
  try {
    const body = await ctx.request.body.json();
    const { username, password, age, height, weight, gender, activity_level } = body;

    if (!username || !password || !age || !height || !weight || !gender || !activity_level) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Faltan campos obligatorios" };
      return;
    }

    if (!isValidPassword(password)) {
      ctx.response.status = 400;
      ctx.response.body = {
        error: "La contraseña debe tener mínimo 6 caracteres, al menos una letra mayúscula y un número",
      };
      return;
    }

    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      ctx.response.status = 409;
      ctx.response.body = { error: "El nombre de usuario ya existe" };
      return;
    }

    const parsedAge = Number(body.age);
    const parsedHeight = Number(body.height);
    const parsedWeight = Number(body.weight);

    if (isNaN(parsedAge) || parsedAge <= 0) {
      ctx.response.status = 400;
      ctx.response.body = { error: "La edad debe ser un número positivo" };
      return;
    }
    if (isNaN(parsedHeight) || parsedHeight <= 0 || isNaN(parsedWeight) || parsedWeight <= 0) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Altura y peso deben ser valores positivos" };
      return;
    }

    const hashedPassword = await hash(password);

    const newUser: UserModel = {
      username,
      password: hashedPassword,
      age,
      height,
      weight,
      gender,
      activity_level,
      created_at: new Date(),
    };

    const insertId = await usersCollection.insertOne(newUser);

    ctx.response.status = 201;
    ctx.response.body = { id: insertId };
  } catch (error) {
    console.error("Error al crear usuario:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Error interno del servidor" };
  }
});

export default registerRouter;