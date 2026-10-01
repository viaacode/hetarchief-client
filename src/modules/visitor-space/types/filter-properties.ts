import { IeObjectsSearchOperator } from '@shared/types/ie-objects';

export const FILTER_LABEL_VALUE_DELIMITER = '---';

export const isRange = (op?: string): boolean => op === IeObjectsSearchOperator.BETWEEN;
