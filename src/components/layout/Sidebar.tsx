import React from 'react'
import type { AppStep, AppState } from '../../types'

interface SidebarProps {
  state: AppState
  onStepChange: (step: AppStep) => void
  children: React.ReactNode
}

const STEPS: { key: AppStep; label: string; number: number }[] = [
  { key: 'UPLOAD', label: 'Upload Data', number: 1 },
  { key: 'MAP_TYPE', label: 'Map Type', number: 2 },
  { key: 'COLUMN_MAP', label: 'Map Columns', number: 3 },
  { key: 'STYLE', label: 'Style', number: 4 },
  { key: 'EXPORT', label: 'Export', number: 5 },
]

const Sidebar: React.FC<SidebarProps> = ({ state, onStepChange, children }) => {
  const currentIndex = STEPS.findIndex((s) => s.key === state.currentStep)

  return (
    <aside className="w-80 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden">
      {/* Step progress */}
      <div className="px-4 py-4 border-b border-slate-100">
        <div className="flex items-center gap-1">
          {STEPS.map((step, i) => {
            const isCompleted = state.completedSteps.has(step.key)
            const isCurrent = state.currentStep === step.key
            const isReachable = i <= currentIndex || isCompleted

            return (
              <React.Fragment key={step.key}>
                <button
                  data-testid="step-indicator"
                  onClick={() => isReachable && onStepChange(step.key)}
                  disabled={!isReachable}
                  title={step.label}
                  className={[
                    'w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors',
                    isCurrent
                      ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                      : isCompleted
                        ? 'bg-blue-100 text-blue-700 cursor-pointer hover:bg-blue-200'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed',
                  ].join(' ')}
                >
                  {isCompleted && !isCurrent ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 ${isCompleted ? 'bg-blue-200' : 'bg-slate-100'}`}
                  />
                )}
              </React.Fragment>
            )
          })}
        </div>
        <div className="mt-2 text-xs text-slate-500">
          Step {currentIndex + 1} of {STEPS.length}:{' '}
          <span className="font-medium text-slate-700">
            {STEPS[currentIndex]?.label}
          </span>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto p-4">{children}</div>
    </aside>
  )
}

export default Sidebar
