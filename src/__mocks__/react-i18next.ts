import { TransProps } from 'react-i18next';

export default jest.mock('react-i18next', () => ({
	Trans: (props: TransProps<'ns'>) => props.i18nKey as string,
	useTranslation: () => {
		return {
			t: (str: string) => str,
		};
	},
}));
