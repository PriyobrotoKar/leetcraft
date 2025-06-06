import { Difficulty } from '@leetcraft/db';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isValidURL(url: string) {
  const res = url.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
  );
  return res !== null;
}

export function getDifficultyColor(difficulty: Difficulty): string {
  switch (difficulty) {
    case 'EASY':
      return 'bg-green-500/20 text-green-500';
    case 'MEDIUM':
      return 'bg-yellow-500/20 text-yellow-500';
    case 'HARD':
      return 'bg-destructive/20 text-destructive';
  }
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
