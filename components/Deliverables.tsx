import { CheckCircle } from 'lucide-react'

export function Deliverables() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary-blue">What You&apos;ll Receive</h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-accent-blue bg-opacity-10 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-primary-blue">Technical Analysis</h3>
            <ul className="space-y-2">
              {['Comprehensive Policy Review', 'Risk Assessment', 'Action Items', 'Performance Metrics'].map((item, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  <span className="text-text">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-accent-blue bg-opacity-10 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-primary-blue">Client Summary</h3>
            <ul className="space-y-2">
              {['Professional Formatting', 'Clear Explanations', 'Key Findings', 'Next Steps'].map((item, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  <span className="text-text">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

