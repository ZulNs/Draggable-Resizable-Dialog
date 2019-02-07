export interface IToolWindowOptions {
    title?: string;
    closeButtonText?: string;
    buttons?: IToolWindowButton[];
    minWidth?: number;
    minHeight?: number;
    width?: number;
    height?: number;
    minZIndex?: number;
    top?: number;
    left?: number;
    resizeHandleSize?: number;
    content: IToolWindowContent;
}
export interface IToolWindowButton {
    text: string;
    clicked: Function;
}
export interface IToolWindowContent {
    type: "text" | "html" | "url";
    value: string | StringSource | AsyncStringSource;
}
export type StringSource = () => string;
export type AsyncStringSource = () => Promise<string>;

declare class ToolWindow {
    new(options: IToolWindowOptions);
    show(): void;
    hide(): void;
    refresh(): void;
}
