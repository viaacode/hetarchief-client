import type DOMPurify from 'isomorphic-dompurify';

// Inline formatting that every rich text field allows, whoever wrote the content.
const INLINE_TAGS = ['p', 'br', 'span', 'b', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'];

/**
 * Content written by an admin: translations, the site alert and the visitor space descriptions.
 * The tag list follows the toolbar of the rich text editor, so nothing an editor inserts
 * disappears on the public page.
 *
 * Admin-core has its own presets (SanitizePreset.basic/link/full). They are not reused here
 * because their sanitizeHtml returns the input unchanged during server side rendering, while
 * this app sanitizes on the server too.
 */
export const ADMIN_CONTENT_SANITIZATION: DOMPurify.Config = {
	ALLOWED_TAGS: [
		...INLINE_TAGS,
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		's',
		'sub',
		'sup',
		'hr',
		// A table needs its whole tag set. Without tbody/tr/th the browser keeps only the cell
		// text and the table falls apart into a list of lines. These are the tags the editor
		// writes; it never produces thead, tfoot or caption, not even for pasted html.
		'table',
		'colgroup',
		'col',
		'tbody',
		'tr',
		'th',
		'td',
	],
	RETURN_DOM: false,
	ADD_ATTR: ['target'], // Allow target _blank for links
};

/**
 * Content written by a visitor, e.g. a material request message. The editor toolbar limits what
 * can be typed, but the api stores whatever html it receives, so the tag list is the only real
 * limit. Keep it to inline formatting: no tables or headings that could break the layout of the
 * page that shows the message.
 */
export const USER_CONTENT_SANITIZATION: DOMPurify.Config = {
	ALLOWED_TAGS: INLINE_TAGS,
	RETURN_DOM: false,
	ADD_ATTR: ['target'], // Allow target _blank for links
};
