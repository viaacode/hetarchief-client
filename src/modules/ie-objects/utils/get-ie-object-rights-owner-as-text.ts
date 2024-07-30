import { isString } from 'lodash-es';

import { type IeObject } from '@ie-objects/ie-objects.types';
import { tText } from '@shared/helpers/translate';

export function getIeObjectRightsOwnerAsText(ieObject: IeObject): string {
	try {
		if (isString(ieObject?.copyrightHolder)) {
			return ieObject.copyrightHolder;
		}

		if (Array.isArray(ieObject?.copyrightHolder)) {
			return (ieObject.copyrightHolder as string[]).join(', ');
		}

		return tText('onbekend');
	} catch (err) {
		return JSON.stringify(ieObject.creator).replaceAll(/[{}()"]+/, '');
	}
}
