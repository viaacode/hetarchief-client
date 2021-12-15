export const footerLinks = [
	{
		label: 'link',
		to: 'https://www.test.com',
		external: true,
	},
	{
		label: 'link',
		to: 'https://www.test.com',
	},
	{
		label: 'link',
		to: 'https://www.test.com',
	},
];

export const footerLeftItem = {
	label: 'Een initiatief van',
	image: {
		name: 'logo_meemoo.svg',
		alt: 'Meemoo logo',
		width: 104,
		height: 44,
	},
	link: {
		label: '',
		to: 'https://www.test.com',
		external: true,
	},
};

export const footerRightItem = {
	label: 'Gesteund door',
	image: {
		name: 'logo_vlaanderen.png',
		alt: 'Vlaanderen logo',
		width: 89,
		height: 39,
	},
	link: {
		label: '',
		to: 'https://www.test.com',
		external: true,
	},
};

export const footerFloatingActionButton = (
	<button
		onClick={() => {
			console.log('Te vervangen door button component');
		}}
	>
		Feedback
	</button>
);
