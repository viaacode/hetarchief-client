export interface AltoFormatV2 {
	alto: Alto2Root;
}

export interface Alto2Root {
	$: Alto2GeneratedType;
	Description: Alto2Description[];
	Styles: Alto2Style[];
	Layout: Alto2Layout[];
}

export interface Alto2GeneratedType {
	xmlns: string;
	'xmlns:xsi': string;
	'xsi:schemaLocation': string;
}

export interface Alto2Description {
	MeasurementUnit: string[];
	sourceImageInformation: Alto2SourceImageInformation[];
	OCRProcessing: Alto2OcrProcessing[];
}

export interface Alto2SourceImageInformation {
	fileName: string[];
}

export interface Alto2OcrProcessing {
	$: Alto2GeneratedType2;
	preProcessingStep: Alto2PreProcessingStep[];
	ocrProcessingStep: Alto2OcrProcessingStep[];
}

export interface Alto2GeneratedType2 {
	ID: string;
}

export interface Alto2PreProcessingStep {
	processingStepDescription: string[];
	processingSoftware: Alto2ProcessingSoftware[];
}

export interface Alto2ProcessingSoftware {
	softwareCreator: string[];
	softwareName: string[];
	softwareVersion: string[];
}

export interface Alto2OcrProcessingStep {
	processingDateTime: string[];
	processingAgency: string[];
	processingStepSettings: string[];
	processingSoftware: Alto2ProcessingSoftware2[];
}

export interface Alto2ProcessingSoftware2 {
	softwareCreator: string[];
	softwareName: string[];
	softwareVersion: string[];
}

export interface Alto2Style {
	TextStyle: Alto2TextStyle[];
	ParagraphStyle: Alto2ParagraphStyle[];
}

export interface Alto2TextStyle {
	$: Alto2GeneratedType3;
}

export interface Alto2GeneratedType3 {
	ID: string;
	FONTSIZE: string;
	FONTFAMILY: string;
	FONTSTYLE?: string;
}

export interface Alto2ParagraphStyle {
	$: Alto2GeneratedType4;
}

export interface Alto2GeneratedType4 {
	ID: string;
	ALIGN: string;
}

export interface Alto2Layout {
	Page: Alto2Page[];
}

export interface Alto2Page {
	$: Alto2GeneratedType5;
	TopMargin: Alto2TopMargin[];
	LeftMargin: Alto2LeftMargin[];
	RightMargin: Alto2RightMargin[];
	BottomMargin: Alto2BottomMargin[];
	PrintSpace: Alto2PrintSpace[];
}

export interface Alto2GeneratedType5 {
	ID: string;
	PHYSICAL_IMG_NR: string;
	HEIGHT: string;
	WIDTH: string;
	PRINTED_IMG_NR: string;
	ACCURACY: string;
}

export interface Alto2TopMargin {
	$: Alto2GeneratedType6;
}

export interface Alto2GeneratedType6 {
	HPOS: string;
	VPOS: string;
	WIDTH: string;
	HEIGHT: string;
}

export interface Alto2LeftMargin {
	$: Alto2GeneratedType7;
}

export interface Alto2GeneratedType7 {
	HPOS: string;
	VPOS: string;
	WIDTH: string;
	HEIGHT: string;
}

export interface Alto2RightMargin {
	$: Alto2GeneratedType8;
}

export interface Alto2GeneratedType8 {
	HPOS: string;
	VPOS: string;
	WIDTH: string;
	HEIGHT: string;
}

export interface Alto2BottomMargin {
	$: Alto2GeneratedType9;
}

export interface Alto2GeneratedType9 {
	HPOS: string;
	VPOS: string;
	WIDTH: string;
	HEIGHT: string;
}

export interface Alto2PrintSpace {
	$: Alto2GeneratedType10;
	TextBlock: Alto2TextBlock[];
}

export interface Alto2GeneratedType10 {
	HPOS: string;
	VPOS: string;
	WIDTH: string;
	HEIGHT: string;
}

export interface Alto2TextBlock {
	$: Alto2GeneratedType11;
	TextLine: Alto2TextLine[];
}

export interface Alto2GeneratedType11 {
	ID: string;
	HEIGHT: string;
	WIDTH: string;
	HPOS: string;
	VPOS: string;
	STYLEREFS: string;
}

export interface Alto2TextLine {
	$: Alto2GeneratedType12;
	String: Alto2String[];
	SP?: Alto2Sp[];
	HYP?: Alto2Hyp[];
}

export interface Alto2GeneratedType12 {
	ID: string;
	HEIGHT: string;
	WIDTH: string;
	HPOS: string;
	VPOS: string;
}

export interface Alto2String {
	$: Alto2GeneratedType13;
}

export interface Alto2GeneratedType13 {
	ID: string;
	HEIGHT: string;
	WIDTH: string;
	HPOS: string;
	VPOS: string;
	CONTENT: string;
	WC: string;
	CC: string;
	SUBS_TYPE?: string;
	SUBS_CONTENT?: string;
	STYLEREFS?: string;
}

export interface Alto2Sp {
	$: Alto2GeneratedType14;
}

export interface Alto2GeneratedType14 {
	ID: string;
	WIDTH: string;
	HPOS: string;
	VPOS: string;
}

export interface Alto2Hyp {
	$: Alto2GeneratedType15;
}

export interface Alto2GeneratedType15 {
	CONTENT: string;
	WIDTH: string;
	HPOS: string;
	VPOS: string;
}
