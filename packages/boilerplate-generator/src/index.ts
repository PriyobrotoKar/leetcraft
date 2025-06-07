import Generator from './generator';
import ProblemParser from './parser';

export const parseProblemStructure = (structure: string) => {
  const parsedStruct = ProblemParser.parse(structure);
  return parsedStruct;
};

export const generateBoilerplates = (structure: string) => {
  const parsedStruct = ProblemParser.parse(structure);

  console.log('Parsed Structure:', parsedStruct);

  const generator = new Generator(parsedStruct);
  const boilerplates = generator.generate();

  return boilerplates;
};

export * from './types';
