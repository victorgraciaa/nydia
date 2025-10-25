export async function nutritionixRequest(perfil_usuario) {
  const res = await fetch("https://trackapi.nutritionix.com/v2/natural/nutrients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-app-id": Deno.env.get("NUTRITIONIX_APP_ID"),
      "x-app-key": Deno.env.get("NUTRITIONIX_APP_KEY"),
    },
    body: JSON.stringify({
      query: `desayuno saludable para ${perfil_usuario.edad} años, ${perfil_usuario.peso}kg, ${perfil_usuario.nivel_actividad}`,
    }),
  });
  const data = await res.json();
  return data.foods; // Devuelve los alimentos recomendados
}