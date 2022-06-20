import DOMPurify from 'dompurify';

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
	],
	RETURN_DOM: false,
	ADD_ATTR: ['target'], // Allow target _blank for links
};
