import { DataType } from '@/types';
import BaseTemplate from './base.template';

export default class PythonTemplate extends BaseTemplate {
  generateBoilerplateShort(): string {
    let code = `def ${this.problem.functionName}(${this.formatParams()}):\n`;
    code += this.indent('#Write your code here\n');
    code += '\n';
    return code;
  }

  generateBoilerplateLong(): string {
    let code = 'import sys\n';
    code += '\n';
    code += '##USER CODE GOES HERE##\n';
    code += '\n';
    code += 'def processInput():\n';
    code += this.indent('inputs = []\n');
    code += this.indent(
      `types = [${this.problem.params.map((param) => `'${this.formatDataType(param.type)}'`).join(', ')}]\n`,
    );
    code += this.indent('ind = 0\n');
    code += this.indent('for line in sys.stdin.readlines():\n');
    code += this.indent('value = line.rstrip("\\n")\n', 2);
    code += this.indent('type = types[ind]\n', 2);
    code += this.indent('if "list" in type:\n', 2);
    code += this.indent(
      'arrayType = eval(type.replace("list[", "").replace("]", ""))\n',
      3,
    );
    code += this.indent(
      'value = [arrayType(x) for x in value.split(" ")]\n',
      3,
    );
    code += this.indent('else:\n', 2);
    code += this.indent(`value = eval(type)(value)\n`, 3);
    code += this.indent('inputs.append(value)\n', 2);
    code += this.indent(`ind += 1\n`, 2);
    code += this.indent('\n');
    code += this.indent(`result = ${this.problem.functionName}(*inputs)\n`);
    code += this.indent('print(result)\n');
    code += 'processInput()\n';

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
