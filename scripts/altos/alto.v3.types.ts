export interface AltoFormatV3 {
	alto: Alto3Root;
}
export interface Alto3Root {
	$: Alto3GeneratedType;
	Description: Alto3Description[];
	Styles: string[];
	Layout: Alto3Layout[];
}

export interface Alto3GeneratedType {
	xmlns: string;
	'xmlns:xlink': string;
	'xmlns:xsi': string;
	'xsi:schemaLocation': string;
}

export interface Alto3Description {
	MeasurementUnit: string[];
	sourceImageInformation: {
		fileName: string;
	};
	OCRProcessing: Alto3OcrProcessing[];
}

export interface Alto3OcrProcessing {
	$: Alto3GeneratedType2;
	ocrProcessingStep: Alto3OcrProcessingStep[];
}

export interface Alto3GeneratedType2 {
	ID: string;
}

export interface Alto3OcrProcessingStep {
	processingDateTime: string[];
	processingStepSettings: string[];
	processingSoftware: Alto3ProcessingSoftware[];
}

export interface Alto3ProcessingSoftware {
	softwareCreator: string[];
	softwareName: string[];
	softwareVersion: string[];
}

export interface Alto3Layout {
	Page: Alto3Page[];
}

export interface Alto3Page {
	$: Alto3GeneratedType3;
	TopMargin: Alto3TopMargin[];
	BottomMargin: Alto3BottomMargin[];
	PrintSpace: Alto3PrintSpace[];
}

export interface Alto3GeneratedType3 {
	ID: string;
	PHYSICAL_IMG_NR: string;
	HEIGHT: string;
	WIDTH: string;
}

export interface Alto3TopMargin {
	$: Alto3GeneratedType4;
}

export interface Alto3GeneratedType4 {
	HEIGHT: string;
	WIDTH: string;
	VPOS: string;
	HPOS: string;
}

export interface Alto3BottomMargin {
	$: Alto3GeneratedType5;
}

export interface Alto3GeneratedType5 {
	HEIGHT: string;
	WIDTH: string;
	VPOS: string;
	HPOS: string;
}

export interface Alto3PrintSpace {
	$: Alto3GeneratedType6;
	TextBlock: Alto3TextBlock[];
	Illustration: Alto3Illustration[];
	ComposedBlock: Alto3ComposedBlock[];
	GraphicalElement: Alto3GraphicalElement2[];
}

export interface Alto3GeneratedType6 {
	HEIGHT: string;
	WIDTH: string;
	VPOS: string;
	HPOS: string;
}

export interface Alto3TextBlock {
	$: Alto3GeneratedType7;
	TextLine: Alto3TextLine[];
	Shape?: Alto3Shape[];
}

export interface Alto3GeneratedType7 {
	ID: string;
	HEIGHT: string;
	WIDTH: string;
	VPOS: string;
	HPOS: string;
	LANG?: string;
}

export interface Alto3TextLine {
	$: Alto3GeneratedType8;
	String: Alto3String[];
	SP?: Alto3Sp[];
	HYP?: Alto3Hyp[];
}

export interface Alto3GeneratedType8 {
	HEIGHT: string;
	WIDTH: string;
	VPOS: string;
	HPOS: string;
	LANG?: string;
}

export interface Alto3String {
	$: Alto3GeneratedType9;
}

export interface Alto3GeneratedType9 {
	WC: string;
	CONTENT: string;
	HEIGHT: string;
	WIDTH: string;
	VPOS: string;
	HPOS: string;
	LANG?: string;
	SUBS_TYPE?: string;
	SUBS_CONTENT?: string;
}

export interface Alto3Sp {
	$: Alto3GeneratedType10;
}

export interface Alto3GeneratedType10 {
	HEIGHT: string;
	WIDTH: string;
	VPOS: string;
	HPOS: string;
}

export interface Alto3Hyp {
	$: Alto3GeneratedType11;
}

export interface Alto3GeneratedType11 {
	CONTENT: string;
}

export interface Alto3Shape {
	Polygon: Alto3Polygon[];
}

export interface Alto3Polygon {
	$: Alto3GeneratedType12;
}

export interface Alto3GeneratedType12 {
	POINTS: string;
}

export interface Alto3Illustration {
	$: Alto3GeneratedType13;
}

export interface Alto3GeneratedType13 {
	ID: string;
	HEIGHT: string;
	WIDTH: string;
	VPOS: string;
	HPOS: string;
}

export interface Alto3ComposedBlock {
	$: Alto3GeneratedType14;
	GraphicalElement: Alto3GraphicalElement[];
}

export interface Alto3GeneratedType14 {
	ID: string;
	HEIGHT: string;
	WIDTH: string;
	VPOS: string;
	HPOS: string;
	TYPE: string;
}

export interface Alto3GraphicalElement {
	$: Alto3GeneratedType15;
}

export interface Alto3GeneratedType15 {
	ID: string;
	HEIGHT: string;
	WIDTH: string;
	VPOS: string;
	HPOS: string;
}

export interface Alto3GraphicalElement2 {
	$: Alto3GeneratedType16;
}

export interface Alto3GeneratedType16 {
	ID: string;
	HEIGHT: string;
	WIDTH: string;
	VPOS: string;
	HPOS: string;
}
