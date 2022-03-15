import { METADATA_OPERATOR_MAP, MetadataProp } from '@reading-room/components';
import { OperatorOptions } from '@reading-room/types';

export const getOperators = (prop: MetadataProp): OperatorOptions =>
	(METADATA_OPERATOR_MAP[prop] ?? (() => []))();
