// app/view-pdf/page.tsx
"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

const ViewPDF = () => {
  const searchParams = useSearchParams();
  const pdfUrl = searchParams.get("pdfUrl");

  return (
    <div className="pdf-container">
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          width="100%"
          height="100%"
          style={{ border: "none" }}
        />
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
};

export default ViewPDF;
