/**
 * StepProgressBar Component
 * Horizontal step progress indicator with circles and connecting lines
 * Supports completed, active, and upcoming states
 */

import React from 'react'

export interface Step {
  label: string
  description?: string
}

interface StepProgressBarProps {
  steps: Step[]
  currentStep: number // 0-indexed
  className?: string
}

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
)

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  steps,
  currentStep,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Progress bar */}
      <div className="flex items-center justify-between w-full">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep
          const isActive = idx === currentStep
          const isUpcoming = idx > currentStep

          return (
            <React.Fragment key={idx}>
              {/* Step circle + label */}
              <div className="flex flex-col items-center relative z-10">
                {/* Circle */}
                <div
                  className={`
                    w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
                    transition-all duration-500 ease-out
                    ${isCompleted
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-100'
                      : isActive
                        ? 'bg-white dark:bg-gray-800 border-[3px] border-primary-500 text-primary-600 dark:text-primary-400 shadow-lg shadow-primary-500/20 scale-110'
                        : 'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                    }
                    font-bold text-sm
                  `}
                >
                  {isCompleted ? (
                    <CheckIcon />
                  ) : (
                    <span className={`text-sm sm:text-base font-semibold ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`}>
                      {idx + 1}
                    </span>
                  )}
                </div>

                {/* Label below circle */}
                <div className="mt-2 sm:mt-3 text-center">
                  <p
                    className={`text-xs sm:text-sm font-semibold transition-colors duration-300
                      ${isCompleted
                        ? 'text-primary-600 dark:text-primary-400'
                        : isActive
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-400 dark:text-gray-500'
                      }
                    `}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className={`text-[10px] sm:text-xs mt-0.5 hidden sm:block
                      ${isCompleted || isActive
                        ? 'text-gray-500 dark:text-gray-400'
                        : 'text-gray-300 dark:text-gray-600'
                      }
                    `}>
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connecting line (not after last step) */}
              {idx < steps.length - 1 && (
                <div className="flex-1 mx-2 sm:mx-4 mb-8 sm:mb-10">
                  <div className="h-[3px] rounded-full bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                    <div
                      className={`
                        absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out
                        ${idx < currentStep
                          ? 'w-full bg-primary-500'
                          : 'w-0 bg-primary-500'
                        }
                      `}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default StepProgressBar
