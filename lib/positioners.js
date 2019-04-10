const {positions} = require("./config");

const outside = {
  [positions.topLeft]: (moveFn, outsideRect, dialogRect) => {
    const
      left = outsideRect.left - dialogRect.width,
      top = outsideRect.top - dialogRect.height;
    return moveFn(left, top);
  },
  [positions.topCenter]: (moveFn, outsideRect, dialogRect) => {
    const
      left = outsideRect.left + (outsideRect.width - dialogRect.width) / 2,
      top = outsideRect.top - dialogRect.height;
    return moveFn(left, top);
  },
  [positions.topRight]: (moveFn, outsideRect, dialogRect) => {
    const
      left = outsideRect.right,
      top = outsideRect.top - dialogRect.height;
    return moveFn(left, top);
  },
  [positions.centerLeft]: (moveFn, outsideRect, dialogRect) => {
    const
      left = outsideRect.left - dialogRect.width,
      top = outsideRect.top - (dialogRect.height - outsideRect.height) / 2;
    return moveFn(left, top);
  },
  [positions.center]: (moveFn, outsideRect, dialogRect) => {
    const
      left = outsideRect.left - (dialogRect.width - outsideRect.width) / 2,
      top = outsideRect.top - (dialogRect.height - outsideRect.height) / 2;
    return moveFn(left, top);
  },
  [positions.centerRight]: (moveFn, outsideRect, dialogRect) => {
    const
      left = outsideRect.right,
      top = outsideRect.top - (dialogRect.height - outsideRect.height) / 2;
    return moveFn(left, top);
  }
};

const inside = {
  [positions.topLeft]: (moveFn, insideRect) => {
    return moveFn(insideRect.left, insideRect.top);
  },
  [positions.topCenter]: (moveFn, insideRect, dialogRect) => {
    const left = insideRect.left + (insideRect.width - dialogRect.width) / 2;
    return moveFn(left, insideRect.top);
  },
  [positions.topRight]: (moveFn, insideRect, dialogRect) => {
    const left = insideRect.left + insideRect.width - dialogRect.width;
    return moveFn(left, insideRect.top);
  },
  [positions.centerLeft]: (moveFn, insideRect, dialogRect) => {
    const top = insideRect.top + (insideRect.height - dialogRect.height) / 2;
    return moveFn(insideRect.left, top);
  },
  [positions.center]: (moveFn, insideRect, dialogRect) => {
    const
      left = insideRect.left + (insideRect.width - dialogRect.width) / 2,
      top = insideRect.top + (insideRect.height - dialogRect.height) / 2;
    return moveFn(left, top);
  },
  [positions.centerRight]: (moveFn, insideRect, dialogRect) => {
    const
      left = insideRect.left + insideRect.width - dialogRect.width,
      top = insideRect.top + (insideRect.height - dialogRect.height) / 2;
    return moveFn(left, top);
  },
  [positions.bottomLeft]: (moveFn, insideRect, dialogRect) => {
    const top = insideRect.top + insideRect.height - dialogRect.height;
    return moveFn(insideRect.left, top);
  },
  [positions.bottomCenter]: (moveFn, insideRect, dialogRect) => {
    const
      left = insideRect.left + (insideRect.width - dialogRect.width) / 2,
      top = insideRect.top + insideRect.height - dialogRect.height;
    return moveFn(left, top);
  },
  [positions.bottomRight]: (moveFn, insideRect, dialogRect) => {
    const
      left = insideRect.left + insideRect.width - dialogRect.width,
      top = insideRect.top + insideRect.height - dialogRect.height;
    return moveFn(left, top);
  }
};

