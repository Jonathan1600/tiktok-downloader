
import { useState } from "react"
import Head from "next/head"

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
    <>
      <Head>
        <title>Tiktok Downloader</title>
        <meta name="description" content="Download Tiktok Videos" />
        <link rel="icon" href="/greendownload48.png" /> 
      </Head>
      <div className="mx-auto max-w-md p-10">
        <h1 className="mb-6 text-2xl font-bold">TikTok Downloader</h1>
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Paste TikTok URL"
          className="mb-4 w-full rounded border border-gray-300 px-3 py-2"
        />
        <button
          onClick={handleDownload}
          disabled={loading || !url}
          className="w-full rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Downloading..." : "Download"}
        </button>
        {status === "done" && <p>✅ Done!</p>}
        {status === "error" && <p>❌ Something went wrong</p>}
      </div>
    </>
  )
}
