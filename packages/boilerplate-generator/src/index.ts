import ProblemParser from './parser';
import PythonTemplate from './templates/python.template';

const generateBoilerplates = (structure: string) => {
  const parsedStruct = ProblemParser.parse(structure);

  const pythonTem = new PythonTemplate(parsedStruct);
  const pythonCode = pythonTem.generateBoilerplateShort();
  console.log('Boilerplate Short Python:');
  console.log(pythonCode);
};

generateBoilerplates(`
function_name: TwoSum
params:
 - type: int[]
   name: nums
 - type: int
   name: target
return_type: int[]
`);
