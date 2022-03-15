import {
  BaseWriteResult,
  FailedWriteResultDescriptionTemplateProvider,
  InternalFailedWriteResultDescriptionFactory,
  InvalidInstructionReason,
} from 'tablab';

export type Localizer = (writeResults: BaseWriteResult[]) => void;

export function buildLocalizer(
  failedWriteResultDescriptionTemplateProvider: FailedWriteResultDescriptionTemplateProvider
): Localizer {
  const invalidInstructionReasons: string[] = Object.values(InvalidInstructionReason);

  const descriptionFactory = new InternalFailedWriteResultDescriptionFactory({
    descriptionTemplateProvider: failedWriteResultDescriptionTemplateProvider,
  });

  return function localize(writeResults: BaseWriteResult[]): void {
    return localizeWriteResults(writeResults, invalidInstructionReasons, descriptionFactory);
  };
}

function localizeWriteResults(
  writeResults: BaseWriteResult[],
  invalidInstructionReasons: string[],
  failedWriteResultDescriptionFactory: InternalFailedWriteResultDescriptionFactory
): void {
  if (!writeResults) throw new Error('Write results not specified for localization');

  writeResults.forEach((writeResult) => {
    if (!writeResult) throw new Error('Failed to localize empty write result');

    if (!writeResult.success)
      localizeWriteResult(
        writeResult,
        invalidInstructionReasons,
        failedWriteResultDescriptionFactory
      );

    if (writeResult.childResults)
      localizeWriteResults(
        writeResult.childResults,
        invalidInstructionReasons,
        failedWriteResultDescriptionFactory
      );
  });
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
