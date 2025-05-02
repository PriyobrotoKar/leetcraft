import { Parameter, Primitive, ProblemSpecification } from '@/types';
import { parse } from 'yaml';

const validTypes = ['int', 'float', 'string', 'bool'] as const;
export type ValidTypes = (typeof validTypes)[number];

export const dataTypes = ['integer', 'float', 'string', 'boolean'] as const;

export const paramToTypeMap: Record<ValidTypes, Primitive> = {
  int: 'integer',
  float: 'float',
  string: 'string',
  bool: 'boolean',
};

class ProblemParser {
  static parse(structure: string) {
    const parsedData = parse(structure);

    // validate the structure
    this.validate(parsedData);
    console.log('Validation successful');

    // parse the structure
    const parsedStructure = this.parseStructure(parsedData);

    // return the parsed structure
    return parsedStructure;
  }

  private static validate(parsedData: any) {
    // check if parsedData has function_name, params and return_type
    if (!parsedData.function_name) {
      throw new Error('function_name is required');
    }
    if (!parsedData.params) {
      throw new Error('params is required');
    }
    if (!parsedData.return_type) {
      throw new Error('return_type is required');
    }

    // check if function_name has spaces
    if (parsedData.function_name.includes(' ')) {
      throw new Error('function_name should not have spaces');
    }

    // check if params has at least one parameter and each parameter has a name and type
    if (!parsedData.params.length) {
      throw new Error('params should have at least one parameter');
    }
    if (!parsedData.params.every((param: any) => param.name && param.type)) {
      throw new Error('each parameter should have a name and type');
    }

    //check if all the parameter types are valid
    parsedData.params.forEach((param: any) => {
      this.validateType(param.type);
    });

    // check if return_type is valid
    this.validateType(parsedData.return_type);
  }

  private static validateType(type: any) {
    if (!type) {
      throw new Error('type is required');
    }

    if (type.includes('[]')) {
      type = type.replace('[]', '');
    }
    if (!validTypes.includes(type)) {
      throw new Error('invalid parameter type');
    }
  }

  private static parseStructure(parsedData: any): ProblemSpecification {
    const functionName = parsedData.function_name;

    const params = parsedData.params.map((param: any) => {
      let paramType: string = paramToTypeMap[param.type as ValidTypes];

      if (param.type.includes('[]')) {
        param.type = param.type.replace('[]', '');
        paramType = `array<${paramToTypeMap[param.type as ValidTypes]}>`;
      }

      return {
        name: param.name,
        type: paramType,
      };
    });

    if (parsedData.return_type.includes('[]')) {
      parsedData.return_type = parsedData.return_type.replace('[]', '');
      parsedData.return_type = `array<${paramToTypeMap[parsedData.return_type as ValidTypes]}>`;
    }
    const returnType = parsedData.return_type;

    return {
      functionName,
      params,
      returnType,
    };
  }
}

export default ProblemParser;
