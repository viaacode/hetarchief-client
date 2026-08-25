import { GroupName } from '@account/const';
import {
	IeObjectsSearchFilterField,
	IeObjectsSearchOperator,
	SearchPageMediaType,
} from '@shared/types/ie-objects';
import { getAdvancedProperties, getOperators } from '@visitor-space/utils/advanced-filters';
import { describe, expect, it } from 'vitest';
import { FilterProperty, Operator } from '../types';
import { getMetadataSearchFilters } from './advanced-filters.consts';

describe('advanced filters config', () => {
	it('should expose rights as an advanced filter with is and is-not operators', () => {
		expect(getAdvancedProperties().map(({ value }) => value)).toContain(FilterProperty.RIGHTS);
		expect(getOperators(FilterProperty.RIGHTS).map(({ value }) => value)).toEqual([
			Operator.EQUALS,
			Operator.EQUALS_NOT,
		]);
		expect(getMetadataSearchFilters(FilterProperty.RIGHTS, Operator.EQUALS)).toEqual([
			{
				field: IeObjectsSearchFilterField.RIGHTS,
				operator: IeObjectsSearchOperator.IS,
			},
		]);
		expect(getMetadataSearchFilters(FilterProperty.RIGHTS, Operator.EQUALS_NOT)).toEqual([
			{
				field: IeObjectsSearchFilterField.RIGHTS,
				operator: IeObjectsSearchOperator.IS_NOT,
			},
		]);
	});

	it('should expose theme as an advanced filter with is and is-not operators', () => {
		expect(getAdvancedProperties().map(({ value }) => value)).toContain(FilterProperty.THEME);
		expect(getOperators(FilterProperty.THEME).map(({ value }) => value)).toEqual([
			Operator.EQUALS,
			Operator.EQUALS_NOT,
		]);
		expect(getMetadataSearchFilters(FilterProperty.THEME, Operator.EQUALS)).toEqual([
			{
				field: IeObjectsSearchFilterField.THEME,
				operator: IeObjectsSearchOperator.IS,
			},
		]);
		expect(getMetadataSearchFilters(FilterProperty.THEME, Operator.EQUALS_NOT)).toEqual([
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
			).toContain(FilterProperty.THEME);
		}
	);

	it('should offer the theme property to anonymous visitors', () => {
		expect(
			getAdvancedProperties({
				selectedTab: SearchPageMediaType.All,
				userGroup: GroupName.ANONYMOUS,
			}).map(({ value }) => value)
		).toContain(FilterProperty.THEME);
	});

	it('should not offer the theme property on the newspaper tab', () => {
		expect(
			getAdvancedProperties({
				selectedTab: SearchPageMediaType.Newspaper,
				userGroup: GroupName.VISITOR,
			}).map(({ value }) => value)
		).not.toContain(FilterProperty.THEME);
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
		).not.toContain(FilterProperty.THEME);
	});

	it.each([SearchPageMediaType.All, SearchPageMediaType.Video, SearchPageMediaType.Audio])(
		'should offer the duration property on the %s tab',
		(selectedTab) => {
			expect(
				getAdvancedProperties({ selectedTab, userGroup: GroupName.VISITOR }).map(
					({ value }) => value
				)
			).toContain(FilterProperty.DURATION);
		}
	);

	it('should not offer the duration property on the newspaper tab', () => {
		expect(
			getAdvancedProperties({
				selectedTab: SearchPageMediaType.Newspaper,
				userGroup: GroupName.VISITOR,
			}).map(({ value }) => value)
		).not.toContain(FilterProperty.DURATION);
	});

	it('should still offer the duration property to kiosk users outside the newspaper tab', () => {
		expect(
			getAdvancedProperties({
				selectedTab: SearchPageMediaType.Video,
				userGroup: GroupName.KIOSK_VISITOR,
			}).map(({ value }) => value)
		).toContain(FilterProperty.DURATION);
	});

	it('should keep properties without an isVisible rule available to everybody, on every tab', () => {
		expect(
			getAdvancedProperties({
				selectedTab: SearchPageMediaType.Newspaper,
				userGroup: GroupName.KIOSK_VISITOR,
			}).map(({ value }) => value)
		).toContain(FilterProperty.RIGHTS);
	});

	it('should leave nothing out when called without a context, so applied filters keep their label', () => {
		// mapAdvancedToTags() relies on this to label a theme filter that is already in the url
		expect(getAdvancedProperties().map(({ value }) => value)).toContain(FilterProperty.THEME);
	});
});
