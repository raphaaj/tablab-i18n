import { buildLocalizer, Localizer } from './helpers/build-localizer';
import { failedWriteResultDescriptionTemplateProviderEnUs } from './providers/en-US/failed-write-result-description-template-provider';
import { failedWriteResultDescriptionTemplateProviderPtBr } from './providers/pt-BR/failed-write-result-description-template-provider';

type Locale = 'en-US' | 'pt-BR';

const localizeEnUs = buildLocalizer(failedWriteResultDescriptionTemplateProviderEnUs);
const localizePtBr = buildLocalizer(failedWriteResultDescriptionTemplateProviderPtBr);

const localize: Record<Locale, Localizer> = {
  'en-US': localizeEnUs,
  'pt-BR': localizePtBr,
};

export { Locale, Localizer, localize, localizeEnUs, localizePtBr };
