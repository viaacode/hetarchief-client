import { HeroProps } from '../Hero.types';

export const heroTitle = 'Welkom in de digitale leeszaal';

export const heroDescription =
	'Plan een nieuw bezoek, stap fysiek binnen en krijg meteen toegang tot het digitale archief van de leeszaal. Benieuwd hoe het werkt?';

export const heroLink = {
	label: 'Hier kom je er alles over te weten.',
	to: 'https://www.test.com',
};

export const heroImage = { name: 'hero.png', alt: 'hero image' };

export const heroMock: HeroProps = {
	title: heroTitle,
	description: heroDescription,
	link: heroLink,
	image: heroImage,
};
