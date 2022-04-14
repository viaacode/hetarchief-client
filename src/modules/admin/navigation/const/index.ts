const NAVIGATION = 'navigatie';
const NAME = ':navigationName';

export const NAVIGATION_PATHS = {
	overview: `/${NAVIGATION}`,
	detail: `/${NAVIGATION}/${NAME}`,
	create: `/${NAVIGATION}/${NAME}/maak`,
	edit: `/${NAVIGATION}/${NAME}/bewerk`,
};

export const NAVIGATION_CONFIG = {
	views: {
		overview: {
			meta: {
				title: 'Navigatie - beheer',
				description: 'Navigatie overzicht beheerpagina',
			},
			labels: {
				pageTitle: 'Navigatie: overzicht',
				createButton: 'Navigatie toevoegen',
				tableHeads: {
					name: 'Naam',
					description: 'Beschrijving',
					actions: '',
				},
				tableActions: {
					add: {
						title: 'Voeg een navigatie-item toe aan deze navigatiebalk.',
					},
					view: {
						title: 'Bekijk de navigatie-items voor deze navigatiebalk',
					},
				},
			},
			error: {},
		},
		detail: {
			labels: {},
		},
		edit: {
			labels: {},
		},
	},
};
