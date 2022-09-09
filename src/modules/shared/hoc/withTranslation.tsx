import { ComponentType, useCallback, useEffect, useState } from 'react';

import Loading from '@shared/components/Loading/Loading';
import { TranslationService } from '@shared/services/translation-service/translation-service';

export const withTranslation = (WrappedComponent: ComponentType): ComponentType => {
	return function ComponentWithTranslations(props: Record<string, unknown>) {
		const [areTranslationsLoaded, setAreTranslationsLoaded] = useState<boolean>(false);

		const initTranslations = useCallback(async () => {
			await TranslationService.initTranslations();
			setAreTranslationsLoaded(true);
		}, [setAreTranslationsLoaded]);

		useEffect(() => {
			initTranslations();
		}, [initTranslations]);

		if (!areTranslationsLoaded) {
			return <Loading fullscreen />;
		}
		return <WrappedComponent {...props} />;
	};
};
