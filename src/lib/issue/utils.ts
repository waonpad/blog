import { labelCodeSeparator } from "./config";

/**
 * @example
 * extractLabelCode("label___description") // "label"
 */
export const extractLabelCode = (labelDescription: string): string | null => {
  if (!labelDescription.includes(labelCodeSeparator)) {
    return null;
  }

  const code = labelDescription.split(labelCodeSeparator)[0];

  return code === "" ? null : code;
};

/**
 * @example
 * extractDisplayLabelDescription("label___description") // "description"
 */
export const extractDisplayLabelDescription = (labelDescription: string): string | null => {
  if (!labelDescription.includes(labelCodeSeparator)) {
    return labelDescription;
  }

  return labelDescription.split(labelCodeSeparator)[1] || null;
};
