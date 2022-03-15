import {
  BaseInstructionWriter,
  BaseWriteResult,
  FailedWriteResultDescriptionTemplateProvider,
  InvalidInstructionReason,
  Tab,
} from 'tablab';
import { buildLocalizer } from '../../src/helpers/build-localizer';

class TestInstructionWriter extends BaseInstructionWriter {
  protected internalWriteOnTab(): BaseWriteResult {
    throw new Error('Method not implemented.');
  }
}

function getTestDescriptionTemplateProvider(): FailedWriteResultDescriptionTemplateProvider {
  const testDescriptionTemplateProvider = Object.values(InvalidInstructionReason).reduce(
    (descriptionTemplateProvider, invalidInstructionReason, invalidInstructionReasonIndex) => {
      descriptionTemplateProvider[
        invalidInstructionReason
      ] = `Teste ${invalidInstructionReasonIndex}`;

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
      const instructionWriter = new TestInstructionWriter();
      const tab = new Tab();
      const writeResult = new BaseWriteResult({ success: true, instructionWriter, tab });
      const originalWriteResult = Object.assign({}, writeResult);

      const descriptionTemplateProvider = getTestDescriptionTemplateProvider();
      const localize = buildLocalizer(descriptionTemplateProvider);

      localize([writeResult]);

      expect(writeResult).toEqual(originalWriteResult);
    });

    it('should not perform any action over failed write results with unrecognized failure reason identifiers', () => {
      const instructionWriter = new TestInstructionWriter();
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
      const instructionWriter = new TestInstructionWriter();
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
      const instructionWriter = new TestInstructionWriter();
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
  });
});
