import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * @see [“cn” utility function in shadcn-ui/ui: - DEV Community](https://dev.to/ramunarasinga/cn-utility-function-in-shadcn-uiui-3c4k)
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
