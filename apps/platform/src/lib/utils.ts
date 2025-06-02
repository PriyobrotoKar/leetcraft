import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const pollWithRetry = async <T>(
  fn: () => Promise<T>,
  retries: number,
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw new Error('Max retries exceeded');
    }
    await sleep(2.5 * 1000);
    return pollWithRetry(fn, retries - 1);
  }
};
