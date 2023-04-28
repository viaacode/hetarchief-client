import { sortBy } from 'lodash-es';

import { tText } from '@shared/helpers/translate';
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
			[MetadataProp.CreatedAt]: tText(
				'modules/visitor-space/utils/metadata/metadata___creatiedatum'
			),
			[MetadataProp.Creator]: tText('modules/visitor-space/utils/metadata/metadata___maker'),
			[MetadataProp.Description]: tText(
				'modules/visitor-space/utils/metadata/metadata___beschrijving'
			),
			[MetadataProp.Duration]: tText(
				'modules/visitor-space/utils/metadata/metadata___duurtijd'
			),
			[MetadataProp.Everything]: tText(
				'modules/visitor-space/utils/metadata/metadata___alles'
			),
			[MetadataProp.Genre]: tText('modules/visitor-space/utils/metadata/metadata___genre'),
			[MetadataProp.Language]: tText('modules/visitor-space/utils/metadata/metadata___taal'),
			[MetadataProp.Mediatype]: tText(
				'modules/visitor-space/utils/metadata/metadata___bestandstype'
			),
			[MetadataProp.Medium]: tText(
				'modules/visitor-space/utils/metadata/metadata___analoge-drager'
			),
			[MetadataProp.PublishedAt]: tText(
				'modules/visitor-space/utils/metadata/metadata___publicatiedatum'
			),
			[MetadataProp.Publisher]: tText(
				'modules/visitor-space/utils/metadata/metadata___publisher'
			),
			[MetadataProp.Title]: tText('modules/visitor-space/utils/metadata/metadata___titel'),
			[MetadataProp.Identifier]: tText(
				'modules/visitor-space/utils/metadata/metadata___identifier'
			),
			[MetadataProp.Cast]: tText('modules/visitor-space/utils/metadata/metadata___cast'),
			[MetadataProp.SpacialCoverage]: tText(
				'modules/visitor-space/utils/metadata/metadata___locatie-van-de-inhoud'
			),
			[MetadataProp.TemporalCoverage]: tText(
				'modules/visitor-space/utils/metadata/metadata___tijdsperiode-van-de-inhoud'
			),
			[MetadataProp.ObjectType]: tText(
				'modules/visitor-space/utils/metadata/metadata___object-type'
			),
			[MetadataProp.Keywords]: tText(
				'modules/visitor-space/utils/metadata/metadata___trefwoord'
			),
		}[prop] || ''
	);
};
