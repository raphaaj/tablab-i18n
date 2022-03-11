import {
  BaseWriteResult,
  FailedWriteResultDescriptionTemplateProvider,
  InternalFailedWriteResultDescriptionFactory,
  InvalidInstructionReason,
} from 'tablab';

export type Localizer = (writeResult: BaseWriteResult) => void;

export function buildLocalizer(
  failedWriteResultDescriptionTemplateProvider: FailedWriteResultDescriptionTemplateProvider
): Localizer {
  const invalidInstructionReasons: string[] = Object.values(InvalidInstructionReason);

  const descriptionFactory = new InternalFailedWriteResultDescriptionFactory({
    descriptionTemplateProvider: failedWriteResultDescriptionTemplateProvider,
  });

  return function localize(writeResult: BaseWriteResult): void {
    if (!writeResult) throw new Error('Write result not specified for localization');

    if (!writeResult.success) {
      localizeWriteResult(writeResult, invalidInstructionReasons, descriptionFactory);
    }
  };
}

function localizeWriteResult(
  writeResult: BaseWriteResult,
  invalidInstructionReasons: string[],
  failedWriteResultDescriptionFactory: InternalFailedWriteResultDescriptionFactory
): void {
  if (
    writeResult.failureReasonIdentifier &&
    invalidInstructionReasons.includes(writeResult.failureReasonIdentifier)
  ) {
    const failureMessage = failedWriteResultDescriptionFactory.getDescription(
      writeResult.failureReasonIdentifier as InvalidInstructionReason,
      {
        parsedInstruction: writeResult.instructionWriter.parsedInstruction,
        tab: writeResult.tab,
      }
    );

    if (failureMessage) writeResult.failureMessage = failureMessage;
  }
}
