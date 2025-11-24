import { Application, Router } from "https://deno.land/x/oak/mod.ts"
import "https://deno.land/std@0.224.0/dotenv/load.ts"
import registerRouter from "./routes/register.ts"
import { oakCors } from "https://deno.land/x/cors/mod.ts"
import loginRouter from "./routes/login.ts";
import recommendationRouter from "./routes/recommendations.ts";

const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = "Nydia";
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.use(registerRouter.routes());
app.use(registerRouter.allowedMethods());

app.use(loginRouter.routes());
app.use(loginRouter.allowedMethods());

app.use(recommendationRouter.routes());
app.use(recommendationRouter.allowedMethods());

app.use(oakCors({
  origin: "*",
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "OPTIONS"],
}));

const port = 8000

console.log(`🚀 Nydia ejecutándose en: http://localhost:${port}`);
await app.listen({ port: port });
