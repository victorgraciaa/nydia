import { Router } from "https://deno.land/x/oak/mod.ts";
import { Configuration, OpenAIApi } from "npm:openai";
import { nutritionixRequest } from "../utils/nutritionix.ts"; // función que harás para Nutritionix

const recommendationRouter = new Router();

recommendationRouter.post("/recommend", async (ctx) => {
  try {
    const { mensaje_usuario, perfil_usuario } = await ctx.request.body.json();

    // 1. Llama a OpenAI con el mensaje y el perfil
    const openai = new OpenAIApi(new Configuration({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    }));

    const prompt = `
      Usuario: ${mensaje_usuario}
      Perfil: Edad ${perfil_usuario.edad}, Peso ${perfil_usuario.peso}, Altura ${perfil_usuario.altura}, Género ${perfil_usuario.genero}, Actividad ${perfil_usuario.nivel_actividad}
      Da una recomendación personalizada de nutrición y deporte.
    `;

    const aiResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });

    // 2. (Opcional) Llama a Nutritionix si quieres recomendar alimentos concretos
    const alimentos = await nutritionixRequest(perfil_usuario);

    ctx.response.status = 200;
    ctx.response.body = {
      recomendacion_ia: aiResponse.data.choices[0].message.content,
      alimentos_recomendados: alimentos,
    };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { error: "Error en la recomendación" };
  }
});

export default recommendationRouter;