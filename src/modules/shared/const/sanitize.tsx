import type DOMPurify from 'isomorphic-dompurify';

export const RICH_TEXT_SANITIZATION: DOMPurify.Config = {
	ALLOWED_TAGS: [
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'b',
		'strong',
		'p',
		'span',
		'br',
		'li',
		'ul',
		'ol',
		'a',
		'em',
		'u',
		// A table needs its whole tag set. Without thead/tbody/th the browser keeps only the
		// cell text and the table falls apart into a list of lines.
		'table',
		'caption',
		'colgroup',
		'col',
		'thead',
		'tbody',
		'tfoot',
		'tr',
		'th',
		'td',
	],
	RETURN_DOM: false,
	ADD_ATTR: ['target'], // Allow target _blank for links
};
