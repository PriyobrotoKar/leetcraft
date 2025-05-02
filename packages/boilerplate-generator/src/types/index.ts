import { dataTypes } from '@/parser';

export type Primitive = (typeof dataTypes)[number];

export type DataType = Primitive | `array<${Primitive}>`;

export interface Parameter {
  name: string;
  type: DataType;
}

export interface ProblemSpecification {
  functionName: string;
  params: Parameter[];
  returnType: string;
}
