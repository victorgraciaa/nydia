import { Router } from "https://deno.land/x/oak/mod.ts";
import { nutritionixRequest } from "../utils/nutritionix.ts";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

await load({ envPath: "../../.env" });

const recommendationRouter = new Router();

recommendationRouter.post("/recommendations", async (ctx) => {
  try {
    const { mensaje_usuario, perfil_usuario } = await ctx.request.body.json();

    const prompt = `
    ${mensaje_usuario}
    Mis datos son los siguientes:\n
    Edad ${perfil_usuario.edad}, Peso ${perfil_usuario.peso}, Altura ${perfil_usuario.altura}, Género ${perfil_usuario.genero}, Actividad ${perfil_usuario.nivel_actividad}\n
    Responde forma concisa y clara, utilizando bullet points en los casos que sea necesario, como listas de alimentos.
    `;

    console.log("Prompt enviado a Hugging Face:", prompt);

    
    const hfRes = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("HF_API_KEY")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        model: "zai-org/GLM-4.6:novita"
      })
    });

    
    const hfData = await hfRes.json();

    const alimentos = await nutritionixRequest(perfil_usuario);

    ctx.response.status = 200;

    console.log("Respuesta de Hugging Face:", hfData);
    
    const recomendacion = hfData.choices?.[0]?.message?.content || "Sin respuesta de la IA.";
    
    ctx.response.body = {
      recomendacion_ia: recomendacion,
      alimentos_recomendados: alimentos,
    };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { error: "Error en la recomendación" };
  }
});

export default recommendationRouter;