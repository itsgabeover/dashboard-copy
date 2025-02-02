"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

const PDFViewer = () => {
  const searchParams = useSearchParams()
  const pdfUrl = searchParams?.get("pdfUrl") || null

  return (
    <div className="pdf-container h-screen">
      {pdfUrl ? (
        <iframe src={pdfUrl} width="100%" height="100%" style={{ border: "none" }} title="PDF Viewer" />
      ) : (
        <p className="text-center py-4">No PDF URL provided</p>
      )}
    </div>
  )
}

const ViewPDF = () => {
  return (
    <Suspense fallback={<div className="text-center py-4">Loading PDF viewer...</div>}>
      <PDFViewer />
    </Suspense>
  )
}

export default ViewPDF

