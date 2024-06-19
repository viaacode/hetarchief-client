import { compact, isArray } from 'lodash-es';

import { type AltoFormatV2, type AltoString, type AltoTextLine } from './alto.v2.types';
import { type AltoFormatV3 } from './alto.v3.types';
import altoJson from './alto2.json';

export interface TextLine {
	text: string;
	x: number;
	y: number;
	width: number;
	height: number;
}

export function extractTextLinesFromAlto(): TextLine[] {
	console.log('alto: ', altoJson);
	switch (altoJson.alto._xmlns) {
		case 'http://www.loc.gov/standards/alto/ns-v2#':
			// Alto v2
			return compact(
				(altoJson as unknown as AltoFormatV2).alto.Layout.Page.PrintSpace.TextBlock.flatMap(
					(textBlock) => {
						let textLines: AltoTextLine[] = [];
						if (isArray(textBlock.TextLine)) {
							textLines = textBlock.TextLine;
						} else if (textBlock.TextLine) {
							textLines = [textBlock.TextLine];
						}
						return textLines.flatMap((textLine) => {
							let textStrings: AltoString[] = [];
							if (isArray(textLine.String)) {
								textStrings = textLine.String;
							} else if (textLine.String) {
								textStrings = [textLine.String];
							}
							return textStrings.flatMap((altoString) => {
								if (!altoString._CONTENT) {
									return null;
								}
								return {
									text: altoString._CONTENT,
									x: parseInt(altoString._HPOS),
									y: parseInt(altoString._VPOS),
									width: parseInt(altoString._WIDTH),
									height: parseInt(altoString._HEIGHT),
								};
							});
						});
					}
				)
			);

		case 'http://www.loc.gov/standards/alto/ns-v3#':
			// Alto v3
			return compact(
				(
					altoJson as unknown as AltoFormatV3
				).alto.Layout.Page.PrintSpace.ComposedBlock.flatMap((composeBlock) => {
					const altoString = composeBlock.TextBlock?.TextLine?.String;
					if (!altoString?._CONTENT) {
						return null;
					}
					return {
						text: altoString?._CONTENT,
						x: parseInt(altoString._HPOS),
						y: parseInt(altoString._VPOS),
						width: parseInt(altoString._WIDTH),
						height: parseInt(altoString._HEIGHT),
					};
				})
			);

		default:
			console.error(
				new Error(
					'Unsupported Alto format: ' +
						altoJson.alto._xmlns +
						', Current support is v2 and v3'
				)
			);
			return [];
	}
}
