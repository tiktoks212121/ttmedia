import fetch from "node-fetch";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    res.status(400).json({ error: "Falta el parámetro 'url'" });
    return;
  }

  try {
    const response = await fetch(`https://api.tiklydown.me/api/download?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "No se pudo conectar con la API externa" });
  }
}