const horizontalEdge = {
  [positions.topLeft]: (moveFn, outsideRect, dialogRect) => {
    const
      left = outsideRect.left - dialogRect.width;
    return moveFn(left, outsideRect.top);
  },
  [positions.topCenter]: (moveFn, outsideRect, dialogRect) => {
    const
      left = outsideRect.left - (dialogRect.width - outsideRect.width) / 2,
      top = outsideRect.top - dialogRect.height;
    return moveFn(left, top);
  },
  [positions.topRight]: (moveFn, outsideRect) => {
    const
      left = outsideRect.left + outsideRect.width,
      top = outsideRect.top;
    return moveFn(left, top);
  },
  [positions.centerLeft]: (moveFn, outsideRect, dialogRect) => {
    const
      left = outsideRect.left - dialogRect.width,
      top = outsideRect.top + (outsideRect.height / 2);
    return moveFn(left, top);
  },
  [positions.center]: (moveFn, outsideRect, dialogRect) => {
    const
      left = outsideRect.left + (outsideRect.width - dialogRect.width) / 2,
      top = outsideRect.top + outsideRect.height / 2;
    return moveFn(left, top);
  },
  [positions.centerRight]: (moveFn, outsideRect) => {
    const
      left = outsideRect.left + outsideRect.width,
      top = outsideRect.top + outsideRect.height / 2;
    return moveFn(left, top);
  },
  [positions.bottomLeft]: (moveFn, outsideRect, dialogRect) => {
    const
      left = outsideRect.left - dialogRect.width,
      top = outsideRect.top + outsideRect.height - dialogRect.height;
    return moveFn(left, top);
  },
  [positions.bottomCenter]: (moveFn, outsideRect, dialogRect) => {
    const
      left = outsideRect.left + (outsideRect.width - dialogRect.width) / 2,
      top = outsideRect.top + outsideRect.height;
    return moveFn(left, top);
  },
  [positions.bottomRight]: (moveFn, outsideRect, dialogRect) => {
    const
      left = outsideRect.left + outsideRect.width,
      top = outsideRect.top + outsideRect.height - dialogRect.height;
    return moveFn(left, top);
  }
};

const verticalEdge = {
  [positions.topLeft]: (moveFn, outsideRect, dialogRect) => {
    const top = outsideRect.top - dialogRect.height;
    return moveFn(outsideRect.left, top);
  },
  [positions.topCenter]: (moveFn, outsideRect, dialogRect) => {
    const
      top = outsideRect.top - dialogRect.height,
      left = outsideRect.left - (dialogRect.width - outsideRect.width) / 2;
    return moveFn(left, top);
  },
  [positions.topRight]: (moveFn, outsideRect, dialogRect) => {
    const
      top = outsideRect.top - dialogRect.height,
      left = outsideRect.right - dialogRect.width;
    return moveFn(left, top);
  },
  [positions.centerLeft]: (moveFn, outsideRect, dialogRect) => {
    const
      top = outsideRect.top - (dialogRect.height - outsideRect.height) / 2,
      left = outsideRect.left - dialogRect.width;
    return moveFn(left, top);
  },
  [positions.center]: (moveFn, outsideRect, dialogRect) => {
    const
      top = outsideRect.top - (dialogRect.height - outsideRect.height) / 2,
      left = outsideRect.left - (dialogRect.width - outsideRect.width) / 2;
    return moveFn(left, top);
  },
  [positions.centerRight]: (moveFn, outsideRect, dialogRect) => {
    const
      top = outsideRect.top - (dialogRect.height - outsideRect.height) / 2,
      left = outsideRect.right - dialogRect.width;
    return moveFn(left, top);
  },
  [positions.bottomLeft]: (moveFn, outsideRect) => {
    return moveFn(outsideRect.left, outsideRect.bottom);
  },
  [positions.bottomCenter]: (moveFn, outsideRect, dialogRect) => {
    const
      left = outsideRect.left - (dialogRect.width - outsideRect.width) / 2;
    return moveFn(left, outsideRect.bottom);
  },
  [positions.bottomRight]: (moveFn, outsideRect, dialogRect) => {
    const
      left = outsideRect.right - dialogRect.width;
    return moveFn(left, outsideRect.bottom);
  }
};

module.exports = {
  inside,
  outside,
  horizontalEdge,
  verticalEdge
};
