import { z, ZodTypeAny } from "zod";
import { errorResult, okResult, type Result } from "@/lib/result";

export const saveToLocalStorage = <T>(key: string, data: T) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    return okResult(true);
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    return errorResult(error);
  }
};

export const loadFromLocalStorage = <T extends ZodTypeAny>(
  key: string,
  schema: T,
): Result<z.infer<T>> => {
  try {
    const serializedData = localStorage.getItem(key);
    if (!serializedData) return errorResult(new Error("No data found"));

    const parsed = schema.safeParse(JSON.parse(serializedData));
    if (!parsed.success) return errorResult(parsed.error);

    return okResult(parsed.data);
  } catch (error) {
    return errorResult(error);
  }
};
