/**
 * Generates a preview-icons.html inside every icon font folder: a self-contained overview of every
 * ligature in that font, so a developer can see which icons exist and what to type to get them.
 *
 * The ligature names are read straight out of the font's GSUB table, and the font is embedded as
 * base64, so the page never goes stale and opens from the filesystem without a server.
 *
 * Run `npm run update-icon-preview-page` after dropping in new font files.
 */

const fs = require('node:fs');
const path = require('node:path');

const FONTS_DIR = path.join(__dirname, '..', 'public', 'fonts');
const OUTPUT_FILENAME = 'preview-icons.html';

const GSUB_LOOKUP_TYPE_LIGATURE = 4;
const GSUB_LOOKUP_TYPE_EXTENSION = 7;

/**
 * Reads the sfnt table directory: a uint16 table count at offset 4, followed by 16 byte records
 * (4 byte tag, 4 byte checksum, 4 byte offset, 4 byte length) starting at offset 12.
 */
function readTableDirectory(font) {
	const tableCount = font.readUInt16BE(4);
	const tables = {};

	for (let i = 0; i < tableCount; i++) {
		const record = 12 + i * 16;
		tables[font.toString('ascii', record, record + 4)] = {
			offset: font.readUInt32BE(record + 8),
			length: font.readUInt32BE(record + 12),
		};
	}

	return tables;
}

/**
 * Builds a glyph id -> unicode codepoint map, which lets us turn the glyph ids of a ligature's
 * components back into the characters a developer has to type.
 */
function readReverseCharacterMap(font, cmapOffset) {
	const subtableCount = font.readUInt16BE(cmapOffset + 2);
	const reverseMap = {};

	for (let i = 0; i < subtableCount; i++) {
		const record = cmapOffset + 4 + i * 8;
		const subtableOffset = cmapOffset + font.readUInt32BE(record + 4);
		const format = font.readUInt16BE(subtableOffset);

		if (format === 4) {
			readCharacterMapFormat4(font, subtableOffset, reverseMap);
		} else if (format === 12) {
			readCharacterMapFormat12(font, subtableOffset, reverseMap);
		}
	}

	return reverseMap;
}

/** Format 4: segment mapping to delta values, the standard format for codepoints within the BMP. */
function readCharacterMapFormat4(font, subtableOffset, reverseMap) {
	const segCountX2 = font.readUInt16BE(subtableOffset + 6);
	const endCodesOffset = subtableOffset + 14;
	const startCodesOffset = endCodesOffset + segCountX2 + 2; // + 2 skips the reservedPad field
	const deltasOffset = startCodesOffset + segCountX2;
	const rangeOffsetsOffset = deltasOffset + segCountX2;

	for (let segment = 0; segment < segCountX2 / 2; segment++) {
		const endCode = font.readUInt16BE(endCodesOffset + segment * 2);
		const startCode = font.readUInt16BE(startCodesOffset + segment * 2);
		const idDelta = font.readInt16BE(deltasOffset + segment * 2);
		const idRangeOffset = font.readUInt16BE(rangeOffsetsOffset + segment * 2);

		for (let code = startCode; code <= endCode && code !== 0xffff; code++) {
			let glyphId;

			if (idRangeOffset === 0) {
				glyphId = (code + idDelta) & 0xffff;
			} else {
				// idRangeOffset is a byte offset from its own position into the glyph id array
				const position =
					rangeOffsetsOffset + segment * 2 + idRangeOffset + (code - startCode) * 2;
				glyphId = font.readUInt16BE(position);

				if (glyphId !== 0) {
					glyphId = (glyphId + idDelta) & 0xffff;
				}
			}

			if (glyphId !== 0 && reverseMap[glyphId] === undefined) {
				reverseMap[glyphId] = code;
			}
		}
	}
}

