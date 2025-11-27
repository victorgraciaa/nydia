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

    const { mensaje_usuario, perfil_usuario, first_Prompt, historial } = await ctx.request.body.json() as {
      mensaje_usuario: string;
      perfil_usuario: {
        edad: number;
        peso: number;
        altura: number;
        genero: string;
        nivel_actividad: string;
      };
      first_Prompt: boolean;
      historial: MensajeHistorial[];
    };

    
    const context = historial
      .filter((m: MensajeHistorial) => m.role === "user")
      .map((m: MensajeHistorial) => `    Usuario: ${m.content}`)
      .join("\n");


    let prompt = ""
    
    if (first_Prompt) {
      prompt = `
    Actúa como un nutricionista profesional y experto en salud y bienestar.
    Datos del usuario:
    Edad ${perfil_usuario.edad}, Peso ${perfil_usuario.peso}, Altura ${perfil_usuario.altura}, Género ${perfil_usuario.genero}, Actividad ${perfil_usuario.nivel_actividad}
    Responde de forma clara y concisa, usando bullet points cuando sea necesario.
    Sigue estas instrucciones durante toda la conversación.
    Mensaje del usuario: ${mensaje_usuario}`;
    } else {
      prompt = `
    Actúa como un nutricionista profesional y experto en salud y bienestar.
    Datos del usuario:
    Edad ${perfil_usuario.edad}, Peso ${perfil_usuario.peso}, Altura ${perfil_usuario.altura}, Género ${perfil_usuario.genero}, Actividad ${perfil_usuario.nivel_actividad}
    Responde de forma clara y concisa, usando bullet points cuando sea necesario.
    Sigue estas instrucciones durante toda la conversación.
    Historial previo de mensajes del usuario:
    ${context}
    Nuevo mensaje: ${mensaje_usuario}
    `;
    }

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

    ctx.response.status = 200;
    
    const recomendacion = hfData.choices?.[0]?.message?.content || "Sin respuesta de la IA.";
    
    ctx.response.body = {
      recomendacion_ia: recomendacion,
    };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { error: "Error en la recomendación" };
  }
});

export default recommendationRouter;