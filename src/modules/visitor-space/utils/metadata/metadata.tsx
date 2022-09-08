import { sortBy } from 'lodash-es';

import { TranslationService } from '@shared/services/translation-service/transaltion-service';
import { Operator } from '@shared/types';

import { METADATA_CONFIG, MetadataFields } from '../../const';
import { MetadataProp, OperatorOptions, PropertyOptions } from '../../types';

export const getProperties = (): PropertyOptions => {
	return sortBy(
		Object.keys(METADATA_CONFIG()).map((key) => {
			return {
				label: getLabel(key as MetadataProp),
				value: key as MetadataProp,
			};
		}),
		(option) => option.label
	);
};

export const getOperators = (prop: MetadataProp): OperatorOptions => {
	const property = METADATA_CONFIG()[prop];

	if (property) {
		return Object.keys(property).map((key) => {
			return {
				label: property[key as Operator]?.label || '',
				value: key as Operator,
			};
		});
	}

	return [];
};

export const getField = (prop: MetadataProp, op: Operator): MetadataFields | null => {
	const property = METADATA_CONFIG()[prop];

	if (property && property[op]) {
		return property[op]?.field || null;
	}

	return null;
};

export const getLabel = (prop: MetadataProp): string => {
	return (
		{
			[MetadataProp.CreatedAt]: TranslationService.getTranslation(
				'modules/visitor-space/utils/metadata/metadata___creatiedatum'
			),
			[MetadataProp.Creator]: TranslationService.getTranslation(
				'modules/visitor-space/utils/metadata/metadata___maker'
			),
			[MetadataProp.Description]: TranslationService.getTranslation(
				'modules/visitor-space/utils/metadata/metadata___beschrijving'
			),
			[MetadataProp.Duration]: TranslationService.getTranslation(
				'modules/visitor-space/utils/metadata/metadata___duurtijd'
			),
			[MetadataProp.Era]: TranslationService.getTranslation(
				'modules/visitor-space/utils/metadata/metadata___tijdsperiode-van-de-inhoud'
			),
			[MetadataProp.Everything]: TranslationService.getTranslation(
				'modules/visitor-space/utils/metadata/metadata___alles'
			),
			[MetadataProp.Genre]: TranslationService.getTranslation(
				'modules/visitor-space/utils/metadata/metadata___genre'
			),
			[MetadataProp.Language]: TranslationService.getTranslation(
				'modules/visitor-space/utils/metadata/metadata___taal'
			),
			[MetadataProp.Location]: TranslationService.getTranslation(
				'modules/visitor-space/utils/metadata/metadata___locatie-van-de-inhoud'
			),
			[MetadataProp.Mediatype]: TranslationService.getTranslation(
				'modules/visitor-space/utils/metadata/metadata___bestandstype'
			),
			[MetadataProp.Medium]: TranslationService.getTranslation(
				'modules/visitor-space/utils/metadata/metadata___analoge-drager'
			),
			[MetadataProp.PublishedAt]: TranslationService.getTranslation(
				'modules/visitor-space/utils/metadata/metadata___publicatiedatum'
			),
			[MetadataProp.Publisher]: TranslationService.getTranslation(
				'modules/visitor-space/utils/metadata/metadata___publisher'
			),
			[MetadataProp.Title]: TranslationService.getTranslation(
				'modules/visitor-space/utils/metadata/metadata___titel'
			),
		}[prop] || ''
	);
};
