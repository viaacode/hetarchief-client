// check-ie-object-permissions.test.ts

import { checkIeObjectPermissions } from './check-ie-object-permissions';

describe('checkIeObjectPermissions (hard-coded 64 cases)', () => {
	test('false, false, false, false, false, false => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, false, false, false, false, false);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('false, false, false, false, false, true => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, false, false, false, false, true);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('false, false, false, false, true, false => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, false, false, false, true, false);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('false, false, false, false, true, true => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, false, false, false, true, true);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('false, false, false, true, false, false => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, false, false, true, false, false);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('false, false, false, true, false, true => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, false, false, true, false, true);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('false, false, false, true, true, false => { canViewEssence: false, canExportMetadata: true, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, false, false, true, true, false);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: true,
			canDownloadEssence: false,
		});
	});
	test('false, false, false, true, true, true => { canViewEssence: false, canExportMetadata: true, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, false, false, true, true, true);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: true,
			canDownloadEssence: false,
		});
	});
	test('false, false, true, false, false, false => { canViewEssence: true, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, false, true, false, false, false);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('false, false, true, false, false, true => { canViewEssence: true, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, false, true, false, false, true);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('false, false, true, false, true, false => { canViewEssence: true, canExportMetadata: true, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, false, true, false, true, false);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: true,
			canDownloadEssence: false,
		});
	});
	test('false, false, true, false, true, true => { canViewEssence: true, canExportMetadata: true, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, false, true, false, true, true);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: true,
			canDownloadEssence: false,
		});
	});
	test('false, false, true, true, false, false => { canViewEssence: true, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, false, true, true, false, false);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('false, false, true, true, false, true => { canViewEssence: true, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, false, true, true, false, true);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('false, false, true, true, true, false => { canViewEssence: true, canExportMetadata: true, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, false, true, true, true, false);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: true,
			canDownloadEssence: false,
		});
	});
	test('false, false, true, true, true, true => { canViewEssence: true, canExportMetadata: true, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, false, true, true, true, true);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: true,
			canDownloadEssence: false,
		});
	});
	test('false, true, false, false, false, false => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, true, false, false, false, false);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('false, true, false, false, false, true => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, true, false, false, false, true);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('false, true, false, false, true, false => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, true, false, false, true, false);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('false, true, false, false, true, true => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, true, false, false, true, true);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('false, true, false, true, false, false => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, true, false, true, false, false);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('false, true, false, true, false, true => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, true, false, true, false, true);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('false, true, false, true, true, false => { canViewEssence: false, canExportMetadata: true, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, true, false, true, true, false);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: true,
			canDownloadEssence: false,
		});
	});
	test('false, true, false, true, true, true => { canViewEssence: false, canExportMetadata: true, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, true, false, true, true, true);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: true,
			canDownloadEssence: false,
		});
	});
	test('false, true, true, false, false, false => { canViewEssence: true, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, true, true, false, false, false);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('false, true, true, false, false, true => { canViewEssence: true, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, true, true, false, false, true);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('false, true, true, false, true, false => { canViewEssence: true, canExportMetadata: true, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, true, true, false, true, false);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: true,
			canDownloadEssence: false,
		});
	});
	test('false, true, true, false, true, true => { canViewEssence: true, canExportMetadata: true, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, true, true, false, true, true);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: true,
			canDownloadEssence: false,
		});
	});
	test('false, true, true, true, false, false => { canViewEssence: true, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, true, true, true, false, false);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('false, true, true, true, false, true => { canViewEssence: true, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, true, true, true, false, true);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('false, true, true, true, true, false => { canViewEssence: true, canExportMetadata: true, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, true, true, true, true, false);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: true,
			canDownloadEssence: false,
		});
	});
	test('false, true, true, true, true, true => { canViewEssence: true, canExportMetadata: true, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(false, true, true, true, true, true);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: true,
			canDownloadEssence: false,
		});
	});
	test('true, false, false, false, false, false => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, false, false, false, false, false);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('true, false, false, false, false, true => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, false, false, false, false, true);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('true, false, false, false, true, false => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, false, false, false, true, false);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('true, false, false, false, true, true => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, false, false, false, true, true);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('true, false, false, true, false, false => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, false, false, true, false, false);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('true, false, false, true, false, true => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, false, false, true, false, true);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('true, false, false, true, true, false => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, false, false, true, true, false);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('true, false, false, true, true, true => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, false, false, true, true, true);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('true, false, true, false, false, false => { canViewEssence: true, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, false, true, false, false, false);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('true, false, true, false, false, true => { canViewEssence: true, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, false, true, false, false, true);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('true, false, true, false, true, false => { canViewEssence: true, canExportMetadata: true, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, false, true, false, true, false);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: true,
			canDownloadEssence: false,
		});
	});
	test('true, false, true, false, true, true => { canViewEssence: true, canExportMetadata: true, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, false, true, false, true, true);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: true,
			canDownloadEssence: false,
		});
	});
	test('true, false, true, true, false, false => { canViewEssence: true, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, false, true, true, false, false);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('true, false, true, true, false, true => { canViewEssence: true, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, false, true, true, false, true);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('true, false, true, true, true, false => { canViewEssence: true, canExportMetadata: true, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, false, true, true, true, false);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: true,
			canDownloadEssence: false,
		});
	});
	test('true, false, true, true, true, true => { canViewEssence: true, canExportMetadata: true, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, false, true, true, true, true);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: true,
			canDownloadEssence: false,
		});
	});
	test('true, true, false, false, false, false => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, true, false, false, false, false);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('true, true, false, false, false, true => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, true, false, false, false, true);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('true, true, false, false, true, false => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, true, false, false, true, false);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('true, true, false, false, true, true => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, true, false, false, true, true);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('true, true, false, true, false, false => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, true, false, true, false, false);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('true, true, false, true, false, true => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, true, false, true, false, true);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('true, true, false, true, true, false => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, true, false, true, true, false);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('true, true, false, true, true, true => { canViewEssence: false, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, true, false, true, true, true);
		expect(result).toEqual({
			canViewEssence: false,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('true, true, true, false, false, false => { canViewEssence: true, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, true, true, false, false, false);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('true, true, true, false, false, true => { canViewEssence: true, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, true, true, false, false, true);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: true,
		});
	});
	test('true, true, true, false, true, false => { canViewEssence: true, canExportMetadata: true, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, true, true, false, true, false);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: true,
			canDownloadEssence: false,
		});
	});
	test('true, true, true, false, true, true => { canViewEssence: true, canExportMetadata: true, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, true, true, false, true, true);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: true,
			canDownloadEssence: true,
		});
	});
	test('true, true, true, true, false, false => { canViewEssence: true, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, true, true, true, false, false);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: false,
		});
	});
	test('true, true, true, true, false, true => { canViewEssence: true, canExportMetadata: false, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, true, true, true, false, true);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: false,
			canDownloadEssence: true,
		});
	});
	test('true, true, true, true, true, false => { canViewEssence: true, canExportMetadata: true, canDownloadEssence: false }', () => {
		const result = checkIeObjectPermissions(true, true, true, true, true, false);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: true,
			canDownloadEssence: false,
		});
	});
	test('true, true, true, true, true, true => { canViewEssence: true, canExportMetadata: true, canDownloadEssence: true }', () => {
		const result = checkIeObjectPermissions(true, true, true, true, true, true);
		expect(result).toEqual({
			canViewEssence: true,
			canExportMetadata: true,
			canDownloadEssence: true,
		});
	});
});
