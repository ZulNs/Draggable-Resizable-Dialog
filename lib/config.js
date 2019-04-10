const defaultOptions = {
  title: "Tool Window",
  closeButtonText: "✖",
  buttons: [{
    text: "Ok",
    clicked() {
      this.hide();
    }
  }],
  minWidth: 200,
  minHeight: 200,
  maxWidth: 0, // values <= 0 will result in the dialog never growing larger than window.clientWidth
  maxHeight: 0, // values <= 0 will result in the dialog never growing larger than window.clientHeight
  autoFitContent: true, // attempt to autofit to content on first show
  keepOnScreen: true,
  width: 350,
  height: 200,
  minZIndex: 1000,
  top: undefined,
  left: undefined,
  resizeHandleSize: 10,
  content: {
    type: "text",
    value: ""
  },
  placement: null, // can be any combination of postion,align|position,align
  relativeToElement: null,
  escapeCloses: true,
  animated: true,
  animationTime: 1000,
  animationOpacityStep: 0.1,
  boundingElement: null
};

const alignments = {
  /**
   * alignment: inside
   *   moves to position relative to inside of element, respecting
   *   provided sizings
   *   - so top-left would have the top-left corner of the dialog on top of the top-left
   *     corner of the relative element
   */
  inside: "inside", // inside the element
  /**
   * alignment: outside
   *   moves to position relative to the outside the element
   *   - so top-left is above and to the left of the element
   */
  outside: "outside",
  /**
   * alignment: horizontalEdge
   *   outside the element, but horizontally horizontalEdge-aligned
   *   - so top-right has the top the dialog in-line with the top of the element and
   *      the dialog is to the right of the element
   */
  horizontalEdge: "horizontalEdge",
  /**
   * alignment: horizontalEdge
   *   outside the element, but vertically horizontalEdge-aligned
   *   - so top-right has the top the dialog in-line with the top of the element and
   *      the dialog is to the right of the element
   */
  verticalEdge: "verticalEdge",
};

const positions = {
  auto: "auto",
  topLeft: "topLeft",
  topCenter: "topCenter",
  topRight: "topRight",
  centerLeft: "centerLeft",
  center: "center",
  centerRight: "centerRight",
  bottomLeft: "bottomLeft",
  bottomCenter: "bottomCenter",
  bottomRight: "bottomRight"
};

module.exports = {
  defaultOptions,
  alignments,
  positions
};