/** Format 12: segmented coverage, needed once a font uses codepoints beyond the BMP. */
function readCharacterMapFormat12(font, subtableOffset, reverseMap) {
	const groupCount = font.readUInt32BE(subtableOffset + 12);

	for (let group = 0; group < groupCount; group++) {
		const record = subtableOffset + 16 + group * 12;
		const startCode = font.readUInt32BE(record);
		const endCode = font.readUInt32BE(record + 4);
		const startGlyphId = font.readUInt32BE(record + 8);

		for (let code = startCode; code <= endCode; code++) {
			const glyphId = startGlyphId + (code - startCode);

			if (reverseMap[glyphId] === undefined) {
				reverseMap[glyphId] = code;
			}
		}
	}
}

/** Reads a coverage table, which lists the glyphs a lookup applies to, in lookup order. */
function readCoverageTable(font, coverageOffset) {
	const format = font.readUInt16BE(coverageOffset);
	const count = font.readUInt16BE(coverageOffset + 2);
	const glyphIds = [];

	if (format === 1) {
		for (let i = 0; i < count; i++) {
			glyphIds.push(font.readUInt16BE(coverageOffset + 4 + i * 2));
		}
	} else if (format === 2) {
		for (let i = 0; i < count; i++) {
			const record = coverageOffset + 4 + i * 6;
			const startGlyphId = font.readUInt16BE(record);
			const endGlyphId = font.readUInt16BE(record + 2);

			for (let glyphId = startGlyphId; glyphId <= endGlyphId; glyphId++) {
				glyphIds.push(glyphId);
			}
		}
	}

	return glyphIds;
}

/**
 * Reads one ligature substitution subtable. The first component of every ligature comes from the
 * coverage table, the remaining components are listed on the ligature records themselves.
 */
function readLigatureSubtable(font, subtableOffset, reverseMap, ligatureNames) {
	const coverage = readCoverageTable(font, subtableOffset + font.readUInt16BE(subtableOffset + 2));
	const ligatureSetCount = font.readUInt16BE(subtableOffset + 4);

	for (let set = 0; set < ligatureSetCount; set++) {
		const setOffset = subtableOffset + font.readUInt16BE(subtableOffset + 6 + set * 2);
		const ligatureCount = font.readUInt16BE(setOffset);

		for (let i = 0; i < ligatureCount; i++) {
			const ligatureOffset = setOffset + font.readUInt16BE(setOffset + 2 + i * 2);
			const componentCount = font.readUInt16BE(ligatureOffset + 2);
			const componentGlyphIds = [coverage[set]];

			for (let component = 0; component < componentCount - 1; component++) {
				componentGlyphIds.push(font.readUInt16BE(ligatureOffset + 4 + component * 2));
			}

			const name = componentGlyphIds
				.map((glyphId) => reverseMap[glyphId])
				.filter((codePoint) => codePoint !== undefined)
				.map((codePoint) => String.fromCodePoint(codePoint))
				.join('');

			if (name.length === componentGlyphIds.length) {
				ligatureNames.add(name);
			}
		}
	}
}

/** Walks the GSUB lookup list and collects the name of every ligature the font defines. */
function readLigatureNames(font, gsubOffset, reverseMap) {
	const lookupListOffset = gsubOffset + font.readUInt16BE(gsubOffset + 8);
	const lookupCount = font.readUInt16BE(lookupListOffset);
	const ligatureNames = new Set();

	for (let i = 0; i < lookupCount; i++) {
		const lookupOffset = lookupListOffset + font.readUInt16BE(lookupListOffset + 2 + i * 2);
		const lookupType = font.readUInt16BE(lookupOffset);
		const subtableCount = font.readUInt16BE(lookupOffset + 4);

		if (lookupType !== GSUB_LOOKUP_TYPE_LIGATURE && lookupType !== GSUB_LOOKUP_TYPE_EXTENSION) {
			continue;
		}

		for (let sub = 0; sub < subtableCount; sub++) {
			let subtableOffset = lookupOffset + font.readUInt16BE(lookupOffset + 6 + sub * 2);

			// An extension subtable is a pointer to a real subtable, used once a lookup outgrows the
			// 16 bit offsets in the lookup table. Follow it, but only when it wraps a ligature lookup.
			if (lookupType === GSUB_LOOKUP_TYPE_EXTENSION) {
				if (font.readUInt16BE(subtableOffset + 2) !== GSUB_LOOKUP_TYPE_LIGATURE) {
					continue;
				}

				subtableOffset += font.readUInt32BE(subtableOffset + 4);
			}

			readLigatureSubtable(font, subtableOffset, reverseMap, ligatureNames);
		}
	}

	return [...ligatureNames].sort();
}

