import { ReactSelect, type ReactSelectProps } from '@meemoo/react-components';
import { tText } from '@shared/helpers/translate';
import { useGetThemeFilterOptions } from '@visitor-space/hooks/use-get-theme-filter-options';
import type { FC } from 'react';

/**
 * The value field of the "Thema" advanced filter: a searchable dropdown of every theme.
 *
 * The options are labelled in the language of the UI, but the selected value is always the theme
 * slug, since that is what is stored in the url and indexed in elasticsearch. See ARC-3797.
 */
export const ThemeSelect: FC<ReactSelectProps> = (props) => {
	const { options } = useGetThemeFilterOptions();

	const getPlaceholder = (): string | undefined => {
		return options.length === 0
			? tText('modules/visitor-space/components/theme-select/theme-select___geen-themas-gevonden')
			: tText('modules/visitor-space/components/theme-select/theme-select___kies-een-thema');
	};

	return <ReactSelect {...props} placeholder={getPlaceholder()} options={options} />;
};
