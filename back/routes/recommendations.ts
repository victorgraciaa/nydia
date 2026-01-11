import { Router } from "https://deno.land/x/oak/mod.ts";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

await load({ envPath: "../../.env" });

type MensajeHistorial = {
      role: "user" | "assistant";
      content: string;
};

const recommendationRouter = new Router();

recommendationRouter.post("/recommendations", async (ctx) => {
  try {

    const { mensaje_usuario, perfil_usuario, historial } = await ctx.request.body.json() as {
      mensaje_usuario: string;
      perfil_usuario: {
        edad: number;
        peso: number;
        altura: number;
        genero: string;
        nivel_actividad: string;
      };
      historial: MensajeHistorial[];
    };
    
    const systemPrompt = `
      Actúa como asistente de orientación nutricional y actividad física basado en recomendaciones generales. Sigue estas reglas:
      - Responde de forma clara, concisa y motivadora.
      - Usa formato estructurado: **Recomendaciones nutricionales** / **Recomendaciones de actividad física**.
      - Si hay objetivo (pérdida de peso, ganancia muscular, mantenimiento), incluye calorías, macros y rutina adaptada.
      - No des diagnósticos médicos ni sustituyas la opinión de un profesional sanitario.
      - Si falta información, solicita aclaraciones.
      - Responde únicamente a cuestiones relativas a nutrición y actividad física.

      Datos del usuario:
      - Edad: ${perfil_usuario.edad}
      - Peso: ${perfil_usuario.peso}
      - Altura: ${perfil_usuario.altura}
      - Género: ${perfil_usuario.genero}
      - Nivel de actividad física: ${perfil_usuario.nivel_actividad}
    `;

    const userPrompt = `
      Mensaje del usuario:
      ${mensaje_usuario}
    `;

    const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get("OR_API_KEY")}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        messages: [ 
          {
            role: 'system',
            content: systemPrompt,
          },
          ...historial,
          {
            role: 'user',
            content: userPrompt,
          }
        ],
        temperature: 0.3,
        "provider": {
          "sort": "throughput",
          "zdr": true
        }
      }),
    });

    const orData = await orRes.json();  

    ctx.response.status = 200;
    
    const recomendacion = orData.choices?.[0]?.message?.content || "Sin respuesta de la IA.";
    
    ctx.response.body = {
      recomendacion_ia: recomendacion,
    };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { error: "Error en la recomendación" };
  }
});

export default recommendationRouter;