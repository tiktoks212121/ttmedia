export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Falta el parámetro 'url'" });
  }

  try {
    const response = await fetch(`https://api.tiklydown.me/api/download?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    if (data && data.video && data.video.noWatermark) {
      return res.status(200).json({ downloadUrl: data.video.noWatermark });
    } else {
      return res.status(404).json({ error: "No se pudo obtener el video sin marca de agua" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error al conectar con la API externa" });
  }
}
