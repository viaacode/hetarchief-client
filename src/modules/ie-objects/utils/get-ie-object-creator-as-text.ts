import { isString } from 'lodash-es';

import { type IeObject } from '@ie-objects/ie-objects.types';
import { tText } from '@shared/helpers/translate';

export function getIeObjectCreatorAsText(ieObject: IeObject): string {
	try {
		if (!ieObject?.creator) {
			return tText('onbekend');
		}

		if (isString(ieObject?.creator)) {
			return ieObject.creator;
		}

		if (Array.isArray(ieObject?.creator)) {
			return ieObject.creator.join(', ');
		}

		return Object.values(ieObject?.creator)
			.map((values) => {
				if (Array.isArray(values)) {
					return values.join(', ');
				}
				return values as string;
			})
			.join(', ');
	} catch (err) {
		return JSON.stringify(ieObject.creator).replaceAll(/[{}()"]+/, '');
	}
}
