import { VisitorSpaceInfo } from '@visitor-space/types';

export interface HeroRequest extends Partial<Omit<VisitorSpaceInfo, 'status'>> {
	status: 'access' | 'planned' | 'requested';
}

export const homeHeroRequests: HeroRequest[] = [
	// Access
	{
		info: 'Het Sint-Felixpakhuis is één van de meest tot de verbeelding sprekende voorbeelden, van pakhuizen uit de 19e eeuw. In 1860 werd het gebouwd als opslagplaats voor bulkgoederen als koffie, graan, kaas en tabak. De unieke binnenstraat werd na een vernietigende brand in 1862 aangelegd als brandgang bij de heropbouw van het pakhuis. In 1975 raakte het pand in onbruik. Sinds 1976 staat het opgelijst als beschermd monument.',
		id: 'felixarchief',
		image: '/images/bg-newsletter.png',
		logo: '/images/logo_meemoo_nl.svg',
		name: 'FelixArchief',
		status: 'access',
	},
	{
		info: 'Het Museum voor Schone Kunsten Gent (MSK) zoals we het vandaag kennen, werd ontworpen door stadsarchitect Charles Van Rysselberghe en van 1898 tot 1904 opgetrokken in een typische neoclassicistische stijl met art-nouveau-accenten. Het gebouw huisvest meer dan 600 kunstwerken: een wandeling door de Europese kunstgeschiedenis van de middeleeuwen tot vandaag.',
		id: 'mskgent',
		logo: '/images/logo_meemoo_nl.svg',
		name: 'MSK Gent',
		status: 'access',
	},
	// Planned
	{
		info: 'SBS is de zendergroep achter GoPlay.be, Play4, Play5, Play6, Play7. Daarnaast heeft SBS ook de Telenet-zenders Play Sports & Play Sports Open, BBC First, The History Channel en njam! in regie. Sinds 2018 maakt ook radiozender NRJ deel uit van de SBS-groep en eind 2019 trad Native Nation toe tot de SBS-familie. Naast onze klassieke tv spots en het online video aanbod behoort influencer marketing nu ook tot de mogelijkheden. Sinds 2020 vervolledigt multifplatform brand Jani het rijtje. SBS Belgium maakt deel uit van de Telenet/Liberty Global groep.',
		id: 'sbs',
		color: '#2BB0C8',
		logo: '/images/logo_meemoo_nl.svg',
		name: 'SBS Belgium-archief',
		status: 'planned',
	},
	{
		info: 'hetpaleis is een podiumkunstenhuis voor jong publiek. Het stimuleert kinderen in hun kunstbeleving: als toeschouwer, als gesprekspartner, als deelnemer, als jonge artiest. hetpaleis is een stadstheater. Het richt zich tot een breed stedelijk publiek, omarmt diversiteit in al zijn hoedanigheden en zet in op gemeenschapsvorming. ',
		id: 'hetpaleis',
		image: '/images/bg-newsletter.png',
		logo: '/images/logo_meemoo_nl.svg',
		name: 'het paleis',
		status: 'planned',
	},
	// Requested
	{
		info: 'Het Stadsarchief van Brugge is één van de belangrijkste stedelijke archiefdepots van Europa. Het stedelijk archief, de eeuwenlang bewaarde documenten van het stadsbestuur, is de belangrijkste bron voor de Brugse geschiedenis. Dit uniek bestand krijgt nog regelmatig aanvulling, ook met privé-archieven.',
		id: 'stadsarchiefbrugge',
		image: '/images/bg-newsletter.png',
		logo: '/images/logo_meemoo_nl.svg',
		name: 'Stadsarchief Brugge',
		status: 'requested',
	},
	{
		info: 'Het Stadsarchief van Brugge is één van de belangrijkste stedelijke archiefdepots van Europa. Het stedelijk archief, de eeuwenlang bewaarde documenten van het stadsbestuur, is de belangrijkste bron voor de Brugse geschiedenis. Dit uniek bestand krijgt nog regelmatig aanvulling, ook met privé-archieven.',
		id: 'stadsarchiefbrugge',
		color: '#727272',
		logo: '/images/logo_meemoo_nl.svg',
		name: 'Stadsarchief Brugge',
		status: 'requested',
	},
];
