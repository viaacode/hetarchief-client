import { compact, isArray } from 'lodash-es';
import { Parser } from 'xml2js';

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
	type Alto3PageTextArea,
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
		processingStepSettings: string | undefined;
		softwareCreator: string | undefined;
		softwareName: string | undefined;
		softwareVersion: string | undefined;
		width: string | undefined;
		height: string | undefined;
	};
	text: TextLine[] | undefined;
}

type AltoFormat = AltoFormatV2 | AltoFormatV3;

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
					processingStepSettings:
						altoV2.alto?.Description?.[0]?.OCRProcessing?.[0]?.ocrProcessingStep?.[0]
							?.processingStepSettings?.[0],
					softwareCreator:
						altoV2.alto?.Description?.[0]?.OCRProcessing?.[0]?.ocrProcessingStep?.[0]
							?.processingSoftware?.[0]?.softwareCreator?.[0],
					softwareName:
						altoV2.alto?.Description?.[0]?.OCRProcessing?.[0]?.ocrProcessingStep?.[0]
							?.processingSoftware?.[0]?.softwareName?.[0],
					softwareVersion:
						altoV2.alto?.Description?.[0]?.OCRProcessing?.[0]?.ocrProcessingStep?.[0]
							?.processingSoftware?.[0]?.softwareVersion?.[0],
					width: altoV2.alto?.Layout?.[0]?.Page?.[0]?.$?.WIDTH,
					height: altoV2.alto?.Layout?.[0]?.Page?.[0]?.$?.HEIGHT,
				},
				text: textLines,
			};
		}

		case 'http://www.loc.gov/standards/alto/ns-v3#': {
			// Alto v3
			const altoV3 = altoJson as unknown as AltoFormatV3;
			const textLines: TextLine[] = compact(
				(altoJson as unknown as AltoFormatV3).alto.Layout.flatMap((layout: Alto3Layout) => {
					return layout.Page?.flatMap((page: Alto3Page) => {
						return [
							...page.TopMargin,
							...page.LeftMargin,
							...page.PrintSpace,
							...page.RightMargin,
							...page.BottomMargin,
						]?.flatMap((pageLocation: Alto3PageTextArea) => {
							return pageLocation.TextBlock?.flatMap((textBlock: Alto3TextBlock) => {
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
					processingStepSettings:
						altoV3.alto?.Description?.[0]?.OCRProcessing?.[0]?.ocrProcessingStep?.[0]
							?.processingStepSettings?.[0],
					softwareCreator:
						altoV3.alto?.Description?.[0]?.OCRProcessing?.[0]?.ocrProcessingStep?.[0]
							?.processingSoftware?.[0]?.softwareCreator?.[0],
					softwareName:
						altoV3.alto?.Description?.[0]?.OCRProcessing?.[0]?.ocrProcessingStep?.[0]
							?.processingSoftware?.[0]?.softwareName?.[0],
					softwareVersion:
						altoV3.alto?.Description?.[0]?.OCRProcessing?.[0]?.ocrProcessingStep?.[0]
							?.processingSoftware?.[0]?.softwareVersion?.[0],
					width: altoV3.alto?.Layout?.[0]?.Page?.[0]?.$?.WIDTH,
					height: altoV3.alto?.Layout?.[0]?.Page?.[0]?.$?.HEIGHT,
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
					processingStepSettings: undefined,
					softwareCreator: undefined,
					softwareName: undefined,
					softwareVersion: undefined,
					width: undefined,
					height: undefined,
				},
				text: undefined,
			};
	}
}

export async function convertAltoXmlFileUrlToSimplifiedJson(
	altoFileUrl: string
): Promise<SimplifiedAlto> {
	const response = await fetch(altoFileUrl);
	const xml = await response.text();

	const altoJson = (await xmlParser.parseStringPromise(xml)) as AltoFormat;
	return extractTextLinesFromAlto(altoJson);
}
