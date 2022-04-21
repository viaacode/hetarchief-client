export default jest.mock('react-i18next', () => ({
	Trans: (props: any) => props.i18nKey as string,
	useTranslation: () => {
		return {
			t: (str: string) => str,
		};
	},
}));
