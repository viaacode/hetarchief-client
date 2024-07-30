import { type IeObject, IeObjectLicense } from '@ie-objects/ie-objects.types';
import { tText } from '@shared/helpers/translate';

export function getIeObjectRightsStatusAsString(ieObject: IeObject): string {
	if (ieObject.licenses.includes(IeObjectLicense.COPYRIGHT_UNDETERMINED)) {
		return tText('Copyright undetermined');
	}
	if (ieObject.licenses.includes(IeObjectLicense.PUBLIC_DOMAIN)) {
		return tText('Public domein');
	}
	return '';
}
