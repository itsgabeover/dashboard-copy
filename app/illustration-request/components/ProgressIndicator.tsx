interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
}

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="flex justify-center items-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              i + 1 <= currentStep ? "bg-[#4B6FEE] text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            {i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div className={`w-16 h-1 ${i + 1 < currentStep ? "bg-[#4B6FEE]" : "bg-gray-200"}`}></div>
          )}
        </div>
      ))}
    </div>
  )
}

