import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { getIconFromObjectType } from '@shared/components/MediaCard/MediaCard.consts';
import { IeObjectType } from '@shared/types/ie-objects';
import { describe, expect, it } from 'vitest';

describe('MediaCard consts', () => {
	describe('getIconFromObjectType', () => {
		it('should return video icon for accessible VIDEO', () => {
			expect(getIconFromObjectType(IeObjectType.VIDEO, true)).toBe(IconNamesLight.Video);
		});
		it('should return video icon for accessible FILM', () => {
			expect(getIconFromObjectType(IeObjectType.FILM, true)).toBe(IconNamesLight.Video);
		});
		it('should return video icon for accessible VIDEO_FRAGMENT', () => {
			expect(getIconFromObjectType(IeObjectType.VIDEO_FRAGMENT, true)).toBe(IconNamesLight.Video);
		});
		it('should return audio icon for accessible AUDIO', () => {
			expect(getIconFromObjectType(IeObjectType.AUDIO, true)).toBe(IconNamesLight.Audio);
		});
		it('should return audio icon for accessible AUDIO_FRAGMENT', () => {
			expect(getIconFromObjectType(IeObjectType.AUDIO_FRAGMENT, true)).toBe(IconNamesLight.Audio);
		});
		it('should return newspaper icon for accessible NEWSPAPER', () => {
			expect(getIconFromObjectType(IeObjectType.NEWSPAPER, true)).toBe(IconNamesLight.Newspaper);
		});
		it('should return newspaper icon for accessible NEWSPAPER_PAGE', () => {
			expect(getIconFromObjectType(IeObjectType.NEWSPAPER_PAGE, true)).toBe(
				IconNamesLight.Newspaper
			);
		});
		it('should return no video icon for inaccessible VIDEO', () => {
			expect(getIconFromObjectType(IeObjectType.VIDEO, false)).toBe(IconNamesLight.NoVideo);
		});
		it('should return no video icon for inaccessible FILM', () => {
			expect(getIconFromObjectType(IeObjectType.FILM, false)).toBe(IconNamesLight.NoVideo);
		});
		it('should return no video icon for inaccessible VIDEO_FRAGMENT', () => {
			expect(getIconFromObjectType(IeObjectType.VIDEO_FRAGMENT, false)).toBe(
				IconNamesLight.NoVideo
			);
		});
		it('should return no audio icon for inaccessible AUDIO', () => {
			expect(getIconFromObjectType(IeObjectType.AUDIO, false)).toBe(IconNamesLight.NoAudio);
		});
		it('should return no audio icon for inaccessible AUDIO_FRAGMENT', () => {
			expect(getIconFromObjectType(IeObjectType.AUDIO_FRAGMENT, false)).toBe(
				IconNamesLight.NoAudio
			);
		});
		it('should return no newspaper icon for inaccessible NEWSPAPER', () => {
			expect(getIconFromObjectType(IeObjectType.NEWSPAPER, false)).toBe(IconNamesLight.NoNewspaper);
		});
		it('should return no newspaper icon for inaccessible NEWSPAPER_PAGE', () => {
			expect(getIconFromObjectType(IeObjectType.NEWSPAPER_PAGE, false)).toBe(
				IconNamesLight.NoNewspaper
			);
		});
	});
});
