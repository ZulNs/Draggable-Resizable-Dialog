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
    maxWidth?: 0,
    /**
     * values <= 0 will result in the dialog never growing larger than window.clientHeight
     */
    maxHeight?: 0,
    /**
     * attempt to autofit to content on first show
     */
    autoFitContent?: boolean,
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

    /**
     * pipe-delimited list of comma-separated placement and alignment values.
     * - the first placement which is within the prescribed area (defaults to document element)
     *   is selected for initial placement
     * Placement values:
     *   - topLeft
     *   - topCenter
     *   - topRight
     *   - centerLeft
     *   - center
     *   - centerRight
     *   - bottomLeft
     *   - bottomCenter
     *   - bottomRight
     * Alignment values:
     *   - inside
     *   - outside
     *   - horizontalEdge
     *   - verticalEdge
     *
     * Example:
     *  - inside,topLeft
     *  - outside,topRight
     *  - horizontalEdge,topRight|horizontalEdge,bottomRight|verticalEdge,topRight|verticalEdge,bottomRight
     *    - this tries first to place next to relative element (RE), with top aligned to RE top
     *    - then next to RE with bottom aligned with RE
     *    - then above RE with right edges aligned
     *    - then below RE with right edges aligned
     *
     * Outcomes:
     * - topLeft:
     *   - inside: top-left corner of tool window is aligned with top-left corner of RE
     *   - outside: bottom-right corner is aligned with the top-left corner of RE
     *   - horizontalEdge: top-right corner is aligned with top-left corner of RE
     *   - verticalEdge: bottom-left corner is aligned with top-left corner of RE
     * - topCenter: tool window is centrally-aligned (horizontally) with RE and
     *   - inside: top horizontalEdge of TW aligned with top horizontalEdge of RE
     *   - outside: bottom horizontalEdge of TW aligned with bottom horizontalEdge of RE
     *   - horizontalEdge: same as for outside
     *   - verticalEdge: same as for outside
     * - topRight:
     *   - inside: top-right corner of tool window is aligned with top-right corner of RE
     *   - outside: bottom-left corner is aligned with the top-right corner of RE
     *   - horizontalEdge: top-left corner is aligned with top-right corner of RE
     * - centerLeft: tool window is centrally-aligned (vertically) with RE and
     *   - inside: left TW horizontalEdge aligns with left RE horizontalEdge
     *   - outside: right TW horizontalEdge aligns with left RE horizontalEdge
     *   - horizontalEdge: as per outside
     * - center: tool window is aligned centrally (horizontally and vertically) with respect to RE
     * - centerRight: tool window is centrally-aligned (vertically) with RE and
     *   - inside: right TW horizontalEdge aligns with right RE horizontalEdge
     *   - outside: left TW horizontalEdge aligns with right RE horizontalEdge
     *   - horizontalEdge: as per outside
     * - bottomLeft:
     *   - inside: TW bottom-left corner aligns with RE bottom-left corner
     *   - outside: TW top-right corner aligns with RE bottom-left corner
     *   - horizontalEdge: TW bottom-right corner aligns with RE bottom-left corner
     * - bottomCenter: TW is centrally-aligned (horizontally) and
     *   - inside: TW bottom horizontalEdge is aligned with RE bottom horizontalEdge
     *   - outside: TW top horizontalEdge is aligned with RE bottom horizontalEdge
     *   - horizontalEdge: as per outside
     * - bottomRight: TW left horizontalEdge is aligned with RE right horizontalEdge and
     *   - inside: TW bottom-right corner is aligned with RE bottom-right corner
     *   - outside: TW top-left corner is aligned with RE bottom-right corner
     *   - horizontalEdge: TW bottom-left corner is aligned with RE bottom-right corner
     */
    placement?: string

    /**
     * Element to align relative to, required for position or align to have any effect
     */
    relativeToElement?: HTMLElement | string;

    /**
     * should the Escape key close the dialog when it "has focus"?
     * - defaults to true
     */
    escapeCloses?: boolean;

    /**
     * whether or not to animate (fade-in / fade-out) dialog on show/hide
     */
    animated?: boolean;

    /**
     * how long fade animations take, if enabled
     */
    animationTime?: 1000,

    /**
     * what step to use in opacity with each animation frame
     * - if you change animationTime, you may need to reduce
     *   this value to prevent obvious stepping
     */
    animationOpacityStep?: 0.1,

    /**
     * Sets an element "within" which the tool window has to stay
     * - when not set, this defaults to the window
     */
    boundingElement?: HTMLElement | string
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
     * - HTMLElement
     * - function returning an HTMLElement
     * - function returning a Promise which resolves to an HTMLElement
     */
    value: ToolWindowContentValue;
  }

  type StringSource = () => string;
  type AsyncStringSource = () => Promise<string>;
  type HTMLElementSource = () => HTMLElement;
  type AsyncHTMLElementSource = () => Promise<HTMLElement>;
  type HTMLElementOrStringSource = () => HTMLElement | string;
  type AsyncHTMLElementOrStringSource = () => Promise<HTMLElement | string>;

  type ToolWindowContentValue =
    string | HTMLElement |
    StringSource | AsyncStringSource |
    HTMLElementSource | AsyncHTMLElementSource |
    HTMLElementOrStringSource | AsyncHTMLElementOrStringSource;

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

    /**
     * Attempt to move to the start position configured for this window
     */
    moveToConfiguredStartPosition();
  }
}
