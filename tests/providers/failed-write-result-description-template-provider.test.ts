import {
  FailedWriteResultDescriptionTemplateFunctionData,
  InvalidInstructionReason,
  ParsedInstructionData,
  Tab,
} from 'tablab';
import { failedWriteResultDescriptionTemplateProviderEnUs } from '../../src/providers/en-US/failed-write-result-description-template-provider';
import { failedWriteResultDescriptionTemplateProviderPtBr } from '../../src/providers/pt-BR/failed-write-result-description-template-provider';

function getParsedBasicInstruction(): ParsedInstructionData {
  const instruction = '1-0';

  return {
    method: null,
    readFromIndex: 0,
    readToIndex: instruction.length,
    value: instruction,
  };
}

function getParsedMethodInstruction(): ParsedInstructionData {
  const alias = 'testAlias';
  const identifier = 'testIdentifier';
  const instruction = alias;

  return {
    method: {
      alias,
      identifier,
      args: [],
      targets: [],
    },
    readFromIndex: 0,
    readToIndex: instruction.length,
    value: instruction,
  };
}

type DescriptionTemplateFunctionTestCase = {
  context: string;
  descriptionTemplateArgs?: FailedWriteResultDescriptionTemplateFunctionData;
};

describe.each([
  ['en-US', failedWriteResultDescriptionTemplateProviderEnUs],
  ['pt-BR', failedWriteResultDescriptionTemplateProviderPtBr],
])('%s', (_, failedWriteResultDescriptionTemplateProvider) => {
  it('should have a description template for each invalid instruction reason', () => {
    let invalidInstructionReasonKey: keyof typeof InvalidInstructionReason;
    for (invalidInstructionReasonKey in InvalidInstructionReason) {
      const invalidInstructionReason = InvalidInstructionReason[invalidInstructionReasonKey];

      const descriptionTemplate =
        failedWriteResultDescriptionTemplateProvider[invalidInstructionReason];

      expect(descriptionTemplate).toBeDefined();
      expect(['string', 'function'].includes(typeof descriptionTemplate)).toBe(true);
    }
  });

  const descriptionTemplateFunctionTestCases: DescriptionTemplateFunctionTestCase[] = [
    { context: 'no data is provided', descriptionTemplateArgs: undefined },
    { context: 'a tab instance is provided', descriptionTemplateArgs: { tab: new Tab() } },
    {
      context: 'a parsed basic instruction data is provided',
      descriptionTemplateArgs: { parsedInstruction: getParsedBasicInstruction() },
    },
    {
      context: 'a parsed method instruction data is provided',
      descriptionTemplateArgs: { parsedInstruction: getParsedMethodInstruction() },
    },
  ];
  it.each(descriptionTemplateFunctionTestCases)(
    `should have description function templates that returns strings when $context`,
    ({ descriptionTemplateArgs }) => {
      let invalidInstructionReasonKey: keyof typeof InvalidInstructionReason;
      for (invalidInstructionReasonKey in InvalidInstructionReason) {
        const invalidInstructionReason = InvalidInstructionReason[invalidInstructionReasonKey];

        const descriptionTemplate =
          failedWriteResultDescriptionTemplateProvider[invalidInstructionReason];

        if (typeof descriptionTemplate !== 'function') continue;

        const description = descriptionTemplate(descriptionTemplateArgs);

        expect(description).toBeDefined();
        expect(typeof description).toBe('string');
      }
    }
  );
});
