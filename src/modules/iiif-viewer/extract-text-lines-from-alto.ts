import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import { compact, isArray } from 'lodash-es';
import { Parser } from 'xml2js';

import { type AltoFormat } from '@iiif-viewer/alto.types';

import {
	type Alto2Layout,
	type Alto2Page,
	type Alto2PrintSpace,
	type Alto2String,
	type Alto2TextBlock,
	type Alto2TextLine,
	type AltoFormatV2,
} from './alto.v2.types';
import {
	type Alto3Layout,
	type Alto3Page,
	type Alto3PrintSpace,
	type Alto3String,
	type Alto3TextBlock,
	type Alto3TextLine,
	type AltoFormatV3,
} from './alto.v3.types';

export interface TextLine {
	text: string;
	x: number;
	y: number;
	width: number;
	height: number;
}

const xmlParser = new Parser();

export interface SimplifiedAlto {
	description: {
		fileName: string | undefined;
		processingDateTime: string | undefined;
		softwareCreator: string | undefined;
		softwareName: string | undefined;
		softwareVersion: string | undefined;
	};
	text: TextLine[] | undefined;
}

function toArray<T = any>(objectOrArray: T | T[]): T[] {
	if (isArray(objectOrArray)) {
		return objectOrArray;
	}
	return [objectOrArray];
}

export function extractTextLinesFromAlto(altoJson: AltoFormat): SimplifiedAlto {
	const altoVersion = altoJson.alto.$.xmlns;
	switch (altoVersion) {
		case 'http://www.loc.gov/standards/alto/ns-v2#': {
			// Alto v2
			const altoV2 = altoJson as unknown as AltoFormatV2;
			const textLines: TextLine[] = compact(
				toArray(altoV2.alto.Layout).flatMap((Layout: Alto2Layout) => {
					return toArray(Layout.Page).flatMap((page: Alto2Page) => {
						return toArray(page.PrintSpace).flatMap((printSpace: Alto2PrintSpace) => {
							return toArray(printSpace.TextBlock).flatMap(
								(textBlock: Alto2TextBlock) => {
									return toArray(textBlock.TextLine).flatMap(
										(textLine: Alto2TextLine) => {
											return toArray(textLine.String).flatMap(
												(altoString: Alto2String) => {
													if (!altoString.$.CONTENT) {
														return null;
													}
													return {
														text: altoString.$.CONTENT,
														x: parseInt(altoString.$.HPOS),
														y: parseInt(altoString.$.VPOS),
														width: parseInt(altoString.$.WIDTH),
														height: parseInt(altoString.$.HEIGHT),
													};
												}
											);
										}
									);
								}
							);
						});
					});
				})
			);
			return {
				description: {
					fileName:
						altoV2.alto?.Description?.[0]?.sourceImageInformation?.[0]?.fileName?.[0],
					processingDateTime:
						altoV2.alto?.Description?.[0]?.OCRProcessing?.[0]?.ocrProcessingStep?.[0]
							?.processingDateTime?.[0],
					softwareCreator:
						altoV2.alto?.Description?.[0]?.OCRProcessing?.[0]?.ocrProcessingStep?.[0]
							?.processingSoftware?.[0]?.softwareCreator?.[0],
					softwareName:
						altoV2.alto?.Description?.[0]?.OCRProcessing?.[0]?.ocrProcessingStep?.[0]
							?.processingSoftware?.[0]?.softwareName?.[0],
					softwareVersion:
						altoV2.alto?.Description?.[0]?.OCRProcessing?.[0]?.ocrProcessingStep?.[0]
							?.processingSoftware?.[0]?.softwareVersion?.[0],
				},
				text: textLines,
			};
		}

		case 'http://www.loc.gov/standards/alto/ns-v3#': {
			// Alto v3
			const altoV3 = altoJson as unknown as AltoFormatV3;
			const textLines: TextLine[] = compact(
				(altoJson as unknown as AltoFormatV3).alto.Layout.flatMap((layout: Alto3Layout) => {
					return layout.Page.flatMap((page: Alto3Page) => {
						return page.PrintSpace.flatMap((printSpace: Alto3PrintSpace) => {
							return printSpace.TextBlock.flatMap((textBlock: Alto3TextBlock) => {
								return textBlock?.TextLine?.flatMap((textLine: Alto3TextLine) => {
									return textLine.String.flatMap((altoString: Alto3String) => {
										return {
											text: altoString?.$?.CONTENT,
											x: parseInt(altoString.$.HPOS),
											y: parseInt(altoString.$.VPOS),
											width: parseInt(altoString.$.WIDTH),
											height: parseInt(altoString.$.HEIGHT),
										};
									});
								});
							});
						});
					});
				})
			);
			return {
				description: {
					fileName: undefined,
					processingDateTime:
						altoV3.alto?.Description?.[0]?.OCRProcessing?.[0]?.ocrProcessingStep?.[0]
							?.processingDateTime?.[0],
					softwareCreator:
						altoV3.alto?.Description?.[0]?.OCRProcessing?.[0]?.ocrProcessingStep?.[0]
							?.processingSoftware?.[0]?.softwareCreator?.[0],
					softwareName:
						altoV3.alto?.Description?.[0]?.OCRProcessing?.[0]?.ocrProcessingStep?.[0]
							?.processingSoftware?.[0]?.softwareName?.[0],
					softwareVersion:
						altoV3.alto?.Description?.[0]?.OCRProcessing?.[0]?.ocrProcessingStep?.[0]
							?.processingSoftware?.[0]?.softwareVersion?.[0],
				},
				text: textLines,
			};
		}

		default:
			console.error(
				new Error(`Unsupported Alto format: "${altoVersion}", Current support is v2 and v3`)
			);
			return {
				description: {
					fileName: undefined,
					processingDateTime: undefined,
					softwareCreator: undefined,
					softwareName: undefined,
					softwareVersion: undefined,
				},
				text: undefined,
			};
	}
}

async function convertAltoFiles(altoFiles: string[]): Promise<void> {
	for (const altoFile of altoFiles) {
		const response = await fetch(altoFile);
		const xml = await response.text();

		const altoJson = (await xmlParser.parseStringPromise(xml)) as AltoFormat;
		const textLines = extractTextLinesFromAlto(altoJson);
		await fs.writeFile(
			path.resolve('./' + path.parse(altoFile).name + '.json'),
			JSON.stringify(textLines, null, 2)
		);
	}
}

convertAltoFiles([
	'https://archief-media.meemoo.be/viaa/MOB/KULEUVENKADOC/2669f95bbf604172942ca92642c4e9bff7d174898b21481e979ae27119f41a23/2669f95bbf604172942ca92642c4e9bff7d174898b21481e979ae27119f41a23.xml',
	'https://archief-media.meemoo.be/viaa/MOB/KULEUVENUNIVERSITEITSBIBLIOTHEEK/267461b46ae444b7831eda3eaedc2fa34e184de2fc45479fa18e7b2d55b19aa2/267461b46ae444b7831eda3eaedc2fa34e184de2fc45479fa18e7b2d55b19aa2.xml',
	'https://archief-media.meemoo.be/viaa/MOB/ERFGOEDCELKERF/1ec8e20f660947489ea9617ddc821a11155f86ae151a4be695c9709c21b217f6/1ec8e20f660947489ea9617ddc821a11155f86ae151a4be695c9709c21b217f6.xml',
]);
