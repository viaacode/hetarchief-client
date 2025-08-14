import { compact, isString } from 'lodash-es';

import type { IeObject } from '@ie-objects/ie-objects.types';
import { tText } from '@shared/helpers/translate';

export function getIeObjectRightsOwnerAsText(ieObject: IeObject): string {
	try {
		if (isString(ieObject?.copyrightHolder) && ieObject?.copyrightHolder.trim().length > 0) {
			return ieObject.copyrightHolder;
		}

		if (Array.isArray(ieObject?.copyrightHolder) && compact(ieObject?.copyrightHolder).length > 0) {
			return (ieObject.copyrightHolder as string[]).join(', ');
		}

		return (
			ieObject.maintainerName ||
			tText('modules/ie-objects/utils/get-ie-object-rights-owner-as-text___onbekend')
		);
	} catch (err) {
		return JSON.stringify(ieObject.creator).replaceAll(/[{}()"]+/, '');
	}
}
