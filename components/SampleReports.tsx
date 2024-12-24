import Image from 'next/image'
import { CheckCircle } from 'lucide-react'

export function SampleReports() {
  const reports = [
    {
      title: 'Life Insurance Policy Review Analysis',
      image: '/placeholder.svg?height=200&width=300',
      features: [
        'Comprehensive Policy Review',
        'Risk Assessment',
        'Action Items',
        'Performance Metrics'
      ],
    },
    {
      title: 'Life Insurance Policy Review Summary',
      image: '/placeholder.svg?height=200&width=300',
      features: [
        'Professional Formatting',
        'Clear Explanations',
        'Key Findings',
        'Next Steps'
      ],
    },
  ]

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          What You&apos;ll Receive
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {reports.map((report, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <Image 
                src={report.image} 
                alt={report.title} 
                width={300} 
                height={200} 
                className="w-full" 
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {report.title}
                </h3>
                <ul className="space-y-2">
                  {report.features.map((feature, fIndex) => (
                    <li 
                      key={fIndex} 
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="text-green-500" size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
