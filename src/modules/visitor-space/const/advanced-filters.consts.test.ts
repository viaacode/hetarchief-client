import { GroupName } from '@account/const';
import {
	IeObjectsSearchFilterField,
	IeObjectsSearchOperator,
	SearchPageMediaType,
} from '@shared/types/ie-objects';
import { getAdvancedProperties, getOperators } from '@visitor-space/utils/advanced-filters';
import { describe, expect, it } from 'vitest';
import { SearchFilterId } from '../types';
import { getMetadataSearchFilters } from './advanced-filters.consts';

describe('advanced filters config', () => {
	it('should expose rights as an advanced filter with is and is-not operators', () => {
		expect(getAdvancedProperties().map(({ value }) => value)).toContain(SearchFilterId.Rights);
		expect(getOperators(SearchFilterId.Rights).map(({ value }) => value)).toEqual([
			IeObjectsSearchOperator.IS,
			IeObjectsSearchOperator.IS_NOT,
		]);
		expect(getMetadataSearchFilters(SearchFilterId.Rights, IeObjectsSearchOperator.IS)).toEqual([
			{
				field: IeObjectsSearchFilterField.RIGHTS,
				operator: IeObjectsSearchOperator.IS,
			},
		]);
		expect(getMetadataSearchFilters(SearchFilterId.Rights, IeObjectsSearchOperator.IS_NOT)).toEqual(
			[
				{
					field: IeObjectsSearchFilterField.RIGHTS,
					operator: IeObjectsSearchOperator.IS_NOT,
				},
			]
		);
	});

	it('should expose theme as an advanced filter with is and is-not operators', () => {
		expect(getAdvancedProperties().map(({ value }) => value)).toContain(SearchFilterId.Theme);
		expect(getOperators(SearchFilterId.Theme).map(({ value }) => value)).toEqual([
			IeObjectsSearchOperator.IS,
			IeObjectsSearchOperator.IS_NOT,
		]);
		expect(getMetadataSearchFilters(SearchFilterId.Theme, IeObjectsSearchOperator.IS)).toEqual([
			{
				field: IeObjectsSearchFilterField.THEME,
				operator: IeObjectsSearchOperator.IS,
			},
		]);
		expect(getMetadataSearchFilters(SearchFilterId.Theme, IeObjectsSearchOperator.IS_NOT)).toEqual([
			{
				field: IeObjectsSearchFilterField.THEME,
				operator: IeObjectsSearchOperator.IS_NOT,
			},
		]);
	});

	it.each([SearchPageMediaType.All, SearchPageMediaType.Video, SearchPageMediaType.Audio])(
		'should offer the theme property on the %s tab',
		(selectedTab) => {
			expect(
				getAdvancedProperties({ selectedTab, userGroup: GroupName.VISITOR }).map(
					({ value }) => value
				)
			).toContain(SearchFilterId.Theme);
		}
	);

	it('should offer the theme property to anonymous visitors', () => {
		expect(
			getAdvancedProperties({
				selectedTab: SearchPageMediaType.All,
				userGroup: GroupName.ANONYMOUS,
			}).map(({ value }) => value)
		).toContain(SearchFilterId.Theme);
	});

	it('should not offer the theme property on the newspaper tab', () => {
		expect(
			getAdvancedProperties({
				selectedTab: SearchPageMediaType.Newspaper,
				userGroup: GroupName.VISITOR,
			}).map(({ value }) => value)
		).not.toContain(SearchFilterId.Theme);
	});

	it.each([
		SearchPageMediaType.All,
		SearchPageMediaType.Video,
		SearchPageMediaType.Audio,
		SearchPageMediaType.Newspaper,
	])('should not offer the theme property to kiosk users on the %s tab', (selectedTab) => {
		expect(
			getAdvancedProperties({ selectedTab, userGroup: GroupName.KIOSK_VISITOR }).map(
				({ value }) => value
			)
		).not.toContain(SearchFilterId.Theme);
	});

	it.each([SearchPageMediaType.All, SearchPageMediaType.Video, SearchPageMediaType.Audio])(
		'should offer the duration property on the %s tab',
		(selectedTab) => {
			expect(
				getAdvancedProperties({ selectedTab, userGroup: GroupName.VISITOR }).map(
					({ value }) => value
				)
			).toContain(SearchFilterId.Duration);
		}
	);

	it('should not offer the duration property on the newspaper tab', () => {
		expect(
			getAdvancedProperties({
				selectedTab: SearchPageMediaType.Newspaper,
				userGroup: GroupName.VISITOR,
			}).map(({ value }) => value)
		).not.toContain(SearchFilterId.Duration);
	});

	it('should still offer the duration property to kiosk users outside the newspaper tab', () => {
		expect(
			getAdvancedProperties({
				selectedTab: SearchPageMediaType.Video,
				userGroup: GroupName.KIOSK_VISITOR,
			}).map(({ value }) => value)
		).toContain(SearchFilterId.Duration);
	});

	it('should keep properties without an isVisible rule available to everybody, on every tab', () => {
		expect(
			getAdvancedProperties({
				selectedTab: SearchPageMediaType.Newspaper,
				userGroup: GroupName.KIOSK_VISITOR,
			}).map(({ value }) => value)
		).toContain(SearchFilterId.Rights);
	});

	it('should leave nothing out when called without a context, so applied filters keep their label', () => {
		// mapAdvancedToTags() relies on this to label a theme filter that is already in the url
		expect(getAdvancedProperties().map(({ value }) => value)).toContain(SearchFilterId.Theme);
	});
});

describe('text filter operators', () => {
	const operatorsOf = (id: SearchFilterId) => getOperators(id).map(({ value }) => value);

	const CONTAINS_PAIR = [IeObjectsSearchOperator.CONTAINS, IeObjectsSearchOperator.CONTAINS_NOT];
	const IS_PAIR = [IeObjectsSearchOperator.IS, IeObjectsSearchOperator.IS_NOT];

	it.each([
		SearchFilterId.Title,
		SearchFilterId.ObjectType,
		SearchFilterId.Keywords,
		SearchFilterId.Publisher,
		SearchFilterId.SpacialCoverage,
		SearchFilterId.TemporalCoverage,
	])('should offer all four operators on %s, in the order of the config', (id) => {
		expect(operatorsOf(id)).toEqual([...CONTAINS_PAIR, ...IS_PAIR]);
	});

	it('should offer the contains pair on description, which has no keyword subfield', () => {
		expect(operatorsOf(SearchFilterId.Description)).toEqual(CONTAINS_PAIR);
	});

	it('should offer the contains pair on cast, whose elasticsearch field is analysed only', () => {
		expect(operatorsOf(SearchFilterId.Cast)).toEqual(CONTAINS_PAIR);
	});

	it('should offer the is pair on identifier, which is matched whole', () => {
		expect(operatorsOf(SearchFilterId.Identifier)).toEqual(IS_PAIR);
	});
});
