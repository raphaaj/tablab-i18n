import {
  BaseInstructionWriter,
  BaseInstructionWriterOptions,
  BaseWriteResult,
  FailedWriteResultDescriptionTemplateProvider,
  InvalidInstructionReason,
  ParsedInstructionData,
  Tab,
} from 'tablab';
import { buildLocalizer } from '../../src/helpers/build-localizer';

class TestInstructionWriter extends BaseInstructionWriter {
  constructor(options: BaseInstructionWriterOptions) {
    super(options);
  }

  protected internalWriteOnTab(): BaseWriteResult {
    throw new Error('Method not implemented.');
  }
}

const getTestInstructionWriter = () => {
  const testInstructionStr = 'test';

  const testParsedInstruction: ParsedInstructionData = {
    method: null,
    readFromIndex: 0,
    readToIndex: testInstructionStr.length,
    value: testInstructionStr,
  };

  const testInstructionWriter = new TestInstructionWriter({
    parsedInstruction: testParsedInstruction,
  });

  return testInstructionWriter;
};

function getTestDescriptionTemplateProvider(): FailedWriteResultDescriptionTemplateProvider {
  const testDescriptionTemplateProvider = Object.values(InvalidInstructionReason).reduce(
    (descriptionTemplateProvider, invalidInstructionReason, invalidInstructionReasonIndex) => {
      descriptionTemplateProvider[invalidInstructionReason] =
        `Teste ${invalidInstructionReasonIndex}`;

      return descriptionTemplateProvider;
    },
    {} as FailedWriteResultDescriptionTemplateProvider
  );

  return testDescriptionTemplateProvider;
}

