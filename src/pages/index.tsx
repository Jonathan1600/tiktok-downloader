
import { useState } from "react"
import Head from "next/head"

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
              Processing
            </span>
          ) : (
            "Process Video"
          )}
        </button>
        {videoBlob && (
          <button
            onClick={handleSaveToDevice}
            className="mt-2 w-full rounded bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600"
          >
            Download
          </button>
        )}
        {status === "done" && videoBlob && <p className="mt-4 text-center text-green-600">✅ Ready to save!</p>}
        {status === "error" && <p className="mt-4 text-center text-red-600">❌ Something went wrong</p>}
      </div>
    </>
  )
}
