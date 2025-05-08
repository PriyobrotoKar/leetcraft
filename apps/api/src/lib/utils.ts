export const replaceBoilerpatePlaceholder = (
  boilerplate: string,
  solution: string,
) => {
  return boilerplate.replace('##USER CODE GOES HERE##', solution);
};
