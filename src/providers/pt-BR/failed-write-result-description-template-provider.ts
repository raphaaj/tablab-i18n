import { FailedWriteResultDescriptionTemplateProvider, InvalidInstructionReason } from 'tablab';

export const failedWriteResultDescriptionTemplateProviderPtBr: FailedWriteResultDescriptionTemplateProvider =
  {
    [InvalidInstructionReason.UnknownReason]: 'Um erro inesperado foi identificado',
    [InvalidInstructionReason.BasicInstructionInvalid]: 'Instrução básica inválida',
    [InvalidInstructionReason.BasicInstructionWithNonWritableNote]: (data = {}) => {
      if (data.tab)
        return `O valor indicado para a corda deve estar entre 1 e ${data.tab.numberOfStrings}`;
      else return 'O valor indicado para a corda está indisponível na tablatura';
    },
    [InvalidInstructionReason.UnidentifiedMethodInstruction]: (data = {}) => {
      if (data.parsedInstruction && data.parsedInstruction.method)
        return `Instrução do tipo método não identificada para a expressão "${data.parsedInstruction.method.alias}"`;
      else return 'Instrução do tipo método não identificada para a expressão indicada';
    },
    [InvalidInstructionReason.UnknownMethodInstruction]: (data = {}) => {
      if (data.parsedInstruction && data.parsedInstruction.method)
        return `Instrução do tipo método sem implementação para a expressão "${data.parsedInstruction.method.alias}"`;
      else return 'Instrução do tipo método sem implementação para a expressão indicada';
    },
    [InvalidInstructionReason.HeaderInstructionWithInvalidHeader]:
      'A mensagem do cabeçalho deve apresentar pelo menos um caractére diferente de espaço',
    [InvalidInstructionReason.HeaderInstructionWithUnmappedArguments]:
      'O método para escrita de cabeçalho exige apenas um argumento: a mensagem do cabeçalho',
    [InvalidInstructionReason.HeaderInstructionWithoutArguments]:
      'O método para escrita de cabeçalho exige um argumento: a mensagem do cabeçalho',
    [InvalidInstructionReason.FooterInstructionWithInvalidFooter]:
      'A mensagem do rodapé deve apresentar pelo menos um caractére diferente de espaço',
    [InvalidInstructionReason.FooterInstructionWithUnmappedArguments]:
      'O método para escrita de rodapé exige apenas um argumento: a mensagem do rodapé',
    [InvalidInstructionReason.FooterInstructionWithoutArguments]:
      'O método para escrita de rodapé exige um argumento: a mensagem do rodapé',
    [InvalidInstructionReason.SpacingInstructionWithInvalidSpacingValueType]:
      'O valor do espaçamento deve ser um número inteiro',
    [InvalidInstructionReason.SpacingInstructionWithInvalidSpacingValue]:
      'O valor do espaçamento deve ser no mínimo 1',
    [InvalidInstructionReason.SpacingInstructionWithUnmappedArguments]:
      'O método para configuração do espaçamento exige apenas um argumento: o novo valor para o espaçamento',
    [InvalidInstructionReason.SpacingInstructionWithoutArguments]:
      'O método para configuração do espaçamento exige um argumento: o novo valor para o espaçamento',
    [InvalidInstructionReason.RepeatInstructionWithoutArguments]:
      'O método para repetição de instruções exige um argumento: a quantidade de repetições',
    [InvalidInstructionReason.RepeatInstructionWithUnmappedArguments]:
      'O método para repetição de instruções exige apenas um argumento: a quantidade de repetições',
    [InvalidInstructionReason.RepeatInstructionWithInvalidRepetitionsValueType]:
      'O valor da quantidade de repetições deve ser um número inteiro',
    [InvalidInstructionReason.RepeatInstructionWithInvalidRepetitionsValue]:
      'O valor da quantidade de repetições deve ser no mínimo 1',
    [InvalidInstructionReason.RepeatInstructionWithoutTargets]:
      'O método para repetição de instruções exige pelo menos uma instrução alvo para repetição',
    [InvalidInstructionReason.MergeInstructionWithoutTargets]:
      'O método para união de instruções exige pelo menos duas instruções alvo para unir',
    [InvalidInstructionReason.MergeInstructionWithUnmergeableTargets]:
      'As instruções alvo do método para união de instruções não podem ser instruções do tipo método',
    [InvalidInstructionReason.MergeInstructionTargetsWithNonWritableNotes]: (data = {}) => {
      let desc =
        'Identificadas instruções alvo com valor indicado para corda indisponível na tablatura.';
      if (data.tab)
        desc += ` O valor indicado para a corda deve estar entre 1 e ${data.tab.numberOfStrings}`;

      return desc;
    },
    [InvalidInstructionReason.MergeInstructionTargetsWithConcurrentNotes]:
      'Identificadas múltiplas instruções alvo referentes à uma mesma corda na tablatura',
  };
