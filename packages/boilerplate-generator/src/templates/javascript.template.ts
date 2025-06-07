import BaseTemplate from './base.template';
import { DataType } from '@/types';

export default class JavascriptTemplate extends BaseTemplate {
  generateBoilerplateShort(): string {
    let code = `function ${this.problem.functionName}(${this.formatParams()}) {\n`;
    code += this.indent('// Write your code here\n');
    code += '}';
    return code;
  }

  generateBoilerplateLong(): string {
    let code = 'const readline = require("readline");\n\n';
    code += '##USER CODE GOES HERE##\n\n';

    code += 'async function processInput() {\n';
    code += this.indent('const rl = readline.createInterface({\n');
    code += this.indent('input: process.stdin,\n', 2);
    code += this.indent('output: process.stdout,\n', 2);
    code += this.indent('});\n\n');

    code += this.indent('const inputs = [];\n');
    code += this.indent(
      `const types = [${this.problem.params
        .map((param) => `"${this.formatDataType(param.type)}"`)
        .join(', ')}];\n`,
    );

    code += this.indent('let ind = 0;\n');
    code += this.indent('for await (const line of rl) {\n');
    code += this.indent('let value = line.trim();\n', 2);
    code += this.indent('const type = types[ind];\n', 2);
    code += this.indent('if (type.startsWith("list[")) {\n', 2);
    code += this.indent(
      'const innerType = type.slice(5, -1);\n' +
        'value = value.split(" ").map((x) => castToType(x, innerType));\n',
      3,
    );
    code += this.indent('} else {\n', 2);
    code += this.indent('value = castToType(value, type);\n', 3);
    code += this.indent('}\n', 2);
    code += this.indent('inputs.push(value);\n', 2);
    code += this.indent('ind++;\n', 2);
    code += this.indent(
      `if (inputs.length === ${this.problem.params.length}) rl.close();\n`,
      2,
    );
    code += this.indent('}\n\n');

    code += this.indent(
      `const result = ${this.problem.functionName}(...inputs);\n`,
    );
    code += this.indent('console.log(result);\n');
    code += '}\n\n';

    // Add helper function for casting
    code += 'function castToType(value, type) {\n';
    code += this.indent('switch(type) {\n');
    code += this.indent('case "int": return Number.parseInt(value);', 2) + '\n';
    code +=
      this.indent('case "float": return Number.parseFloat(value);', 2) + '\n';
    code += this.indent('case "str": return value;', 2) + '\n';
    code += this.indent('case "bool": return value === "true";', 2) + '\n';
    code +=
      this.indent('default: throw new Error("Unsupported type: " + type);', 2) +
      '\n';
    code += this.indent('}\n');
    code += '}\n\n';

    code += 'processInput();\n';

    return code;
  }

  protected formatParams(): string {
    return this.problem.params.map((param) => param.name).join(', ');
  }

  protected formatDataType(dataType: DataType): string {
    if (dataType.includes('array<')) {
      const innerType = dataType.replace('array<', '').replace('>', '');
      return `list[${this.formatDataType(innerType as DataType)}]`;
    }

    switch (dataType) {
      case 'integer':
        return 'int';
      case 'float':
        return 'float';
      case 'string':
        return 'str';
      case 'boolean':
        return 'bool';
      default:
        throw new Error(`Unsupported data type: ${dataType}`);
    }
  }
}
