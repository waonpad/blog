import type { ComponentPropsWithoutRef } from "react";

type Props = Omit<ComponentPropsWithoutRef<"a">, "rel" | "target">;

export const ExternalLink = ({ children, ...rest }: Props) => {
  return (
    <a {...rest} rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  );
};
