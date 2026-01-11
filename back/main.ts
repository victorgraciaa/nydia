
import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import registerRouter from "./routes/register.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import loginRouter from "./routes/login.ts";
import recommendationRouter from "./routes/recommendations.ts";

const distRoot = new URL("../front/dist", import.meta.url).pathname;

const app = new Application();

app.use(oakCors({
  origin: "*",
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "OPTIONS"],
}));

const router = new Router();
router.get("/", (ctx) => {
  ctx.response.body = "Nydia";
});

app.use(router.routes());
app.use(router.allowedMethods());

app.use(registerRouter.routes());
app.use(registerRouter.allowedMethods());
app.use(loginRouter.routes());
app.use(loginRouter.allowedMethods());
app.use(recommendationRouter.routes());
app.use(recommendationRouter.allowedMethods());

app.use(async (ctx, next) => {
  try {
    await send(ctx, ctx.request.url.pathname, { root: distRoot });
  } catch {
    await next();
  }
});

app.use(async (ctx) => {
  if (ctx.request.method === "GET" &&
      ctx.request.headers.get("accept")?.includes("text/html")) {
    await send(ctx, "index.html", { root: distRoot });
    return;
  }
  ctx.response.status = 404;
});

const ctx = {
  waitUntil: (_p: Promise<any>) => {},
  passThroughOnException: () => {},
};

Deno.serve((req) => app.fetch(req, {}, ctx));
