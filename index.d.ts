declare module "toolwindow" {
    interface IToolWindowOptions {
        /**
         * Sets the tool window caption / title
         */
        title?: string;
        /**
         * override the default [X] of the close button
         */
        closeButtonText?: string;
        /**
         * Array of button definitions to add to the tool window.
         * - leaving undefined will add an "Ok" button which dismisses the tool window
         * - passing in an empty array will eradicate the button bar altogether
         */
        buttons?: IToolWindowButton[];
        /**
         * minimum width
         */
        minWidth?: number;
        /**
         * minimum height
         */
        minHeight?: number;
        /**
         * values <= 0 will result in the dialog never growing larger than window.clientWidth
         */
        maxWidth: 0,
        /**
         * values <= 0 will result in the dialog never growing larger than window.clientHeight
         */
        maxHeight: 0,
        /**
         * attempt to autofit to content on first show
         */
        autoFitContent: true,
        /**
         * initial width
         */
        width?: number;
        /**
         * initial height
         */
        height?: number;
        /**
         * override the minimum z-index if you have some high z-indexes already set on your page
         */
        minZIndex?: number;
        /**
         * initial top
         */
        top?: number;
        /**
         * initial left
         */
        left?: number;
        /**
         * size of resize handles (defaults to 5px)
         */
        resizeHandleSize?: number;
        /**
         * defines what content is shown in the tool window
         */
        content: IToolWindowContent;
    }
    interface IToolWindowButton {
        /**
         * button caption / text
         */
        text: string;
        /**
         * click handler
         */
        clicked: Function;
    }
    interface IToolWindowContent {
        /**
         * - text content is displayed as innerText
         * - html content is displayed as innerHTML
         * - url content is iframed
         */
        type: "text" | "html" | "url";
        /**
         * May be any one of:
         * - string
         * - function returning a string
         * - function returning a Promise which resolves to a string
         */
        value: string | StringSource | AsyncStringSource;
    }
    type StringSource = () => string;
    type AsyncStringSource = () => Promise<string>;

    /**
     * use actual numbers or relatives like "+10" and "-5"
     */
    type Dimension = number | string;

    class ToolWindow {
        /**
         * Constructs a new ToolWindow instance
         */
        constructor(options: IToolWindowOptions);

        /**
         * shows the tool window; has no effect if already shown
         */
        show(): void;

        /**
         * hides the tool window; has no effect if not already shown
         */
        hide(): void;

        /**
         * refreshes the content of the tool window -- most effective if your
         * content value is a function of some kind or when the content is being
         * iframed (ie content has the type "url")
         */
        refresh(): void;

        /**
         * Resizes the window, either to absolute values (when provided numbers)
         * or by relative amounts (when provided strings like "+5" or "-7"). Any
         * undefined or null parameter is ignored.
         * @param width
         * @param height
         */
        resizeTo(width: Dimension, height: Dimension);
        /**
         * Moves the window, either to absolute values (when provided numbers)
         * or by relative amounts (when provided strings like "+5" or "-7"). Optionally
         * also resizes, if width and height are provides. Any null or undefined parameter
         * is ignored.
         * @param left
         * @param top
         * @param width
         * @param height
         */
        moveTo(left?: Dimension, top?: Dimension, width?: Dimension, height?: Dimension);

        /**
         * Attempts to fit the window to the content
         */
        fitContent();

        /**
         * Ensures that the tool window is visible on-screen, within the client viewport
         */
        boundWithinScreen();
    }
}
