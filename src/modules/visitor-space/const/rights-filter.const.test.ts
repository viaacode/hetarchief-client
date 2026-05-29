import { describe, expect, it } from 'vitest';

import { getRightsOptions, RightsLabel } from './rights-filter.const';

describe('getRightsOptions', () => {
	it('should narrow rights options to newspaper labels on the newspaper tab', () => {
		expect(
			getRightsOptions(
				[RightsLabel.PUBLIC_DOMAIN],
				[RightsLabel.PUBLIC_DOMAIN, RightsLabel.COPYRIGHT_UNDETERMINED]
			).map(({ value }) => value)
		).toEqual([RightsLabel.PUBLIC_DOMAIN, RightsLabel.COPYRIGHT_UNDETERMINED]);
	});

	it('should narrow rights options to the selected reusability category', () => {
		expect(
			getRightsOptions(
				[RightsLabel.CC_BY],
				[
					RightsLabel.NO_COPYRIGHT_CONTRACTUAL_RESTRICTIONS,
					RightsLabel.CC_BY,
					RightsLabel.CC_BY_NC_ND,
					RightsLabel.CC_BY_SA,
					RightsLabel.CC_BY_NC,
				]
			).map(({ value }) => value)
		).toEqual([
			RightsLabel.CC_BY,
			RightsLabel.NO_COPYRIGHT_CONTRACTUAL_RESTRICTIONS,
			RightsLabel.CC_BY_NC_ND,
			RightsLabel.CC_BY_SA,
			RightsLabel.CC_BY_NC,
		]);
	});
});
