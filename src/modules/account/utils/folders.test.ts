import { FolderSortOption } from '@account/const';
import type { Folder } from '@account/types';
import { describe, expect, it } from 'vitest';
import { getOrganisationFolders, getPersonalFolders, sortFolders } from './folders';

const makeFolder = (partial: Partial<Folder>): Folder => ({
	id: partial.name || 'id',
	name: 'name',
	isDefault: false,
	createdAt: '2026-01-01T00:00:00',
	updatedAt: '2026-01-01T00:00:00',
	userProfileId: 'profile-id',
	ownerOrganisationId: null,
	usedForLimitedAccessUntil: null,
	...partial,
});

const favorites = makeFolder({ name: 'Favorieten', isDefault: true, createdAt: '2020-01-01' });
const zebra = makeFolder({ name: 'zebra', createdAt: '2026-03-01' });
const apple = makeFolder({ name: 'Apple', createdAt: '2026-01-01' });
const map10 = makeFolder({ name: 'map 10', createdAt: '2026-02-01' });
const map2 = makeFolder({ name: 'map 2', createdAt: '2026-04-01' });
const folders = [zebra, favorites, map10, apple, map2];

const names = (list: Folder[]) => list.map((folder) => folder.name);

describe('folder utils', () => {
	describe('sortFolders', () => {
		it('sorts newest first by default and keeps favorites on top', () => {
			expect(names(sortFolders(folders))).toEqual([
				'Favorieten',
				'map 2',
				'zebra',
				'map 10',
				'Apple',
			]);
		});

		it('sorts oldest first', () => {
			expect(names(sortFolders(folders, FolderSortOption.OLDEST_FIRST))).toEqual([
				'Favorieten',
				'Apple',
				'map 10',
				'zebra',
				'map 2',
			]);
		});

		it('sorts alphabetically, case insensitive and with natural number order', () => {
			expect(names(sortFolders(folders, FolderSortOption.NAME_ASC))).toEqual([
				'Favorieten',
				'Apple',
				'map 2',
				'map 10',
				'zebra',
			]);
			expect(names(sortFolders(folders, FolderSortOption.NAME_DESC))).toEqual([
				'Favorieten',
				'zebra',
				'map 10',
				'map 2',
				'Apple',
			]);
		});

		it('keeps multiple default folders on top', () => {
			const secondDefault = makeFolder({ name: 'Andere favorieten', isDefault: true });
			expect(
				names(sortFolders([apple, favorites, secondDefault], FolderSortOption.NAME_ASC))
			).toEqual(['Favorieten', 'Andere favorieten', 'Apple']);
		});

		it('handles empty input', () => {
			expect(sortFolders(undefined)).toEqual([]);
		});
	});

	describe('getPersonalFolders / getOrganisationFolders', () => {
		const organisationFolder = makeFolder({
			name: 'Organisatiemap',
			userProfileId: null,
			ownerOrganisationId: 'OR-rf5kf25',
		});

		it('splits personal and organisation folders', () => {
			expect(getPersonalFolders([apple, organisationFolder])).toEqual([apple]);
			expect(getOrganisationFolders([apple, organisationFolder])).toEqual([organisationFolder]);
			expect(getPersonalFolders(null)).toEqual([]);
		});
	});
});
