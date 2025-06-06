export const replaceBoilerpatePlaceholder = (
  boilerplate: string,
  solution: string,
) => {
  return boilerplate.replace('##USER CODE GOES HERE##', solution);
};

export function getLevel(count: number): number {
  if (count >= 10) return 4;
  if (count >= 5) return 3;
  if (count >= 2) return 2;
  return 1;
}
