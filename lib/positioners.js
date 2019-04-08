const {positions} = require("./config");

const outside = {
  [positions.topLeft]: (tw, outsideRect, dialogRect) => {
    const
      left = outsideRect.left - dialogRect.width,
      top = outsideRect.top - dialogRect.height;
    return tw.moveTo(left, top);
  },
  [positions.topCenter]: (tw, outsideRect, dialogRect) => {
    const
      left = outsideRect.left + (outsideRect.width - dialogRect.width) / 2,
      top = outsideRect.top - dialogRect.height;
    return tw.moveTo(left, top);
  },
  [positions.topRight]: (tw, outsideRect, dialogRect) => {
    const
      left = outsideRect.right,
      top = outsideRect.top - dialogRect.height;
    return tw.moveTo(left, top);
  },
  [positions.centerLeft]: (tw, outsideRect, dialogRect) => {
    const
      left = outsideRect.left - dialogRect.width,
      top = outsideRect.top - (dialogRect.height - outsideRect.height) / 2;
    return tw.moveTo(left, top);
  },
  [positions.center]: (tw, outsideRect, dialogRect) => {
    const
      left = outsideRect.left - (dialogRect.width - outsideRect.width) / 2,
      top = outsideRect.top - (dialogRect.height - outsideRect.height) / 2;
    return tw.moveTo(left, top);
  },
  [positions.centerRight]: (tw, outsideRect, dialogRect) => {
    const
      left = outsideRect.right,
      top = outsideRect.top - (dialogRect.height - outsideRect.height) / 2;
    return tw.moveTo(left, top);
  }
};

const inside = {
  [positions.topLeft]: (tw, insideRect) => {
    return tw.moveTo(insideRect.left, insideRect.top);
  },
  [positions.topCenter]: (tw, insideRect, dialogRect) => {
    const left = insideRect.left + (insideRect.width - dialogRect.width) / 2;
    return tw.moveTo(left, insideRect.top);
  },
  [positions.topRight]: (tw, insideRect, dialogRect) => {
    const left = insideRect.left + insideRect.width - dialogRect.width;
    return tw.moveTo(left, insideRect.top);
  },
  [positions.centerLeft]: (tw, insideRect, dialogRect) => {
    const top = insideRect.top + (insideRect.height - dialogRect.height) / 2;
    return tw.moveTo(insideRect.left, top);
  },
  [positions.center]: (tw, insideRect, dialogRect) => {
    const
      left = insideRect.left + (insideRect.width - dialogRect.width) / 2,
      top = insideRect.top + (insideRect.height - dialogRect.height) / 2;
    return tw.moveTo(left, top);
  },
  [positions.centerRight]: (tw, insideRect, dialogRect) => {
    const
      left = insideRect.left + insideRect.width - dialogRect.width,
      top = insideRect.top + (insideRect.height - dialogRect.height) / 2;
    return tw.moveTo(left, top);
  },
  [positions.bottomLeft]: (tw, insideRect, dialogRect) => {
    const top = insideRect.top + insideRect.height - dialogRect.height;
    return tw.moveTo(insideRect.left, top);
  },
  [positions.bottomCenter]: (tw, insideRect, dialogRect) => {
    const
      left = insideRect.left + (insideRect.width - dialogRect.width) / 2,
      top = insideRect.top + insideRect.height - dialogRect.height;
    return tw.moveTo(left, top);
  },
  [positions.bottomRight]: (tw, insideRect, dialogRect) => {
    const
      left = insideRect.left + insideRect.width - dialogRect.width,
      top = insideRect.top + insideRect.height - dialogRect.height;
    return tw.moveTo(left, top);
  }
};

const edge = {
  [positions.topLeft]: (tw, outsideRect, dialogRect) => {
    const
      left = outsideRect.left - dialogRect.width;
    return tw.moveTo(left, outsideRect.top);
  },
  [positions.topCenter]: (tw, outsideRect, dialogRect) => {
    const
      left = outsideRect.left - (dialogRect.width - outsideRect.width) / 2,
      top = outsideRect.top - dialogRect.height;
    return tw.moveTo(left, top);
  },
  [positions.topRight]: (tw, outsideRect) => {
    const
      left = outsideRect.left + outsideRect.width,
      top = outsideRect.top;
    return tw.moveTo(left, top);
  },
  [positions.centerLeft]: (tw, outsideRect, dialogRect) => {
    const
      left = outsideRect.left - dialogRect.width,
      top = outsideRect.top + (outsideRect.height / 2);
    return tw.moveTo(left, top);
  },
  [positions.center]: (tw, outsideRect, dialogRect) => {
    const
      left = outsideRect.left + (outsideRect.width - dialogRect.width) / 2,
      top = outsideRect.top + outsideRect.height / 2;
    return tw.moveTo(left, top);
  },
  [positions.centerRight]: (tw, outsideRect) => {
    const
      left = outsideRect.left + outsideRect.width,
      top = outsideRect.top + outsideRect.height / 2;
    return tw.moveTo(left, top);
  },
  [positions.bottomLeft]: (tw, outsideRect, dialogRect) => {
    const
      left = outsideRect.left - dialogRect.width,
      top = outsideRect.top + outsideRect.height - dialogRect.height;
    return tw.moveTo(left, top);
  },
  [positions.bottomCenter]: (tw, outsideRect, dialogRect) => {
    const
      left = outsideRect.left + (outsideRect.width - dialogRect.width) / 2,
      top = outsideRect.top + outsideRect.height;
    return tw.moveTo(left, top);
  },
  [positions.bottomRight]: (tw, outsideRect, dialogRect) => {
    const
      left = outsideRect.left + outsideRect.width,
      top = outsideRect.top + outsideRect.height - dialogRect.height;
    return tw.moveTo(left, top);
  }
};

module.exports = {
  inside,
  outside,
  edge
};
