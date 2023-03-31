import { extractSnippetBySearchTerm } from '@ie-objects/utils/extract-snippet-by-search-term';

describe('Extract snippet by search term', () => {
	it('should return start of full text if searchterm is not found', () => {
		expect(
			extractSnippetBySearchTerm(
				'This is a long piece of text and it has multiple words in it',
				['does not exist'],
				40
			)
		).toBe('This is a long piece of text and it h...');
	});

	it('should return start of full text if searchterm is at the beginning', () => {
		expect(
			extractSnippetBySearchTerm(
				'This is a long piece of text and it has multiple words in it',
				['This is a long piece'],
				40
			)
		).toBe('This is a long piece of text and it h...');
	});

	it('should return start of full text if searchterm is at the beginning and longer than the snippet length', () => {
		expect(
			extractSnippetBySearchTerm(
				'This is a long piece of text and it has multiple words in it',
				['This is a long piece of text and it has multiple words in'],
				40
			)
		).toBe('This is a long piece of text and it h...');
	});

	it('should return text around the search term', () => {
		expect(
			extractSnippetBySearchTerm(
				'This is a long piece of text and it has multiple words in it',
				['long piece of text'],
				40
			)
		).toBe('This is a long piece of text and it h...');
	});

	it('should return text around the search term if searchterm is at the end', () => {
		expect(
			extractSnippetBySearchTerm(
				'This is a long piece of text and it has multiple words in it',
				['has multiple words in it'],
				40
			)
		).toBe('... of text and it has multiple words in it');
	});

	it('should return text around the search term if searchterm is almost at the end', () => {
		expect(
			extractSnippetBySearchTerm(
				'This is a long piece of text and it has multiple words in it',
				['multiple words in'],
				40
			)
		).toBe('... of text and it has multiple words in it');
	});

	it('should return text around the first found search term', () => {
		expect(
			extractSnippetBySearchTerm(
				'This is a long piece of text and it has multiple words in it',
				['long piece of text', 'a long'],
				40
			)
		).toBe('This is a long piece of text and it h...');
	});

	it('should return text around the search term if searchterm is almost at the end', () => {
		expect(
			extractSnippetBySearchTerm(
				'This is a long piece of text and it has multiple words in it',
				['multiple words in', 'words in'],
				40
			)
		).toBe('... of text and it has multiple words in it');
	});

	it('should return text around the search term if searchterm is lowercase and text is uppercase', () => {
		expect(
			extractSnippetBySearchTerm(
				'This is a Long Piece of Text and it has Multiple Words in it',
				['multiple words in', 'words in it'],
				40
			)
		).toBe('... of Text and it has Multiple Words in it');
	});

	it('should return beginning of text with capitals intact if search term is not found', () => {
		expect(
			extractSnippetBySearchTerm(
				'This is a Long Piece of Text and it has Multiple Words in it',
				['NOT FOUND'],
				40
			)
		).toBe('This is a Long Piece of Text and it h...');
	});
});
