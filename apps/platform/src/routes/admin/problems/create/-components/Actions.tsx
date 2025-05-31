import { Button } from '@leetcraft/ui/components/button';
import { cn } from '@leetcraft/ui/lib/utils';
import { IconChevronRight } from '@tabler/icons-react';
import { useLocation } from '@tanstack/react-router';
import { Fragment } from 'react';

interface ActionsProps {
  isPending?: boolean;
  onSubmit: () => void;
}

function Actions({ onSubmit, isPending = false }: ActionsProps) {
  return (
    <div className="flex items-center justify-between">
      <Steps />
      <div className="flex items-center gap-4">
        <Button size={'sm'} variant={'tertiary'}>
          Load Sample
        </Button>
        <Button isLoading={isPending} size={'sm'} onClick={onSubmit}>
          Continue
        </Button>
      </div>
    </div>
  );
}

export default Actions;

const steps = [
  {
    label: 'Basic Info',
  },
  {
    label: 'Validate Problem',
    path: '/validate',
  },
  {
    label: 'Finish',
    path: '/complete',
  },
];

function Steps() {
  const pathname = useLocation().pathname;

  return (
    <div>
      <div className="flex items-center gap-2">
        {steps.map((step, index) => {
          const isActive = step.path && pathname.endsWith(step.path);

          return (
            <Fragment key={index}>
              <div className="flex items-center">
                <div
                  className={cn(
                    'bg-accent text-muted-foreground flex size-6 items-center justify-center rounded-full text-sm',
                    isActive && 'bg-primary text-primary-foreground',
                  )}
                >
                  {index + 1}
                </div>
                <div
                  className={cn(
                    'text-muted-foreground text-md ml-2',
                    isActive && 'text-foreground',
                  )}
                >
                  {step.label}
                </div>
              </div>
              {index < steps.length - 1 && (
                <IconChevronRight className="text-muted-foreground" />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
