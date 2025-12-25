'use client';

import { CheckCircle, Clock, Database, Brain, Rocket, Code, Terminal } from 'lucide-react';

const categoryIcons = {
  'Logic': Brain,
  'Science': Database,
  'Coding': Code,
  'Research': Rocket,
  'System': Terminal,
};

export default function MissionCard({ mission, onComplete }) {
  const Icon = categoryIcons[mission.category] || Rocket;
  const isCompleted = mission.status === 'COMPLETED';

  return (
    <div className={`
      relative p-6 rounded-lg border transition-all duration-300
      ${isCompleted
        ? 'bg-primary/5 border-primary opacity-70'
        : 'bg-muted/40 border-border hover:border-primary/50'
      }
    `}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-md ${isCompleted ? 'bg-primary text-black' : 'bg-muted text-primary'}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-lg font-bold font-mono ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {mission.title}
            </h3>
            <span className="text-xs uppercase tracking-wider text-muted-foreground bg-muted/50 px-2 py-1 rounded">
              {mission.category}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-secondary font-mono">+{mission.xpReward} XP</span>
        </div>
      </div>

      <p className="text-sm text-foreground/80 mb-4 font-sans line-clamp-2">
        {mission.description}
      </p>

      {mission.tools && mission.tools.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {mission.tools.map((tool, idx) => (
            <span key={idx} className="text-xs text-secondary border border-secondary/30 px-2 py-0.5 rounded-full font-mono">
              {tool}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center text-xs text-muted-foreground font-mono space-x-4">
          {isCompleted ? (
            <span className="flex items-center text-primary"><CheckCircle className="w-3 h-3 mr-1" /> COMPLETED</span>
          ) : (
            <span className="flex items-center text-yellow-500"><Clock className="w-3 h-3 mr-1" /> IN PROGRESS</span>
          )}
        </div>

        {!isCompleted && (
          <button
            onClick={() => onComplete(mission.id)}
            className="px-4 py-2 bg-primary text-black text-xs font-bold font-mono rounded hover:bg-primary/80 transition-colors uppercase"
          >
            Mark Complete
          </button>
        )}
      </div>
    </div>
  );
}
