// api/download.js

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Falta el parámetro URL" });
  }

  try {
    // 🔗 Nueva API pública funcional (RapidAPI)
    const response = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`);

    if (!response.ok) {
      return res.status(500).json({ error: "Error al conectar con la API externa" });
    }

    const data = await response.json();

    if (data && data.data && data.data.play) {
      return res.status(200).json({
        video: data.data.play, // enlace de descarga sin marca de agua
      });
    } else {
      return res.status(400).json({ error: "No se pudo obtener el video" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
