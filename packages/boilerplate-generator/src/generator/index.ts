import BaseTemplate from '@/templates/base.template';
import JavaTemplate from '@/templates/java.template';
import JavascriptTemplate from '@/templates/javascript.template';
import PythonTemplate from '@/templates/python.template';
import {
  Boilerplate,
  ProblemSpecification,
  SupportedLanguage,
  supportedLanguages,
} from '@/types';

const TEMPLATE_REGISTRY: Record<
  SupportedLanguage,
  new (structure: ProblemSpecification) => BaseTemplate
> = {
  python: PythonTemplate,
  javascript: JavascriptTemplate,
  java: JavaTemplate,
};

class Generator {
  constructor(private structure: ProblemSpecification) {}

  generate() {
    const boilerplates = [];

    for (const { language, id } of supportedLanguages) {
      const TemplateClass = TEMPLATE_REGISTRY[language];
      const template = new TemplateClass(this.structure);

      const short_code = template.generateBoilerplateShort();
      const long_code = template.generateBoilerplateLong();

      boilerplates.push({
        id,
        language,
        short_code,
        long_code,
      } as Boilerplate);
    }

    return boilerplates;
  }
}

export default Generator;
