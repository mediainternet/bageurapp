interface QueueNumberProps {
  number: number;
  size?: "sm" | "md" | "lg";
}

export function QueueNumber({ number, size = "md" }: QueueNumberProps) {
  const sizeClasses = {
    sm: "h-12 w-12 text-lg",
    md: "h-16 w-16 text-2xl",
    lg: "h-24 w-24 text-4xl",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold font-mono`}
      data-testid="queue-number"
    >
      {number}
    </div>
  );
}