describe(`[${buildLocalizer.name}]`, () => {
  it('should return a localize function', () => {
    const descriptionTemplateProvider = getTestDescriptionTemplateProvider();
    const localize = buildLocalizer(descriptionTemplateProvider);

    expect(typeof localize).toBe('function');
  });

  describe('[localize function]', () => {
    it('should throw if no write results are given for localization', () => {
      const descriptionTemplateProvider = getTestDescriptionTemplateProvider();
      const localize = buildLocalizer(descriptionTemplateProvider);

      // @ts-expect-error > force the scenario where no write results are given for localization
      expect(() => localize(null)).toThrow();
    });

    it('should throw if an array with an empty element is given for localization', () => {
      const descriptionTemplateProvider = getTestDescriptionTemplateProvider();
      const localize = buildLocalizer(descriptionTemplateProvider);

      // @ts-expect-error > force the scenario where an empty write result is given for localization
      expect(() => localize([null])).toThrow();
    });

    it('should not perform any action over successful write results', () => {
      const instructionWriter = getTestInstructionWriter();
      const tab = new Tab();
      const writeResult = new BaseWriteResult({ success: true, instructionWriter, tab });
      const originalWriteResult = Object.assign({}, writeResult);

      const descriptionTemplateProvider = getTestDescriptionTemplateProvider();
      const localize = buildLocalizer(descriptionTemplateProvider);

      localize([writeResult]);

      expect(writeResult).toEqual(originalWriteResult);
    });

    it('should not perform any action over failed write results with unrecognized failure reason identifiers', () => {
      const instructionWriter = getTestInstructionWriter();
      const tab = new Tab();
      const failureReasonIdentifier = 'TEST_CUSTOM_FAILURE_REASON_IDENTIFIER';
      const writeResult = new BaseWriteResult({
        success: false,
        failureReasonIdentifier,
        instructionWriter,
        tab,
      });
      const originalWriteResult = Object.assign({}, writeResult);

      const descriptionTemplateProvider = getTestDescriptionTemplateProvider();
      const localize = buildLocalizer(descriptionTemplateProvider);

      localize([writeResult]);

      expect(writeResult).toEqual(originalWriteResult);
    });

    it('should not perform any action over failed write results if a description can not be obtained for them', () => {
      const failureReasonIdentifier = InvalidInstructionReason.UnknownReason;
      const instructionWriter = getTestInstructionWriter();
      const tab = new Tab();
      const writeResult = new BaseWriteResult({
        success: false,
        failureReasonIdentifier,
        instructionWriter,
        tab,
      });
      const originalWriteResult = Object.assign({}, writeResult);

      const descriptionTemplate = jest.fn(() => '');
      const descriptionTemplateProvider = getTestDescriptionTemplateProvider();
      descriptionTemplateProvider[failureReasonIdentifier] = descriptionTemplate;
      const localize = buildLocalizer(descriptionTemplateProvider);

      localize([writeResult]);

      expect(descriptionTemplate).toHaveBeenCalled();
      expect(writeResult).toEqual(originalWriteResult);
    });

    it('should update the failure message of the failed write results if a description can be obtained for them', () => {
      const expectedFailureMessage = 'Custom failure message';
      const failureReasonIdentifier = InvalidInstructionReason.UnknownReason;
      const instructionWriter = getTestInstructionWriter();
      const tab = new Tab();
      const writeResult = new BaseWriteResult({
        success: false,
        failureReasonIdentifier,
        instructionWriter,
        tab,
      });
      const originalWriteResult = Object.assign({}, writeResult);

      const descriptionTemplate = jest.fn(() => expectedFailureMessage);
      const descriptionTemplateProvider = getTestDescriptionTemplateProvider();
      descriptionTemplateProvider[failureReasonIdentifier] = descriptionTemplate;
      const localize = buildLocalizer(descriptionTemplateProvider);

      localize([writeResult]);

      expect(descriptionTemplate).toHaveBeenCalled();
      expect(writeResult.failureMessage).toBe(expectedFailureMessage);
      expect(writeResult.failureReasonIdentifier).toBe(originalWriteResult.failureReasonIdentifier);
      expect(writeResult.instructionWriter).toBe(originalWriteResult.instructionWriter);
      expect(writeResult.success).toBe(originalWriteResult.success);
      expect(writeResult.tab).toBe(originalWriteResult.tab);
    });

    it('should update the failure message of the failed child results of successful write results if a description can be obtained for them', () => {
      const expectedFailureMessage = 'Custom failure message';
      const failureReasonIdentifier = InvalidInstructionReason.UnknownReason;
      const instructionWriter = getTestInstructionWriter();
      const tab = new Tab();

      const childWriteResult = new BaseWriteResult({
        success: false,
        failureReasonIdentifier,
        instructionWriter,
        tab,
      });
      const originalChildWriteResult = Object.assign({}, childWriteResult);

      const writeResult = new BaseWriteResult({
        childResults: [childWriteResult],
        success: true,
        instructionWriter,
        tab,
      });

      const descriptionTemplate = jest.fn(() => expectedFailureMessage);
      const descriptionTemplateProvider = getTestDescriptionTemplateProvider();
      descriptionTemplateProvider[failureReasonIdentifier] = descriptionTemplate;
      const localize = buildLocalizer(descriptionTemplateProvider);

      localize([writeResult]);

      expect(descriptionTemplate).toHaveBeenCalled();
      expect(childWriteResult.failureMessage).toBe(expectedFailureMessage);
      expect(childWriteResult.failureReasonIdentifier).toBe(
        originalChildWriteResult.failureReasonIdentifier
      );
      expect(childWriteResult.instructionWriter).toBe(originalChildWriteResult.instructionWriter);
      expect(childWriteResult.success).toBe(originalChildWriteResult.success);
      expect(childWriteResult.tab).toBe(originalChildWriteResult.tab);
    });

    it('should update the failure message of the failed child results of failed write results if a description can be obtained for them', () => {
      const expectedFailureMessage = 'Custom failure message';
      const failureReasonIdentifier = InvalidInstructionReason.UnknownReason;
      const instructionWriter = getTestInstructionWriter();
      const tab = new Tab();

      const childWriteResult = new BaseWriteResult({
        success: false,
        failureReasonIdentifier,
        instructionWriter,
        tab,
      });
      const originalChildWriteResult = Object.assign({}, childWriteResult);

      const writeResult = new BaseWriteResult({
        childResults: [childWriteResult],
        success: false,
        failureReasonIdentifier,
        instructionWriter,
        tab,
      });

      const descriptionTemplate = jest.fn(() => expectedFailureMessage);
      const descriptionTemplateProvider = getTestDescriptionTemplateProvider();
      descriptionTemplateProvider[failureReasonIdentifier] = descriptionTemplate;
      const localize = buildLocalizer(descriptionTemplateProvider);

      localize([writeResult]);

      expect(descriptionTemplate).toHaveBeenCalledTimes(2);
      expect(childWriteResult.failureMessage).toBe(expectedFailureMessage);
      expect(childWriteResult.failureReasonIdentifier).toBe(
        originalChildWriteResult.failureReasonIdentifier
      );
      expect(childWriteResult.instructionWriter).toBe(originalChildWriteResult.instructionWriter);
      expect(childWriteResult.success).toBe(originalChildWriteResult.success);
      expect(childWriteResult.tab).toBe(originalChildWriteResult.tab);
    });
  });
});
