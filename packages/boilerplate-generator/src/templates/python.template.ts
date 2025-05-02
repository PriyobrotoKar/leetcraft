import BaseTemplate from './base.template';

export default class PythonTemplate extends BaseTemplate {
  generateBoilerplateShort(): string {
    let code = `def ${this.problem.functionName}(${this.formatParams()}){\n`;
    code += this.indent('//Write your code here\n');
    code += '}';
    return code;
  }

  generateBoilerplateLong(): string {
    return 'boilerplate';
  }

  protected formatParams(): string {
    return this.problem.params.map((param) => param.name).join(', ');
  }
}
