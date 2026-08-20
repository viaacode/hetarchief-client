import { ADMIN_CONTENT_SANITIZATION, USER_CONTENT_SANITIZATION } from '@shared/const';
import DOMPurify from 'isomorphic-dompurify';
import { describe, expect, it } from 'vitest';

// The shape the editor writes: no thead, the header row is a th inside the tbody
const TABLE = '<table><tbody><tr><th>Dag</th></tr><tr><td>Maandag</td></tr></tbody></table>';
const HOSTILE =
	'<script>alert(1)</script><img src="x" onerror="alert(1)"><p onclick="alert(1)">text</p>';

describe('ADMIN_CONTENT_SANITIZATION', () => {
	it('keeps a table with all of its structure', () => {
		expect(DOMPurify.sanitize(TABLE, ADMIN_CONTENT_SANITIZATION)).toBe(TABLE);
	});

	it('keeps the formatting the rich text editor can produce', () => {
		const html = '<h2>Title</h2><p><s>s</s><sub>1</sub><sup>2</sup></p><hr>';

		expect(DOMPurify.sanitize(html, ADMIN_CONTENT_SANITIZATION)).toBe(html);
	});

	it('removes scripts, images and event handlers', () => {
		expect(DOMPurify.sanitize(HOSTILE, ADMIN_CONTENT_SANITIZATION)).toBe('<p>text</p>');
	});
});

describe('USER_CONTENT_SANITIZATION', () => {
	it('keeps inline formatting and links that open in a new tab', () => {
		const html =
			'<p><b>b</b><em>e</em><u>u</u></p><ul><li><a href="#" target="_blank">link</a></li></ul>';

		expect(DOMPurify.sanitize(html, USER_CONTENT_SANITIZATION)).toBe(html);
	});

	it('drops the table structure', () => {
		const sanitized = DOMPurify.sanitize(TABLE, USER_CONTENT_SANITIZATION);

		expect(sanitized).not.toContain('<table');
		expect(sanitized).toBe('DagMaandag');
	});

	it('removes scripts, images and event handlers', () => {
		expect(DOMPurify.sanitize(HOSTILE, USER_CONTENT_SANITIZATION)).toBe('<p>text</p>');
	});
});
