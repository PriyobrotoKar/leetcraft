export const supportedLanguages = [
  {
    id: 63,
    language: 'javascript',
  },
  {
    id: 71,
    language: 'python',
  },
] as const;

export type LanguageConfig = (typeof supportedLanguages)[number];

const languages = supportedLanguages.map((lang) => lang.language);
export type SupportedLanguage = (typeof languages)[number];

export type Boilerplate = LanguageConfig & {
  short_code: string;
  long_code: string;
};

const dataTypes = ['integer', 'float', 'string', 'boolean'] as const;
export type Primitive = (typeof dataTypes)[number];
export type DataType = Primitive | `array<${Primitive}>`;

export interface Parameter {
  name: string;
  type: DataType;
}

export interface ProblemSpecification {
  functionName: string;
  params: Parameter[];
  returnType: DataType;
}
