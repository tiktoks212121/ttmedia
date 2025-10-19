// api/download.js
// Vercel serverless function (Node 18+) para descargar TikTok y Facebook (videos + historias públicas)
// Retorna JSON: { video: "https://..." } o { error: "mensaje" }

export default async function handler(req, res) {
  try {
    const { url } = req.query;
    if (!url) {
      res.status(400).json({ error: "Falta el parámetro 'url'" });
      return;
    }

    let parsed;
    try { parsed = new URL(url); } catch (e) {
      res.status(400).json({ error: "URL inválida" });
      return;
    }

    const host = parsed.hostname.toLowerCase();

    const fetchWithTimeout = async (input, init = {}, timeout = 20000) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      try {
        const r = await fetch(input, { signal: controller.signal, ...init });
        clearTimeout(id);
        return r;
      } catch (err) {
        clearTimeout(id);
        throw err;
      }
    };

    // ---------------- Facebook (videos + historias públicas) ----------------
    if (host.includes("facebook.com") || host.includes("fb.watch") || host.includes("m.facebook.com")) {
      try {
        const apiUrl = `https://mp3downy.com/facebook-video-downloader-API?url=${encodeURIComponent(url)}`;
        const r = await fetchWithTimeout(apiUrl, { method: "GET", headers: { Accept: "application/json" } });
        const text = await r.text();

        let json;
        try { json = JSON.parse(text); } catch (e) { json = null; }

        if (json && (json.status === "success" || json.data)) {
          const src = json.data?.src;
          const videoUrl = src?.hd || src?.sd || src?.url || json.data?.url || json.url || null;
          if (videoUrl) {
            return res.status(200).json({ video: videoUrl });
          } else {
            const match = text.match(/https?:\/\/[^\s"']+\.mp4[^\s"']*/i);
            if (match) return res.status(200).json({ video: match[0] });
          }
        } else {
          const match = text.match(/https?:\/\/[^\s"']+\.mp4[^\s"']*/i);
          if (match) return res.status(200).json({ video: match[0] });
        }

        return res.status(502).json({
          error: "No se pudo extraer el video de Facebook. Solo enlaces públicos/historia pública son compatibles.",
        });
      } catch (err) {
        console.error("FB extractor error:", err?.message || err);
        return res.status(502).json({
          error: "Error al consultar el servicio público para Facebook.",
        });
      }
    }

    // ---------------- TikTok ----------------
    if (host.includes("tiktok.com") || host.includes("vm.tiktok.com") || host.includes("v.douyin.com")) {
      try {
        const api = "https://api2.musicaldown.com/api/v2/download";
        const r = await fetchWithTimeout(api, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ url }),
        });
        const j = await r.json();
        const videoUrl = j?.video?.url || j?.url || j?.download || null;
        if (videoUrl) return res.status(200).json({ video: videoUrl });

        const text = JSON.stringify(j || "");
        const match = text.match(/https?:\/\/[^\s"']+\.mp4[^\s"']*/i);
        if (match) return res.status(200).json({ video: match[0] });

        return res.status(502).json({ error: "No se pudo extraer el video de TikTok (servicio gratuito)." });
      } catch (err) {
        console.error("TikTok extractor error:", err?.message || err);
        return res.status(502).json({ error: "Error al consultar el servicio público para TikTok." });
      }
    }

    // ---------------- Host no soportado ----------------
    return res.status(400).json({ error: "Host no soportado. Solo TikTok y Facebook (videos o historias públicas) son compatibles." });

  } catch (finalErr) {
    console.error("Unexpected error in /api/download:", finalErr?.message || finalErr);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
