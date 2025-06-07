import BaseTemplate from './base.template';
import { DataType } from '@/types';

export default class JavaTemplate extends BaseTemplate {
  generateBoilerplateShort(): string {
    let code = `class Solution {\n`;
    code += this.indent(
      `public ${this.formatDataType(this.problem.returnType) || 'void'} ${this.problem.functionName}(${this.formatParams()}) {\n`,
    );
    code += this.indent('// Write your code here\n', 2);
    code += this.indent('}\n');
    code += '}\n';
    return code;
  }

  generateBoilerplateLong(): string {
    let code = 'import java.util.*;\n';
    code += 'import java.io.*;\n\n';
    code += '##USER CODE GOES HERE##\n\n';

    code += 'public class Main {\n\n';
    code += this.indent(
      'public static void main(String[] args) throws Exception {\n',
    );
    code += this.indent('Scanner sc = new Scanner(System.in);\n', 2);

    // Read inputs and parse them
    this.problem.params.forEach((param, index) => {
      const type = this.formatDataType(param.type);
      const name = param.name;
      if (type.startsWith('List<')) {
        const innerType = type.match(/<(.+)>/)?.[1] || 'String';
        code += this.indent(
          `String[] ${name}Strs = sc.nextLine().split(" ");\n`,
          2,
        );
        code += this.indent(
          `List<${innerType}> ${name} = new ArrayList<>();\n`,
          2,
        );
        code += this.indent(
          `for (String s : ${name}Strs) ${name}.add(${this.castStringToType('s', innerType)});\n`,
          2,
        );
      } else {
        code += this.indent(`${type} ${name} = ${this.scanType(type)};\n`, 2);
        // Avoid double newline if next is nextLine
        if (type !== 'String' && this.needsNextLine(index)) {
          code += this.indent('sc.nextLine();\n', 2);
        }
      }
    });

    // Instantiate and call the function
    code += '\n';
    code += this.indent('Solution sol = new Solution();\n', 2);
    const call = `sol.${this.problem.functionName}(${this.problem.params.map((p) => p.name).join(', ')})`;

    code += this.indent(
      `${this.formatDataType(this.problem.returnType)} result = ${call};\n`,
      2,
    );
    code += this.indent('System.out.println(result);\n', 2);

    code += this.indent('}\n');
    code += '}\n';

    return code;
  }

  protected formatParams(): string {
    return this.problem.params
      .map((param) => `${this.formatDataType(param.type)} ${param.name}`)
      .join(', ');
  }

  protected formatDataType(dataType: DataType): string {
    if (dataType.includes('array<')) {
      const innerType = this.formatDataType(
        dataType.replace('array<', '').replace('>', '') as DataType,
      );
      return `List<${innerType}>`;
    }

    switch (dataType) {
      case 'integer':
        return 'int';
      case 'float':
        return 'double';
      case 'string':
        return 'String';
      case 'boolean':
        return 'boolean';
      default:
        throw new Error(`Unsupported data type: ${dataType}`);
    }
  }

  private scanType(type: string): string {
    switch (type) {
      case 'int':
        return 'sc.nextInt()';
      case 'double':
        return 'sc.nextDouble()';
      case 'boolean':
        return 'Boolean.parseBoolean(sc.nextLine())';
      case 'String':
        return 'sc.nextLine()';
      default:
        return 'sc.nextLine()';
    }
  }

  private castStringToType(varName: string, type: string): string {
    switch (type) {
      case 'int':
        return `Integer.parseInt(${varName})`;
      case 'double':
        return `Double.parseDouble(${varName})`;
      case 'boolean':
        return `Boolean.parseBoolean(${varName})`;
      default:
        return varName;
    }
  }

  private needsNextLine(index: number): boolean {
    const next = this.problem.params[index + 1];
    return !!(next?.type === 'string' || next?.type.includes('array<'));
  }
}
