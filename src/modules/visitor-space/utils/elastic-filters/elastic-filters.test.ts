import { IeObjectsSearchFilterField, IeObjectsSearchOperator } from '@shared/types/ie-objects';
import type { SearchPageQueryParams } from '@visitor-space/const';
import { FILTER_LABEL_VALUE_DELIMITER, SearchFilterId } from '@visitor-space/types';
import { describe, expect, it } from 'vitest';

import { mapFiltersToElastic } from './elastic-filters';

describe('mapFiltersToElastic()', () => {
	it('should map reusability query params to the proxy filter contract', () => {
		const filters = mapFiltersToElastic({
			[SearchFilterId.Reusability]: [
				`vrij-herbruikbaar${FILTER_LABEL_VALUE_DELIMITER}Vrij herbruikbaar`,
				`herbruikbaar-onder-voorwaarden${FILTER_LABEL_VALUE_DELIMITER}Herbruikbaar onder voorwaarden`,
				`misschien-herbruikbaar${FILTER_LABEL_VALUE_DELIMITER}Misschien herbruikbaar`,
			],
		} as SearchPageQueryParams);

		expect(filters.find(({ field }) => field === IeObjectsSearchFilterField.REUSABILITY)).toEqual({
			field: IeObjectsSearchFilterField.REUSABILITY,
			operator: IeObjectsSearchOperator.IS,
			multiValue: ['vrij-herbruikbaar', 'herbruikbaar-onder-voorwaarden', 'misschien-herbruikbaar'],
		});
	});
});
