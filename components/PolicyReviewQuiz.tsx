"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const PolicyReviewQuiz = () => {
  const [started, setStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const questions = [
    {
      question: "When was your last policy review?",
      answers: [
        { text: "Within the last year", score: 0 },
        { text: "1-3 years ago", score: 1 },
        { text: "Over 3 years ago", score: 2 },
        { text: "I can't remember", score: 3 },
      ],
    },
    {
      question: "Have your life circumstances changed recently?",
      answers: [
        { text: "No changes", score: 0 },
        { text: "Minor changes", score: 1 },
        { text: "Major life changes", score: 2 },
        { text: "Multiple changes", score: 3 },
      ],
    },
    {
      question: "Do you know all the benefits in your policy?",
      answers: [
        { text: "Yes, completely", score: 0 },
        { text: "Most of them", score: 1 },
        { text: "Some of them", score: 2 },
        { text: "Not really", score: 3 },
      ],
    },
  ]

  const handleAnswer = (score: number) => {
    setScore((prevScore) => prevScore + score)
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setShowResult(true)
    }
  }

  const getRecommendation = () => {
    if (score <= 2) {
      return "Your policy appears to be on track, but our AI review can uncover potential opportunities and confirm everything is working as intended."
    } else if (score <= 5) {
      return "Your policy may benefit from a checkup. A review would help ensure you are not missing out on valuable benefits or needed updates."
    } else {
      return "Your policy needs attention. Let us make sure it is properly aligned with your current needs and performing at its best."
    }
  }

  const resetQuiz = () => {
    setStarted(false)
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
  }

  if (!started) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#4B6FEE]">Not sure if you need a review?</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 text-gray-600">Take our 60-second assessment to find out if your policy needs attention</p>
          <Button
            onClick={() => setStarted(true)}
            className="bg-[#4B6FEE] hover:bg-blue-700 text-white px-6 py-2 rounded-full"
          >
            Start Quick Quiz →
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (showResult) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold text-[#4B6FEE]">Your Results</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 text-gray-700">{getRecommendation()}</p>
          <div className="space-y-4">
            <Button
              onClick={() => (window.location.href = "/upload")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full w-full"
            >
              Start My Analysis →
            </Button>
            <Button
              onClick={resetQuiz}
              variant="outline"
              className="text-[#4B6FEE] hover:text-blue-700 px-6 py-2 rounded-full w-full"
            >
              Retake Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold text-[#4B6FEE]">
          Question {currentQuestion + 1} of {questions.length}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg text-center mb-6 text-gray-700">{questions[currentQuestion].question}</p>
        <div className="space-y-3">
          {questions[currentQuestion].answers.map((answer, index) => (
            <Button
              key={index}
              onClick={() => handleAnswer(answer.score)}
              className="w-full text-left p-4 bg-white hover:bg-blue-50 border border-gray-200 rounded-lg text-gray-700"
              variant="outline"
            >
              {answer.text}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default PolicyReviewQuiz

