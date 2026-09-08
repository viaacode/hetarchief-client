import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { getIconFromObjectType } from '@shared/components/MediaCard/MediaCard.consts';
import { HetArchiefIeObjectType } from '@viaa/avo2-types';
import { describe, expect, it } from 'vitest';

describe('MediaCard consts', () => {
	describe('getIconFromObjectType', () => {
		it('should return video icon for accessible VIDEO', () => {
			expect(getIconFromObjectType(HetArchiefIeObjectType.VIDEO, true)).toBe(IconNamesLight.Video);
		});
		it('should return video icon for accessible FILM', () => {
			expect(getIconFromObjectType(HetArchiefIeObjectType.FILM, true)).toBe(IconNamesLight.Video);
		});
		it('should return video icon for accessible VIDEO_FRAGMENT', () => {
			expect(getIconFromObjectType(HetArchiefIeObjectType.VIDEO_FRAGMENT, true)).toBe(
				IconNamesLight.Video
			);
		});
		it('should return audio icon for accessible AUDIO', () => {
			expect(getIconFromObjectType(HetArchiefIeObjectType.AUDIO, true)).toBe(IconNamesLight.Audio);
		});
		it('should return audio icon for accessible AUDIO_FRAGMENT', () => {
			expect(getIconFromObjectType(HetArchiefIeObjectType.AUDIO_FRAGMENT, true)).toBe(
				IconNamesLight.Audio
			);
		});
		it('should return newspaper icon for accessible NEWSPAPER', () => {
			expect(getIconFromObjectType(HetArchiefIeObjectType.NEWSPAPER, true)).toBe(
				IconNamesLight.Newspaper
			);
		});
		it('should return newspaper icon for accessible NEWSPAPER_PAGE', () => {
			expect(getIconFromObjectType(HetArchiefIeObjectType.NEWSPAPER_PAGE, true)).toBe(
				IconNamesLight.Newspaper
			);
		});
		it('should return no video icon for inaccessible VIDEO', () => {
			expect(getIconFromObjectType(HetArchiefIeObjectType.VIDEO, false)).toBe(
				IconNamesLight.NoVideo
			);
		});
		it('should return no video icon for inaccessible FILM', () => {
			expect(getIconFromObjectType(HetArchiefIeObjectType.FILM, false)).toBe(
				IconNamesLight.NoVideo
			);
		});
		it('should return no video icon for inaccessible VIDEO_FRAGMENT', () => {
			expect(getIconFromObjectType(HetArchiefIeObjectType.VIDEO_FRAGMENT, false)).toBe(
				IconNamesLight.NoVideo
			);
		});
		it('should return no audio icon for inaccessible AUDIO', () => {
			expect(getIconFromObjectType(HetArchiefIeObjectType.AUDIO, false)).toBe(
				IconNamesLight.NoAudio
			);
		});
		it('should return no audio icon for inaccessible AUDIO_FRAGMENT', () => {
			expect(getIconFromObjectType(HetArchiefIeObjectType.AUDIO_FRAGMENT, false)).toBe(
				IconNamesLight.NoAudio
			);
		});
		it('should return no newspaper icon for inaccessible NEWSPAPER', () => {
			expect(getIconFromObjectType(HetArchiefIeObjectType.NEWSPAPER, false)).toBe(
				IconNamesLight.NoNewspaper
			);
		});
		it('should return no newspaper icon for inaccessible NEWSPAPER_PAGE', () => {
			expect(getIconFromObjectType(HetArchiefIeObjectType.NEWSPAPER_PAGE, false)).toBe(
				IconNamesLight.NoNewspaper
			);
		});

		it('should fall back to the generic file icon when there is no object type', () => {
			expect(getIconFromObjectType(undefined, true)).toBe(IconNamesLight.File);
			expect(getIconFromObjectType(null, true)).toBe(IconNamesLight.File);
		});
		it('should fall back to the generic no-file icon when there is no object type and no access', () => {
			expect(getIconFromObjectType(undefined, false)).toBe(IconNamesLight.NoFile);
			expect(getIconFromObjectType(null, false)).toBe(IconNamesLight.NoFile);
		});
	});
});