/**
 * Finds every icon font in public/fonts: a directory containing a <name>.ttf and a <name>.woff. We
 * read the names from the ttf because it is uncompressed, and embed the woff because that is what
 * the application itself loads. Text fonts such as sofia-pro ship a woff only, so they drop out
 * here without needing to be listed.
 */
function findIconFonts() {
	return fs
		.readdirSync(FONTS_DIR, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => ({
			family: entry.name,
			ttfPath: path.join(FONTS_DIR, entry.name, `${entry.name}.ttf`),
			woffPath: path.join(FONTS_DIR, entry.name, `${entry.name}.woff`),
			outputPath: path.join(FONTS_DIR, entry.name, OUTPUT_FILENAME),
		}))
		.filter((font) => fs.existsSync(font.ttfPath) && fs.existsSync(font.woffPath));
}

function readIconFont({ family, ttfPath, woffPath, outputPath }) {
	const font = fs.readFileSync(ttfPath);
	const tables = readTableDirectory(font);

	if (!tables.GSUB || !tables.cmap) {
		console.warn(`  skipping ${family}: no GSUB or cmap table`);
		return null;
	}

	const reverseMap = readReverseCharacterMap(font, tables.cmap.offset);
	const names = readLigatureNames(font, tables.GSUB.offset, reverseMap);

	if (names.length === 0) {
		console.warn(`  skipping ${family}: no ligatures found`);
		return null;
	}

	return {
		family,
		names,
		outputPath,
		woffBase64: fs.readFileSync(woffPath).toString('base64'),
	};
}

