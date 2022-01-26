import { HeroProps, HeroRequest } from '../Hero.types';

export const heroTitle = 'Welkom in de digitale leeszaal';

export const heroDescription =
	'Plan een nieuw bezoek, stap fysiek binnen en krijg meteen toegang tot het digitale archief van de leeszaal. Benieuwd hoe het werkt?';

export const heroLink = {
	label: 'Hier kom je er alles over te weten.',
	to: 'https://www.test.com',
};

export const heroImage = { src: '/images/hero.png', alt: 'hero image' };

export const heroMock: HeroProps = {
	title: heroTitle,
	description: heroDescription,
	link: heroLink,
	image: heroImage,
};

export const heroRequests: HeroRequest[] = [
	// Access
	{
		description:
			'Het Sint-Felixpakhuis is één van de meest tot de verbeelding sprekende voorbeelden, van pakhuizen uit de 19e eeuw. In 1860 werd het gebouwd als…',
		id: 'felixarchief',
		image: '/images/bg-shd.png',
		logo: '/images/logo-shd--small.svg',
		name: 'FelixArchief',
		status: 'access',
	},
	{
		description:
			'Het Museum voor Schone Kunsten Gent (MSK) is het oudste museum in België. De kern van de collectie gaat terug tot 1798. Het museum is gehuisvest in een…',
		id: 'mskgent',
		image: '/images/bg-shd.png',
		logo: '/images/logo-shd--small.svg',
		name: 'MSK Gent',
		status: 'access',
	},
	// Planned
	{
		description: 'SBS Belgium biedt een brede en een unieke blik op het leven in Vlaanderen…',
		id: 'sbs',
		image: '/images/bg-shd.png',
		logo: '/images/logo-shd--small.svg',
		name: 'SBS Belgium-archief',
		status: 'planned',
	},
	{
		description:
			'hetpaleis is een podiumkunstenhuis voor alle kinderen en jongeren. Het werkt als een plein:…',
		id: 'hetpaleis',
		image: '/images/bg-shd.png',
		logo: '/images/logo-shd--small.svg',
		name: 'het paleis',
		status: 'planned',
	},
	// Requested
	{
		description:
			'Stadsarchief Brugge biedt een brede en een unieke blik op het leven in Brugge',
		id: 'stadsarchiefbrugge',
		image: '/images/bg-shd.png',
		logo: '/images/logo-shd--small.svg',
		name: 'Stadsarchief Brugge',
		status: 'requested',
	},
];
