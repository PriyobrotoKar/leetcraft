import { Button } from '@leetcraft/ui/components/button';
import { cn } from '@leetcraft/ui/lib/utils';
import { IconChevronRight } from '@tabler/icons-react';
import { Fragment } from 'react';

function Actions() {
  return (
    <div className="flex items-center justify-between">
      <Steps />
      <div className="space-x-4">
        <Button size={'sm'} variant={'tertiary'}>
          Load Sample
        </Button>
        <Button size={'sm'}>Continue</Button>
      </div>
    </div>
  );
}

export default Actions;

const steps = ['Basic Info', 'Validate Problem', 'Finish'];

function Steps() {
  return (
    <div>
      <div className="flex items-center gap-2">
        {steps.map((step, index) => {
          const isActive = index === 0;

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
                  {step}
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
