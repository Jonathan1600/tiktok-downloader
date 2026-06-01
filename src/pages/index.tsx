
import { useState } from "react"

export default function Home() {
  const [url, setUrl] = useState<string>("")
  const [status, setStatus] = useState<"done" | "error" | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  async function handleDownload(): Promise<void> {
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch("https://tkd-be.onrender.com/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      if (!res.ok) throw new Error("Download failed")

      // Trigger browser download
      const blob = await res.blob()
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = "tiktok.mp4"
      a.click()
      URL.revokeObjectURL(a.href)
      setStatus("done")
    } catch (e: unknown) {
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  return (

    <div style={{ padding: 40, maxWidth: 500, margin: "0 auto" }}>
      <h1>TikTok Downloader</h1>
      <input
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="Paste TikTok URL"
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />
      <button onClick={handleDownload} disabled={loading || !url}>
        {loading ? "Downloading..." : "Download"}
      </button>
      {status === "done" && <p>✅ Done!</p>}
      {status === "error" && <p>❌ Something went wrong</p>}
    </div>
  )
}
