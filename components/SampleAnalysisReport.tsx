import React from 'react'
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'

interface SampleAnalysisReportProps {
  reportUrl: string
  title: string
  items: string[]
}

export function SampleAnalysisReport({ reportUrl, title, items }: SampleAnalysisReportProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h5 className="text-xl font-medium mb-4">{title}</h5>
        <ul className="space-y-2 mb-6">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <Button 
          asChild
          className="w-full bg-[#4B6FEE] hover:bg-[#3B4FDE] text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2"
        >
          <a href={reportUrl} target="_blank" rel="noopener noreferrer" download>
            <Download className="w-4 h-4" />
            Download Sample Report
          </a>
        </Button>
      </div>
    </div>
  )
}

