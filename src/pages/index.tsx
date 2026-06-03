
import { useState } from "react"
import Head from "next/head"
import { Analytics } from "@vercel/analytics/react"

export default function Home() {
  const [url, setUrl] = useState<string>("")
  const [status, setStatus] = useState<"done" | "error" | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)

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

      // Store blob in state without triggering download yet
      const blob = await res.blob()
      setVideoBlob(blob)
      setStatus("done")
    } catch (e: unknown) {
      console.error("Download error:", e)
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  function handleSaveToDevice(): void {
    if (!videoBlob) return

    const timestamp = Date.now()
    const blobUrl = URL.createObjectURL(videoBlob)
    const a = document.createElement("a")
    a.href = blobUrl
    a.download = `tiktokdownload-${timestamp}.mp4`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    // Cleanup
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
  }

  return (
    <>
      <Head>
        <title>TikTok Video Downloader</title>
        <meta name="description" content="Download TikTok Videos" />
        <link rel="icon" href="/greendownload48.png" /> 
      </Head>
      <div className="min-h-screen bg-black">
        <div className="mx-auto flex max-w-md flex-col items-center justify-center min-h-screen px-6 py-10">
          <h1 className="mb-2 text-4xl font-black text-white">TikTok</h1>
          <p className="mb-8 text-sm text-gray-400">Video Downloader</p>
          
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="Paste TikTok URL"
            className="mb-6 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none"
          />
          
          <button
            onClick={handleDownload}
            disabled={loading || !url}
            className="mb-3 w-full rounded-lg bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700 disabled:bg-gray-700 transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Downloading
              </span>
            ) : (
              status === "done" && videoBlob ? "Download Another Video" : "Download Video"
            )}
          </button>
          
          {videoBlob && (
            <button
              onClick={handleSaveToDevice}
              className="w-full rounded-lg bg-green-600 px-4 py-3 font-bold text-white hover:bg-green-500 transition-colors"
            >
              Save to Device
            </button>
          )}
          
          {status === "done" && videoBlob && (
            <p className="mt-6 text-center text-green-500 font-semibold">✅ Ready to save!</p>
          )}
          {status === "error" && (
            <p className="mt-6 text-center text-red-500 font-semibold">❌ Something went wrong</p>
          )}
        </div>
      </div>
      <Analytics/>
    </>
  )

}