function escapeHtml(value) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function renderPage(iconFont) {
	const cards = iconFont.names
		.map((name) => {
			const escaped = escapeHtml(name);

			return `			<button type="button" class="card" data-name="${escaped}">
				<span class="icon">${escaped}</span>
				<span class="name">${escaped}</span>
			</button>`;
		})
		.join('\n');

	return `<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>${iconFont.family} icons</title>
		<style>
			@font-face {
				font-family: ${iconFont.family};
				src: url(data:font/woff;base64,${iconFont.woffBase64}) format("woff");
				font-weight: normal;
				font-style: normal;
			}

			:root {
				--background: #fff;
				--surface: #f6f6f7;
				--border: #e2e2e5;
				--text: #1a1a1a;
				--text-muted: #6b6b70;
			}

			[data-theme="dark"] {
				--background: #1a1a1a;
				--surface: #262629;
				--border: #3a3a3f;
				--text: #f2f2f2;
				--text-muted: #9a9aa0;
			}

			* {
				box-sizing: border-box;
			}

			body {
				margin: 0;
				padding: 2rem;
				background: var(--background);
				color: var(--text);
				font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
				font-size: 14px;
			}

			header {
				display: flex;
				flex-wrap: wrap;
				gap: 1rem;
				align-items: center;
				margin-bottom: 0.5rem;
			}

			h1 {
				margin: 0;
				font-size: 1.5rem;
			}

			.count {
				color: var(--text-muted);
				font-weight: normal;
				font-size: 0.875rem;
			}

			.hint {
				margin: 0 0 1.5rem;
				color: var(--text-muted);
			}

			.hint code {
				padding: 0.1em 0.4em;
				border-radius: 3px;
				background: var(--surface);
			}

			#search {
				flex: 1 1 16rem;
				padding: 0.5rem 0.75rem;
				border: 1px solid var(--border);
				border-radius: 4px;
				background: var(--background);
				color: inherit;
				font: inherit;
			}

			#theme-toggle {
				padding: 0.5rem 0.75rem;
				border: 1px solid var(--border);
				border-radius: 4px;
				background: var(--background);
				color: inherit;
				font: inherit;
				cursor: pointer;
			}

			.grid {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
				gap: 0.5rem;
			}

			.card {
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
				align-items: center;
				padding: 1rem 0.5rem;
				border: 1px solid var(--border);
				border-radius: 4px;
				background: var(--surface);
				color: inherit;
				font: inherit;
				text-align: center;
				cursor: pointer;
			}

			.card:hover {
				border-color: var(--text-muted);
			}

			.card[hidden] {
				display: none;
			}

			/* Mirrors src/modules/shared/components/Icon/Icon.module.scss so the preview renders
			   exactly like the Icon component does. */
			.icon {
				font-family: ${iconFont.family};
				font-size: 2rem;
				line-height: 1;
				font-feature-settings: "liga";
				font-variant-ligatures: discretionary-ligatures;
				letter-spacing: 0;
				-webkit-font-smoothing: antialiased;
				-moz-osx-font-smoothing: grayscale;
			}

			.name {
				color: var(--text-muted);
				font-size: 0.75rem;
				word-break: break-word;
			}

			.empty {
				color: var(--text-muted);
			}

			#toast {
				position: fixed;
				right: 1.5rem;
				bottom: 1.5rem;
				padding: 0.6rem 1rem;
				border-radius: 4px;
				background: var(--text);
				color: var(--background);
				transition: opacity 0.15s;
			}

			#toast[hidden] {
				display: none;
			}
		</style>
	</head>
	<body>
		<header>
			<h1>${iconFont.family} <span class="count">${iconFont.names.length} icons</span></h1>
			<input id="search" type="search" placeholder="Search ${iconFont.names.length} icons…" autofocus />
			<button id="theme-toggle" type="button">Dark</button>
		</header>
		<p class="hint">
			Click an icon to copy its name. Generated from ${iconFont.family}.ttf by
			<code>npm run update-icon-preview-page</code> — re-run it after updating the font.
		</p>
		<div class="grid">
${cards}
		</div>
		<p class="empty" hidden>No icons match your search.</p>
		<div id="toast" hidden></div>
		<script>
			const search = document.getElementById('search');
			const toast = document.getElementById('toast');
			const themeToggle = document.getElementById('theme-toggle');
			const count = document.querySelector('.count');
			const empty = document.querySelector('.empty');
			let toastTimeout;

			search.addEventListener('input', () => {
				const query = search.value.trim().toLowerCase();
				let visible = 0;

				for (const card of document.querySelectorAll('.card')) {
					const matches = card.dataset.name.includes(query);
					card.hidden = !matches;
					visible += matches ? 1 : 0;
				}

				count.textContent = visible + ' icons';
				empty.hidden = visible > 0;
			});

			document.addEventListener('click', async (event) => {
				const card = event.target.closest('.card');

				if (!card) {
					return;
				}

				try {
					await navigator.clipboard.writeText(card.dataset.name);
					showToast('Copied ' + card.dataset.name);
				} catch {
					showToast('Could not copy to clipboard');
				}
			});

			themeToggle.addEventListener('click', () => {
				const dark = document.documentElement.dataset.theme === 'dark';
				document.documentElement.dataset.theme = dark ? 'light' : 'dark';
				themeToggle.textContent = dark ? 'Dark' : 'Light';
			});

			function showToast(message) {
				toast.textContent = message;
				toast.hidden = false;
				clearTimeout(toastTimeout);
				toastTimeout = setTimeout(() => {
					toast.hidden = true;
				}, 1500);
			}
		</script>
	</body>
</html>
`;
}

console.log('generate icon font preview');

const iconFonts = findIconFonts()
	.map(readIconFont)
	.filter((iconFont) => iconFont !== null);

if (iconFonts.length === 0) {
	console.error(`No icon fonts with ligatures found in ${FONTS_DIR}`);
	process.exit(1);
}

for (const iconFont of iconFonts) {
	fs.writeFileSync(iconFont.outputPath, renderPage(iconFont));

	console.log(
		`  ${iconFont.names.length} ligatures -> ${path.relative(process.cwd(), iconFont.outputPath)}`
	);
}
