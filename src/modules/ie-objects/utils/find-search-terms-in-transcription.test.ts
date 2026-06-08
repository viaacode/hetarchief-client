import { describe, expect, it } from 'vitest';
import { findSearchTermsInTranscription } from './find-search-terms-in-transcription';

describe('findSearchTermsInTranscription', () => {
	it('returns empty array when searchTerms is empty or undefined', () => {
		expect(findSearchTermsInTranscription(['some text'], [])).toEqual([]);
	});

	it('returns empty array when no matches are found', () => {
		expect(findSearchTermsInTranscription(['hello world'], ['banana'])).toEqual([]);
	});

	it('skips null and empty OCR pages safely', () => {
		expect(findSearchTermsInTranscription([null, '', 'hello world'], ['hello'])).toEqual([
			{
				pageIndex: 2,
				searchTerm: 'hello',
				searchTermCharacterOffset: 0,
				searchTermIndexOnPage: 0,
			},
		]);
	});

	it('finds multiple occurrences of a word on the same page', () => {
		expect(findSearchTermsInTranscription(['hello world hello'], ['hello'])).toEqual([
			{
				pageIndex: 0,
				searchTerm: 'hello',
				searchTermCharacterOffset: 0,
				searchTermIndexOnPage: 0,
			},
			{
				pageIndex: 0,
				searchTerm: 'hello',
				searchTermCharacterOffset: 12,
				searchTermIndexOnPage: 1,
			},
		]);
	});

	it('only matches word-boundary occurrences for non-literal terms', () => {
		expect(findSearchTermsInTranscription(['partial particle art'], ['art'])).toEqual([
			{
				pageIndex: 0,
				searchTerm: 'art',
				searchTermCharacterOffset: 17,
				searchTermIndexOnPage: 0,
			},
		]);
	});

	it('matches at beginning of word', () => {
		expect(findSearchTermsInTranscription(['article'], ['art'])).toEqual([
			{
				pageIndex: 0,
				searchTerm: 'art',
				searchTermCharacterOffset: 0,
				searchTermIndexOnPage: 0,
			},
		]);
	});

	it('matches at end of word', () => {
		expect(findSearchTermsInTranscription(['cart'], ['art'])).toEqual([
			{
				pageIndex: 0,
				searchTerm: 'art',
				searchTermCharacterOffset: 1,
				searchTermIndexOnPage: 0,
			},
		]);
	});

	it('matches full word', () => {
		expect(findSearchTermsInTranscription(['art'], ['art'])).toEqual([
			{
				pageIndex: 0,
				searchTerm: 'art',
				searchTermCharacterOffset: 0,
				searchTermIndexOnPage: 0,
			},
		]);
	});

	it('matches words next to punctuation', () => {
		expect(findSearchTermsInTranscription(['hello, world. (hello)'], ['hello'])).toEqual([
			{
				pageIndex: 0,
				searchTerm: 'hello',
				searchTermCharacterOffset: 0,
				searchTermIndexOnPage: 0,
			},
			{
				pageIndex: 0,
				searchTerm: 'hello',
				searchTermCharacterOffset: 15,
				searchTermIndexOnPage: 1,
			},
		]);
	});

	it('handles literal search terms ignoring word boundaries', () => {
		expect(
			findSearchTermsInTranscription(['find this sentence inside text'], ['"this sentence"'])
		).toEqual([
			{
				pageIndex: 0,
				searchTerm: 'this sentence',
				searchTermCharacterOffset: 5,
				searchTermIndexOnPage: 0,
			},
		]);
	});

	it('finds multiple literal matches', () => {
		expect(findSearchTermsInTranscription(['abcabcabc'], ['"abc"'])).toEqual([
			{
				pageIndex: 0,
				searchTerm: 'abc',
				searchTermCharacterOffset: 0,
				searchTermIndexOnPage: 0,
			},
			{
				pageIndex: 0,
				searchTerm: 'abc',
				searchTermCharacterOffset: 3,
				searchTermIndexOnPage: 1,
			},
			{
				pageIndex: 0,
				searchTerm: 'abc',
				searchTermCharacterOffset: 6,
				searchTermIndexOnPage: 2,
			},
		]);
	});

	it('finds overlapping literal matches', () => {
		expect(findSearchTermsInTranscription(['ababa'], ['"aba"'])).toEqual([
			{
				pageIndex: 0,
				searchTerm: 'aba',
				searchTermCharacterOffset: 0,
				searchTermIndexOnPage: 0,
			},
			{
				pageIndex: 0,
				searchTerm: 'aba',
				searchTermCharacterOffset: 2,
				searchTermIndexOnPage: 1,
			},
		]);
	});

	it('aggregates matches across multiple pages in deterministic order', () => {
		expect(findSearchTermsInTranscription(['alpha beta', 'beta alpha'], ['beta'])).toEqual([
			{
				pageIndex: 0,
				searchTerm: 'beta',
				searchTermCharacterOffset: 6,
				searchTermIndexOnPage: 0,
			},
			{
				pageIndex: 1,
				searchTerm: 'beta',
				searchTermCharacterOffset: 0,
				searchTermIndexOnPage: 0,
			},
		]);
	});

	it('resets searchTermIndexOnPage for each page', () => {
		expect(findSearchTermsInTranscription(['beta beta', 'beta beta'], ['beta'])).toEqual([
			{
				pageIndex: 0,
				searchTerm: 'beta',
				searchTermCharacterOffset: 0,
				searchTermIndexOnPage: 0,
			},
			{
				pageIndex: 0,
				searchTerm: 'beta',
				searchTermCharacterOffset: 5,
				searchTermIndexOnPage: 1,
			},
			{
				pageIndex: 1,
				searchTerm: 'beta',
				searchTermCharacterOffset: 0,
				searchTermIndexOnPage: 0,
			},
			{
				pageIndex: 1,
				searchTerm: 'beta',
				searchTermCharacterOffset: 5,
				searchTermIndexOnPage: 1,
			},
		]);
	});

	it('processes multiple search terms in input order', () => {
		expect(findSearchTermsInTranscription(['hello world', 'foo bar'], ['hello', 'bar'])).toEqual([
			{
				pageIndex: 0,
				searchTerm: 'hello',
				searchTermCharacterOffset: 0,
				searchTermIndexOnPage: 0,
			},
			{
				pageIndex: 1,
				searchTerm: 'bar',
				searchTermCharacterOffset: 4,
				searchTermIndexOnPage: 0,
			},
		]);
	});

	it('preserves grouping order of search terms', () => {
		const result = findSearchTermsInTranscription(['hello bar'], ['bar', 'hello']);

		expect(result).toEqual([
			{
				pageIndex: 0,
				searchTerm: 'bar',
				searchTermCharacterOffset: 6,
				searchTermIndexOnPage: 0,
			},
			{
				pageIndex: 0,
				searchTerm: 'hello',
				searchTermCharacterOffset: 0,
				searchTermIndexOnPage: 0,
			},
		]);
	});
});
