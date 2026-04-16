// @ts-nocheck
'use client'

import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import type { QuickCheckBlock as QuickCheckBlockType } from '@/types/app'
import { cn } from '@/lib/utils/cn'

interface Props {
  block: QuickCheckBlockType
}

type AnswerState = 'unanswered' | 'correct' | 'wrong'

interface QuestionState {
  selected: string | null
  state: AnswerState
}

export default function QuickCheckBlock({ block }: Props) {
  const [questionStates, setQuestionStates] = useState<QuestionState[]>(
    block.data.questions.map(() => ({ selected: null, state: 'unanswered' }))
  )
  const { data } = block

  const handleAnswer = (qIndex: number, optionId: string) => {
    if (questionStates[qIndex].state !== 'unanswered') return

    const question = data.questions[qIndex]
    const correct = question.options.find(o => o.is_correct)
    const isCorrect = correct?.id === optionId

    setQuestionStates(prev => {
      const next = [...prev]
      next[qIndex] = {
        selected: optionId,
        state: isCorrect ? 'correct' : 'wrong',
      }
      return next
    })
  }

  return (
    <div className="rounded-lg overflow-hidden border border-[rgba(0,0,0,0.08)] shadow-card">
      <div className="flex items-center gap-2 px-5 py-3 bg-secondary border-b border-[rgba(0,0,0,0.06)]">
        <span className="text-lg">✅</span>
        <span className="font-semibold text-text-primary">Quick Check</span>
        <span className="ml-auto text-caption text-text-secondary">
          Không tính điểm — chỉ luyện tập
        </span>
      </div>

      <div className="bg-surface px-5 py-5 space-y-6">
        {data.questions.map((question, qIndex) => {
          const qState = questionStates[qIndex]
          const answered = qState.state !== 'unanswered'

          return (
            <div key={qIndex}>
              <p className="font-medium text-text-primary mb-3">
                {qIndex + 1}. {question.text}
              </p>

              <div className="space-y-2">
                {question.options.map((option) => {
                  const isSelected = qState.selected === option.id
                  const isCorrect = option.is_correct
                  const showResult = answered

                  let optClass = 'border-[rgba(0,0,0,0.1)] bg-secondary hover:bg-primary-light hover:border-primary cursor-pointer'
                  if (showResult) {
                    if (isCorrect) {
                      optClass = 'border-primary bg-primary-light cursor-default scale-[1.02]'
                    } else if (isSelected && !isCorrect) {
                      optClass = 'border-danger bg-red-50 cursor-default'
                    } else {
                      optClass = 'border-[rgba(0,0,0,0.06)] bg-secondary/50 cursor-default opacity-60'
                    }
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(qIndex, option.id)}
                      className={cn(
                        'w-full text-left flex items-center gap-3 px-4 py-3 rounded-md border transition-all text-body',
                        optClass
                      )}
                    >
                      <span className={cn(
                        'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 text-caption font-bold',
                        showResult && isCorrect
                          ? 'border-primary bg-primary text-white'
                          : showResult && isSelected && !isCorrect
                          ? 'border-danger bg-danger text-white'
                          : 'border-[rgba(0,0,0,0.2)]'
                      )}>
                        {showResult && isCorrect
                          ? '✓'
                          : showResult && isSelected && !isCorrect
                          ? '✗'
                          : option.id.toUpperCase()}
                      </span>
                      <span className="flex-1">{option.text}</span>
                      {showResult && isCorrect && (
                        <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-danger shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>

              {answered && (
                <div className="mt-3 p-4 rounded-md bg-secondary border-l-4 border-primary">
                  <div className="flex items-start gap-2">
                    {qState.state === 'correct'
                      ? <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      : <XCircle className="w-4 h-4 text-danger mt-0.5 shrink-0" />
                    }
                    <div>
                      <span className={cn(
                        'text-small font-semibold',
                        qState.state === 'correct' ? 'text-primary' : 'text-danger'
                      )}>
                        {qState.state === 'correct' ? 'Chinh xac! 🎉' : 'Chua dung'}
                      </span>
                      <p className="text-small text-text-secondary mt-1">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
