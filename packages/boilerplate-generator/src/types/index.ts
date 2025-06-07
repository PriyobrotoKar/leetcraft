export const supportedLanguages = [
  {
    id: 63,
    language: 'javascript',
  },
  {
    id: 71,
    language: 'python',
  },
  {
    id: 62,
    language: 'java',
  },
] as const;

export type LanguageConfig = (typeof supportedLanguages)[number];

export type SupportedLanguage = (typeof supportedLanguages)[number]['language'];

export const Languages = Object.fromEntries(
  supportedLanguages.map((lang) => [lang.language, lang.language]),
) as Record<SupportedLanguage, SupportedLanguage>;

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
