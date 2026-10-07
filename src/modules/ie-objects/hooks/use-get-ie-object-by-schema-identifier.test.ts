import { QUERY_KEYS } from '@shared/const/query-keys';
import { QueryClient } from '@tanstack/react-query';
import type { HetArchiefIeObject } from '@viaa/avo2-types';
import { describe, expect, it } from 'vitest';
import {
	isServerSideIeObject,
	setServerSideIeObjectInfo,
} from './use-get-ie-object-by-schema-identifier';

const ieObject = { schemaIdentifier: 'qs6d5p9579' } as HetArchiefIeObject;

describe('isServerSideIeObject', () => {
	it('flags an object that was seeded for server side rendering', () => {
		const queryClient = new QueryClient();
		setServerSideIeObjectInfo(queryClient, 'qs6d5p9579', ieObject);

		const cached = queryClient.getQueryData<HetArchiefIeObject>([
			QUERY_KEYS.getIeObjectsInfo,
			'qs6d5p9579',
		]);
		expect(isServerSideIeObject(cached)).toBe(true);
		expect(isServerSideIeObject(ieObject)).toBe(false);
	});

	it('is false for a missing object', () => {
		expect(isServerSideIeObject(null)).toBe(false);
		expect(isServerSideIeObject(undefined)).toBe(false);
	});
});
