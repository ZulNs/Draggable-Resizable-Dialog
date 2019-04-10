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
  },
  [positions.bottomCenter]: (moveFn, relativeRect, dialogRect) => {
    const
      left = relativeRect.left + (relativeRect.width - dialogRect.width) / 2;
    return moveFn(left, relativeRect.bottom);
  },
};

const inside = {
  [positions.topLeft]: (moveFn, relativeRect) => {
    return moveFn(relativeRect.left, relativeRect.top);
  },
  [positions.topCenter]: (moveFn, relativeRect, dialogRect) => {
    const left = relativeRect.left + (relativeRect.width - dialogRect.width) / 2;
    return moveFn(left, relativeRect.top);
  },
  [positions.topRight]: (moveFn, relativeRect, dialogRect) => {
    const left = relativeRect.left + relativeRect.width - dialogRect.width;
    return moveFn(left, relativeRect.top);
  },
  [positions.centerLeft]: (moveFn, relativeRect, dialogRect) => {
    const top = relativeRect.top + (relativeRect.height - dialogRect.height) / 2;
    return moveFn(relativeRect.left, top);
  },
  [positions.center]: (moveFn, relativeRect, dialogRect) => {
    return outside[positions.center](moveFn, relativeRect, dialogRect);
  },
  [positions.centerRight]: (moveFn, relativeRect, dialogRect) => {
    const
      left = relativeRect.left + relativeRect.width - dialogRect.width,
      top = relativeRect.top + (relativeRect.height - dialogRect.height) / 2;
    return moveFn(left, top);
  },
  [positions.bottomLeft]: (moveFn, relativeRect, dialogRect) => {
    const top = relativeRect.top + relativeRect.height - dialogRect.height;
    return moveFn(relativeRect.left, top);
  },
  [positions.bottomCenter]: (moveFn, relativeRect, dialogRect) => {
    const
      left = relativeRect.left + (relativeRect.width - dialogRect.width) / 2,
      top = relativeRect.top + relativeRect.height - dialogRect.height;
    return moveFn(left, top);
  },
  [positions.bottomRight]: (moveFn, relativeRect, dialogRect) => {
    const
      left = relativeRect.left + relativeRect.width - dialogRect.width,
      top = relativeRect.top + relativeRect.height - dialogRect.height;
    return moveFn(left, top);
  }
};

const horizontalEdge = {
  [positions.topLeft]: (moveFn, relativeRect, dialogRect) => {
    const
      left = relativeRect.left - dialogRect.width;
    return moveFn(left, relativeRect.top);
  },
  [positions.topCenter]: (moveFn, relativeRect, dialogRect) => {
    return outside[positions.topCenter](moveFn, relativeRect, dialogRect);
  },
  [positions.topRight]: (moveFn, relativeRect) => {
    const
      left = relativeRect.left + relativeRect.width,
      top = relativeRect.top;
    return moveFn(left, top);
  },
  [positions.centerLeft]: (moveFn, relativeRect, dialogRect) => {
    const
      left = relativeRect.left - dialogRect.width,
      top = relativeRect.top + (relativeRect.height / 2);
    return moveFn(left, top);
  },
  [positions.center]: (moveFn, relativeRect, dialogRect) => {
    return outside[positions.center](moveFn, relativeRect, dialogRect);
  },
  [positions.centerRight]: (moveFn, relativeRect) => {
    const
      left = relativeRect.left + relativeRect.width,
      top = relativeRect.top + relativeRect.height / 2;
    return moveFn(left, top);
  },
  [positions.bottomLeft]: (moveFn, relativeRect, dialogRect) => {
    const
      left = relativeRect.left - dialogRect.width,
      top = relativeRect.top + relativeRect.height - dialogRect.height;
    return moveFn(left, top);
  },
  [positions.bottomCenter]: (moveFn, relativeRect, dialogRect) => {
    return outside[positions.bottomCenter](moveFn, relativeRect, dialogRect);
  },
  [positions.bottomRight]: (moveFn, relativeRect, dialogRect) => {
    const
      left = relativeRect.left + relativeRect.width,
      top = relativeRect.top + relativeRect.height - dialogRect.height;
    return moveFn(left, top);
  }
};

const verticalEdge = {
  [positions.topLeft]: (moveFn, relativeRect, dialogRect) => {
    const top = relativeRect.top - dialogRect.height;
    return moveFn(relativeRect.left, top);
  },
  [positions.topCenter]: (moveFn, relativeRect, dialogRect) => {
    return outside[positions.topCenter](moveFn, relativeRect, dialogRect);
  },
  [positions.topRight]: (moveFn, relativeRect, dialogRect) => {
    const
      top = relativeRect.top - dialogRect.height,
      left = relativeRect.right - dialogRect.width;
    return moveFn(left, top);
  },
  [positions.centerLeft]: (moveFn, relativeRect, dialogRect) => {
    const
      top = relativeRect.top - (dialogRect.height - relativeRect.height) / 2,
      left = relativeRect.left - dialogRect.width;
    return moveFn(left, top);
  },
  [positions.center]: (moveFn, relativeRect, dialogRect) => {
    return outside[positions.center](moveFn, relativeRect, dialogRect);
  },
  [positions.centerRight]: (moveFn, relativeRect, dialogRect) => {
    const
      top = relativeRect.top - (dialogRect.height - relativeRect.height) / 2,
      left = relativeRect.right - dialogRect.width;
    return moveFn(left, top);
  },
  [positions.bottomLeft]: (moveFn, relativeRect) => {
    return moveFn(relativeRect.left, relativeRect.bottom);
  },
  [positions.bottomCenter]: (moveFn, relativeRect, dialogRect) => {
    return outside[positions.bottomCenter](moveFn, relativeRect, dialogRect);
  },
  [positions.bottomRight]: (moveFn, relativeRect, dialogRect) => {
    const
      left = relativeRect.right - dialogRect.width;
    return moveFn(left, relativeRect.bottom);
  }
};

module.exports = {
  inside,
  outside,
  horizontalEdge,
  verticalEdge
};
