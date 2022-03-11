//
// /**
//  * Vertical Lane in the overview ruler of the editor.
//  */
// import { ThemeColor } from '@/core/theme/common/theme';
//
// export enum OverviewRulerLane {
// 	Left = 1,
// 	Center = 2,
// 	Right = 4,
// 	Full = 7
// }
//
// /**
//  * Position in the minimap to render the decoration.
//  */
// export enum MinimapPosition {
// 	Inline = 1,
// 	Gutter = 2
// }
//
// export interface IDecorationOptions {
// 	/**
// 	 * CSS color to render.
// 	 * e.g.: rgba(100, 100, 100, 0.5) or a color from the color registry
// 	 */
// 	color: string | ThemeColor | undefined;
// 	/**
// 	 * CSS color to render.
// 	 * e.g.: rgba(100, 100, 100, 0.5) or a color from the color registry
// 	 */
// 	darkColor?: string | ThemeColor;
// }
//
// export interface IModelDecorationOverviewRulerOptions extends IDecorationOptions {
// 	position: OverviewRulerLane;
// }
//
//
// /**
//  * Options for rendering a model decoration in the overview ruler.
//  */
// export interface IModelDecorationMinimapOptions extends IDecorationOptions {
// 	/**
// 	 * The position in the overview ruler.
// 	 */
// 	position: MinimapPosition;
// }
//
// export interface IModelDecorationOptions {
//
// }
//
// export interface ITextSnapshot {
// 	read(): string | null;
// }
