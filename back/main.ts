import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import "https://deno.land/std@0.224.0/dotenv/load.ts";
import userRouter from "./routes/users.ts";

const router = new Router();

const x_app_id = Deno.env.get("NUTRITIONIX_APP_ID")
if(!x_app_id){
  throw new Error("NUTRITIONIX_APP_ID not found")
}

const x_app_key = Deno.env.get("NUTRITIONIX_APP_KEY")
if(!x_app_key){
  throw new Error("NUTRITIONIX_APP_KEY not found")
}

router.get("/", (ctx) => {
  ctx.response.body = "Nydia";
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

const port = 8000

console.log(`🚀 Nydia ejecutándose en: http://localhost:${port}`);
await app.listen({ port: port });
