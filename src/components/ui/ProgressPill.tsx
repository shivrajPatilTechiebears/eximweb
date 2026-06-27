import { Icon } from "@/components/ui/Icon";

interface Step {
  label: string;
  icon?: string;
  complete: boolean;
}

interface ProgressPillProps {
  steps: Step[];
}

export function ProgressPill({ steps }: ProgressPillProps) {
  const activeIndex = steps.findIndex((s) => !s.complete);

  return (
    <div className="stepper-strip">
      <div className="stepper-track">
        {steps.map((step, i) => {
          const isDone = step.complete;
          const isActive = i === activeIndex;
          const isFirst = i === 0;
          const isLast = i === steps.length - 1;
          const leftFilled = i > 0 && steps[i - 1].complete;
          const rightFilled = !isLast && isDone;

          const connectorLeft = isFirst
            ? "stepper-connector stepper-connector-hidden"
            : leftFilled
            ? "stepper-connector stepper-connector-filled"
            : "stepper-connector stepper-connector-empty";

          const connectorRight = isLast
            ? "stepper-connector stepper-connector-hidden"
            : rightFilled
            ? "stepper-connector stepper-connector-filled"
            : "stepper-connector stepper-connector-empty";

          const nodeState = isDone
            ? "stepper-node stepper-node-done"
            : isActive
            ? "stepper-node stepper-node-active"
            : "stepper-node stepper-node-idle";

          return (
            <div key={step.label} className="stepper-step">
              <div className="stepper-node-row">
                <div className={connectorLeft} />

                <div className={nodeState}>
                  {isActive && <span className="stepper-pulse animate-ping" />}

                  {isDone ? (
                    <Icon name="check" size={18} strokeWidth={2} />
                  ) : step.icon ? (
                    <Icon name={step.icon} size={18} strokeWidth={isActive ? 1.75 : 1.5} />
                  ) : (
                    <span className="text-[10px] font-bold leading-none">{i + 1}</span>
                  )}
                </div>

                <div className={connectorRight} />
              </div>

              <span className={`stepper-label ${isDone || isActive ? "stepper-label-active" : "stepper-label-idle"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
