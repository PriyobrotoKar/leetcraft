import React from 'react';

interface StatsProps {
  data: {
    problems: {
      solved: number;
      total: number;
    };
    easy: {
      solved: number;
      total: number;
    };
    medium: {
      solved: number;
      total: number;
    };
    hard: {
      solved: number;
      total: number;
    };
  };
}

function Stats({ data }: StatsProps) {
  return (
    <div className="text-md flex items-center justify-between">
      <div>
        <span className="text-muted-foreground">Total Question Attempt:</span>{' '}
        {data.problems.solved}/{data.problems.total}
      </div>

      <div className="text-md flex gap-2">
        <div className="bg-card space-x-2 rounded-md border p-2">
          <span className="text-green-500">Easy</span>
          <span>
            {data.easy.solved}/{data.easy.total}
          </span>
        </div>
        <div className="bg-card space-x-2 rounded-md border p-2">
          <span className="text-yellow-500">Medium</span>
          <span>
            {data.medium.solved}/{data.medium.total}
          </span>
        </div>
        <div className="bg-card space-x-2 rounded-md border p-2">
          <span className="text-destructive">Hard</span>
          <span>
            {data.hard.solved}/{data.hard.total}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Stats;
