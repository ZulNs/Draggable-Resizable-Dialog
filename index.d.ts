declare module "toolwindow" {
    interface IToolWindowOptions {
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
    interface IToolWindowButton {
        text: string;
        clicked: Function;
    }
    interface IToolWindowContent {
        type: "text" | "html" | "url";
        value: string | StringSource | AsyncStringSource;
    }
    type StringSource = () => string;
    type AsyncStringSource = () => Promise<string>;

    class ToolWindow {
        constructor(options: IToolWindowOptions);
        show(): void;
        hide(): void;
        refresh(): void;
    }
}
