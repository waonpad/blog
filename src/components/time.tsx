import { formatInTimeZone } from "date-fns-tz";

export const Time = ({ dateTime }: { dateTime: string }) => {
  return (
    <time dateTime={dateTime} title={dateTime} className="block text-gray-400 text-sm">
      {formatInTimeZone(new Date(dateTime), "Asia/Tokyo", "yyyy-MM-dd HH:mm")}
    </time>
  );
};
