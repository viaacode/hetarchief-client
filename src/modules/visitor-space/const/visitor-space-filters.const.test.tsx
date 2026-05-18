import { SearchPageMediaType } from '@shared/types/ie-objects';
import { describe, expect, it, vi } from 'vitest';

import { SearchFilterId } from '../types';

vi.mock('@visitor-space/components/AdvancedFilterForm/AdvancedFilterForm', () => ({
	AdvancedFilterForm: () => null,
}));
vi.mock('@visitor-space/components/ConsultableMediaFilterForm/ConsultableMediaFilterForm', () => ({
	ConsultableMediaFilterForm: () => null,
}));
vi.mock(
	'@visitor-space/components/ConsultableOnlyOnLocationFilterForm/ConsultableOnlyOnLocationFilterForm',
	() => ({
		ConsultableOnlyOnLocationFilterForm: () => null,
	})
);
vi.mock(
	'@visitor-space/components/ConsultablePublicDomainFilterForm/ConsultablePublicDomainFilterForm',
	() => ({
		ConsultablePublicDomainFilterForm: () => null,
	})
);
vi.mock('@visitor-space/components/CreatorFilterForm/CreatorFilterForm', () => ({
	CreatorFilterForm: () => null,
}));
vi.mock('@visitor-space/components/LocationCreatedFilterForm/LocationCreatedFilterForm', () => ({
	LocationCreatedFilterForm: () => null,
}));
vi.mock('@visitor-space/components/MaintainerFilterForm/MaintainerFilterForm', () => ({
	default: () => null,
}));
vi.mock('@visitor-space/components/MediumFilterForm', () => ({
	MediumFilterForm: () => null,
}));
vi.mock('@visitor-space/components/MentionsFilterForm/MentionsFilterForm', () => ({
	MentionsFilterForm: () => null,
}));
vi.mock(
	'@visitor-space/components/NewspaperSeriesNameFilterForm/NewspaperSeriesNameFilterForm',
	() => ({
		NewspaperSeriesNameFilterForm: () => null,
	})
);
vi.mock('@visitor-space/components/ReleaseDateFilterForm', () => ({
	ReleaseDateFilterForm: () => null,
}));
vi.mock('@visitor-space/components/ReusabilityFilterForm/ReusabilityFilterForm', () => ({
	default: () => null,
}));

import { SEARCH_PAGE_FILTERS } from './visitor-space-filters.const';

describe('SEARCH_PAGE_FILTERS', () => {
	it.each([
		{ isGlobalArchive: true, isKioskUser: false, isKeyUser: false },
		{ isGlobalArchive: true, isKioskUser: false, isKeyUser: true },
		{ isGlobalArchive: false, isKioskUser: true, isKeyUser: false },
	])(
		'should show the reusability filter for all users: %s',
		({ isGlobalArchive, isKioskUser, isKeyUser }) => {
			for (const tab of [
				SearchPageMediaType.All,
				SearchPageMediaType.Video,
				SearchPageMediaType.Audio,
				SearchPageMediaType.Newspaper,
			]) {
				const visibleFilters = SEARCH_PAGE_FILTERS(
					isGlobalArchive,
					isKioskUser,
					isKeyUser,
					tab
				).filter(({ isDisabled, tabs }) => !isDisabled?.() && tabs.includes(tab));

				expect(visibleFilters.map(({ id }) => id)).toContain(SearchFilterId.Reusability);
			}
		}
	);
});
