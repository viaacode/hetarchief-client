const ROOT = 'leeszalenbeheer';
const DETAIL = ':pageName';

export const READING_ROOMS_PATHS = {
	overview: `/${ROOT}`,
	leeszalen: `/${ROOT}/leeszalen`,
	aanvragen: `/${ROOT}/aanvragen`,
	bezoekers: `/${ROOT}/bezoekers`,
	create: `/${ROOT}/${DETAIL}/aanmaken`,
	edit: `/${ROOT}/${DETAIL}/bewerken`,
};
