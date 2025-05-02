import { DataType, ProblemSpecification } from '@/types';

export default abstract class BaseTemplate {
  problem: ProblemSpecification;
  tabWidth: number = 2;

  constructor(problemSpec: ProblemSpecification) {
    this.problem = problemSpec;
  }

  protected indent(code: string, tabs: number = 1): string {
    const tabSpaces = ' '.repeat(this.tabWidth * tabs);
    return tabSpaces + code;
  }

  abstract generateBoilerplateShort(): string;
  abstract generateBoilerplateLong(): string;
  protected formatDataType(dataType: DataType): string {
    return '';
  }
}
