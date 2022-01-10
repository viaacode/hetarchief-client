export const HET_ARCHIEF_PAGE_TITLE = 'Het Archief';

export const createPageTitle = (title?: string): string => {
	if (!title) {
		// TODO: add to translations
		return HET_ARCHIEF_PAGE_TITLE;
	}

	// TODO: add to translations
	return `${title} | ${HET_ARCHIEF_PAGE_TITLE}`;
};
