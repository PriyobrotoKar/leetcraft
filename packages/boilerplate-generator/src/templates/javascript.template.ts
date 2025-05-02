import BaseTemplate from './base.template';

export default class JavascriptTemplate extends BaseTemplate {
  generateBoilerplateShort(): string {
    let code = `function ${this.problem.functionName}(${this.formatParams()}){\n`;
    code += this.indent('//Write your code here\n');
    code += '}';
    return code;
  }

  generateBoilerplateLong(): string {
    let code = "const readline = require('readline');\n";

    code += '##USER CODE GOES HERE##\n';

    code += 'async function processInput() {\n';
    code += this.indent('const rl = readline.createInterface({\n');
    code += this.indent('input: process.stdin,\n', 2);
    code += this.indent('output: process.stdout,\n', 2);
    code += this.indent('});\n');

    code += this.indent('const inputs = [];\n');
    code += this.indent('for await (const line of rl) {\n');
    code += this.indent('inputs.push(line);\n', 2);
    code += this.indent(
      `if(inputs.length === ${this.problem.params.length}) {\n`,
      2,
    );
    code += this.indent('rl.close();\n', 3);
    code += this.indent('}\n', 2);
    code += this.indent('}\n');

    code += this.indent(
      `const result = ${this.problem.functionName}(...inputs);\n`,
    );
    code += this.indent('console.log(result);\n');
    code += '}\n';

    code += 'processInput();\n';

    return code;
  }

  protected formatParams(): string {
    return this.problem.params.map((param) => param.name).join(', ');
  }
}
