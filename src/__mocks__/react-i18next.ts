export default jest.mock('react-i18next', () => ({
	Trans: (props: { i18nKey: string }) => props.i18nKey,
	useTranslation: () => {
		return {
			t: (str: string) => str,
		};
	},
}));
