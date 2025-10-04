import { QueueNumber } from "../queue-number";

export default function QueueNumberExample() {
  return (
    <div className="p-8 flex gap-4 items-center">
      <QueueNumber number={1} size="sm" />
      <QueueNumber number={12} size="md" />
      <QueueNumber number={123} size="lg" />
    </div>
  );
}
