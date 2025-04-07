import { cn } from "@/utils/styles";
import { formatInTimeZone } from "date-fns-tz";
import type { ComponentPropsWithoutRef } from "react";

type Props = Omit<ComponentPropsWithoutRef<"time">, "children" | "dateTime"> & {
  dateTime: string;
};

export const Time = ({ dateTime, className, ...rest }: Props) => {
  return (
    <time {...rest} dateTime={dateTime} className={cn("text-gray-400 text-sm", className)}>
      {formatInTimeZone(new Date(dateTime), "Asia/Tokyo", "yyyy-MM-dd HH:mm")}
    </time>
  );
};
