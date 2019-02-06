/*
 * Pure JavaScript for Draggable and Risizable Dialog Box
 *
 * Originally designed by ZulNs, @Gorontalo, Indonesia, 7 June 2017
 * Modified to be a re-usable component by Davyd McColl, 2019
 */

const defaultOptions = {
  title: "Tool Window",
  closeButtonText: "✖",
  buttons: [{
    text: "Ok",
    clicked: function () {
      this.close();
    }
  }],
  minWidth: 200,
  minHeight: 200,
  width: 350,
  height: 200,
  resizeHandleSize: 10,
  content: {
    type: "text",
    value: ""
  }
};

function ToolWindow(options) {

  this._options = Object.assign({}, defaultOptions, options || {});

  this._minW = this._options.minWidth;
  this._minH = this._options.minHeight;
  this._resizePixel = this._options.resizeHandleSize;
  this._hasEventListeners = !!window.addEventListener;

  this._dialog = this._mkDiv("dialog", document.body);
  this._dialog.style.width = this._px(this._options.width);
  this._dialog.style.height = this._px(this._options.heght);

  this._dialogTitle = this._mkDiv("titlebar", this._dialog);
  this._dialogTitle.innerText = this._options.title;

  this._closeButton = this._mkEl("button", "close", this._dialogTitle);
  this._closeButton.innerText = this._options.closeButtonText;
  this._closeButton.addEventListener("click", this.close.bind(this));

  this._dialogContent = this._mkDiv("content", this._dialog);
  switch (this._options.content.type) {
    case "text":
      this._dialogContent.innerText = this._options.content.value;
      break;
    case "html":
    case "text/html":
      this._dialogContent.innerHTML = this._options.content.value;
      break;
    case "url":
      const iframe = this._mkEl("iframe", "content-iframe", this._dialogContent);
      iframe.src = this._options.content.value;
      break;
    default:
      throw new Error("Content type not supported: " + (this.options.content.type || "(not set)"));
  }
  // TODO: fill in the actual content from the options

  this._buttonBar = this._mkDiv("button-bar", this._dialog);

  this._buttons = this._options.buttons.map((button) => {
    const btn = this._mkEl("button", "dialog-button", this._buttonBar);
    btn.innerText = button.text;
    if (btn.clicked) {
      btn.addEventListener("click", ev => {
        button.clicked.apply(this, ev);
      });
    }
  });

  this._isDrag = false;
  this._isResize = false;
  this._isButton = false;
  this._isButtonHovered = false;
  this._resizeMode = '';
  this._whichButton = undefined;

  this._initialPlacementDone = false;

  this._init();
}

ToolWindow.prototype = {
  show: function () {
    // TODO: optionally determine initial placement from
    //  a provided event object

    this._dialog.style.display = 'block';
    var autoFocus = this._buttons[this._buttons.length - 1];
    if (autoFocus) {
      autoFocus.focus();
    }
    if (!this._initialPlacementDone) {
      var left = (window.innerWidth - this._options.width) / 2;
      var top = (window.innerHeight - this._options.height) / 2;
      this.moveTo(left, top, this._options.width, this._options.height);
      this._initialPlacementDone = true;
    }
  },

  close: function () {
    this._dialog.style.display = "none";
  },

  _px: function (value) {
    value = (value || "0") + "";
    return value.match(/px$/)
      ? value
      : value + "px";
  },

  _mkDiv(classList, parent) {
    return this._mkEl("div", classList, parent);
  },
  _mkEl(tag, classList, parent) {
    const el = document.createElement(tag);
    if (classList) {
      if (!Array.isArray(classList)) {
        classList = [classList];
      }
      classList.forEach(function (c) {
        el.classList.add(c);
      });
    }
    if (parent) {
      parent.appendChild(el);
    }
    return el;
  },

  _init: function () {
    this._setDialogContentSizing();
    this._addEvent(this._dialog, 'mousedown', this._onMouseDown.bind(this));
    this._addEvent(document, 'mousemove', this._onMouseMove.bind(this));
    this._addEvent(document, 'mouseup', this._onMouseUp.bind(this));
    this._addEvent(this._dialog, "mouseout", this._resetMouseDown.bind(this));

    this._minW = Math.max(this._minW, (this._buttons.length - 1) * 84 + 13);
    this._minW = Math.max(this._minW, (this._buttons.length - 1) * 84 + 13);
    this._dialog.style.display = 'none';
  },

  _addEvent: function (elm, evt, callback) {
    if (elm == null || typeof (elm) === undefined) {
      return;
    }
    if (this._hasEventListeners) {
      elm.addEventListener(evt, callback, false);
    } else if (elm.attachEvent) {
      elm.attachEvent('on' + evt, callback);
    } else {
      elm['on' + evt] = callback;
    }
  },

  _returnEvent: function (evt) {
    if (evt.stopPropagation)
      evt.stopPropagation();
    if (evt.preventDefault)
      evt.preventDefault();
    else {
      evt.returnValue = false;
      return false;
    }
  },

  _onMouseDown: function (evt) {
    evt = evt || window.event;
    if (!evt || !evt.target) {
      return;
    }
    var rect = this._getOffset(this._dialog);
    this._maxX = Math.max(
      document.documentElement["clientWidth"],
      document.body["scrollWidth"],
      document.documentElement["scrollWidth"],
      document.body["offsetWidth"],
      document.documentElement["offsetWidth"]
    );
    this._maxY = Math.max(
      document.documentElement["clientHeight"],
      document.body["scrollHeight"],
      document.documentElement["scrollHeight"],
      document.body["offsetHeight"],
      document.documentElement["offsetHeight"]
    );
    if (rect.right > this._maxX) {
      this._maxX = rect.right;
    }
    if (rect.bottom > this._maxY) {
      this._maxY = rect.bottom;
    }
    this._startX = evt.pageX;
    this._startY = evt.pageY;
    this._startW = this._dialog.clientWidth;
    this._startH = this._dialog.clientHeight;
    this._leftPos = rect.left;
    this._topPos = rect.top;
    if (this._isButtonHovered) {
      this._isButtonHovered = false;
      this._isButton = true;
    } else if (evt.target === this._dialogTitle && this._resizeMode === '') {
      this._setCursor('move');
      this._isDrag = true;
    } else if (this._resizeMode !== '') {
      this._isResize = true;
    }
    return this._returnEvent(evt);
  },

  moveTo: function (left, top, width, height) {
    if (left !== undefined) {
      this._dialog.style.left = this._px(left);
    }
    if (top !== undefined) {
      this._dialog.style.top = this._px(top);
    }
    this.resizeTo(width, height);
  },

  _doDrag: function (evt) {
    var dx = this._startX - evt.pageX,
      dy = this._startY - evt.pageY,
      left = this._leftPos - dx,
      top = this._topPos - dy,
      scrollL = Math.max(document.body.scrollLeft, document.documentElement.scrollLeft),
      scrollT = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
    if (dx < 0) {
      if (left + this._startW > this._maxX)
        left = this._maxX - this._startW;
    }
    if (dx > 0 && left < 0) {
      left = 0;
    }
    if (dy < 0 && (top + this._startH > this._maxY)) {
      top = this._maxY - this._startH;
    }
    if (dy > 0 && top < 0) {
      top = 0;
    }
    this.moveTo(left, top);

    if (evt.clientY > window.innerHeight - 32) {
      scrollT += 32;
    } else if (evt.clientY < 32) {
      scrollT -= 32;
    }

    if (evt.clientX > window.innerWidth - 32) {
      scrollL += 32;
    } else if (evt.clientX < 32) {
      scrollL -= 32;
    }

    if (top + this._startH === this._maxY) {
      scrollT = this._maxY - window.innerHeight + 20;
    } else if (top === 0) {
      scrollT = 0;
    }
    if (left + this._startW === this._maxX) {
      scrollL = this._maxX - window.innerWidth + 20;
    } else if (left === 0) {
      scrollL = 0;
    }

    if (this._startH > window.innerHeight) {
      if (evt.clientY < window.innerHeight / 2) {
        scrollT = 0;
      } else {
        scrollT = this._maxY - window.innerHeight + 20;
      }
    }
    if (this._startW > window.innerWidth) {
      if (evt.clientX < window.innerWidth / 2) {
        scrollL = 0;
      } else {
        scrollL = this._maxX - window.innerWidth + 20;
      }
    }
    window.scrollTo(scrollL, scrollT);
  },

  resizeTo(width, height) {
    if (width !== undefined) {
      this._dialog.style.width = this._px(width);
    }
    if (height !== undefined) {
      this._dialog.style.height = this._px(height);
    }
  },

  _doResize: function (evt) {
    var dw, dh, w, h;
    console.log("resizeMode", this._resizeMode);
    if (this._resizeMode === 'w') {
      dw = this._startX - evt.pageX;
      if (this._leftPos - dw < 0) {
        dw = this._leftPos;
      }
      w = this._startW + dw;
      if (w < this._minW) {
        w = this._minW;
        dw = w - this._startW;
      }
      this.resizeTo(w);
      this.moveTo(this._leftPos - dw);
    } else if (this._resizeMode === 'e') {
      dw = evt.pageX - this._startX;
      if (this._leftPos + this._startW + dw > this._maxX)
        dw = this._maxX - this._leftPos - this._startW;
      w = this._startW + dw;
      if (w < this._minW)
        w = this._minW;
      this.resizeTo(w);
    } else if (this._resizeMode === 'n') {
      dh = this._startY - evt.pageY;
      if (this._topPos - dh < 0)
        dh = this._topPos;
      h = this._startH + dh;
      if (h < this._minH) {
        h = this._minH;
        dh = h - this._startH;
      }
      this.resizeTo(undefined, h);
      this.moveTo(undefined, this._topPos - dh);
    } else if (this._resizeMode === 's') {
      dh = evt.pageY - this._startY;
      if (this._topPos + this._startH + dh > this._maxY)
        dh = this._maxY - this._topPos - this._startH;
      h = this._startH + dh;
      if (h < this._minH)
        h = this._minH;
      this.resizeTo(undefined, h);
    } else if (this._resizeMode === 'nw') {
      dw = this._startX - evt.pageX;
      dh = this._startY - evt.pageY;
      if (this._leftPos - dw < 0)
        dw = this._leftPos;
      if (this._topPos - dh < 0)
        dh = this._topPos;
      w = this._startW + dw;
      h = this._startH + dh;
      if (w < this._minW) {
        w = this._minW;
        dw = w - this._startW;
      }
      if (h < this._minH) {
        h = this._minH;
        dh = h - this._startH;
      }
      this.resizeTo(w, h);
      this.moveTo(this._leftPos - dw, this._topPos - dh);
    } else if (this._resizeMode === 'sw') {
      dw = this._startX - evt.pageX;
      dh = evt.pageY - this._startY;
      if (this._leftPos - dw < 0)
        dw = this._leftPos;
      if (this._topPos + this._startH + dh > this._maxY)
        dh = this._maxY - this._topPos - this._startH;
      w = this._startW + dw;
      h = this._startH + dh;
      if (w < this._minW) {
        w = this._minW;
        dw = w - this._startW;
      }
      if (h < this._minH) {
        h = this._minH;
      }
      this.resizeTo(w, h);
      this.moveTo(this._leftPos - dw);
    } else if (this._resizeMode === 'ne') {
      dw = evt.pageX - this._startX;
      dh = this._startY - evt.pageY;
      if (this._leftPos + this._startW + dw > this._maxX)
        dw = this._maxX - this._leftPos - this._startW;
      if (this._topPos - dh < 0)
        dh = this._topPos;
      w = this._startW + dw;
      h = this._startH + dh;
      if (w < this._minW)
        w = this._minW;
      if (h < this._minH) {
        h = this._minH;
        dh = h - this._startH;
      }
      this.resizeTo(w, h);
      this.moveTo(undefined, this._topPos - dh);
    } else if (this._resizeMode === 'se') {
      dw = evt.pageX - this._startX;
      dh = evt.pageY - this._startY;
      if (this._leftPos + this._startW + dw > this._maxX)
        dw = this._maxX - this._leftPos - this._startW;
      if (this._topPos + this._startH + dh > this._maxY)
        dh = this._maxY - this._topPos - this._startH;
      w = this._startW + dw;
      h = this._startH + dh;
      if (w < this._minW)
        w = this._minW;
      if (h < this._minH)
        h = this._minH;
      this.resizeTo(w, h);
    }
    this._setDialogContentSizing();
  },



  _onMouseMove: function (evt) {
    evt = evt || window.event;
    if (!evt || !evt.target) {
      return;
    }
    if (this._isDrag) {
      this._doDrag(evt);
    } else if (this._isResize) {
      this._doResize(evt);
    } else if (!this._isButton) {
      var cs, rm = '';
      if (evt.target === this._dialog ||
        evt.target === this._dialogTitle ||
        this._dialog.contains(evt.target)) {
        var rect = this._getOffset(this._dialog);
        if (evt.pageY < rect.top + this._resizePixel) {
          rm = 'n';
        } else if (evt.pageY > rect.bottom - this._resizePixel) {
          rm = 's';
        }
        if (evt.pageX < rect.left + this._resizePixel) {
          rm += 'w';
        } else if (evt.pageX > rect.right - this._resizePixel) {
          rm += 'e';
        }
      }
      if (rm !== '' && this._resizeMode !== rm) {
        if (rm === 'n' || rm === 's') {
          cs = 'ns-resize';
        } else if (rm === 'e' || rm === 'w') {
          cs = 'ew-resize';
        } else if (rm === 'ne' || rm === 'sw') {
          cs = 'nesw-resize';
        } else if (rm === 'nw' || rm === 'se') {
          cs = 'nwse-resize';
        }
        this._setCursor(cs);
        this._resizeMode = rm;
      } else if (rm === '' && this._resizeMode !== '') {
        this._setCursor('');
        this._resizeMode = '';
      }
      if (evt.target.tagName.toLowerCase() === 'button' && rm === '') {
        if (!this._isButtonHovered || this._isButtonHovered && evt.target !== this._whichButton) {
          this._isButtonHovered = true;
        }
      } else if (this._isButtonHovered) {
        this._isButtonHovered = false;
      }
    }
    return this._returnEvent(evt);
  },

  _onMouseUp: function (evt) {
    evt = evt || window.event;
    if (this._isDrag) {
      this._setCursor('');
      this._isDrag = false;
    } else if (this._isResize) {
      this._setCursor('');
      this._isResize = false;
      this._resizeMode = '';
    } else if (this._isButton) {
      this._whichButton.classList.remove('active');
      this._isButton = false;
    }
    return this._returnEvent(evt);
  },

  _getOffset: function (elm) {
    var rect = elm.getBoundingClientRect(),
      offsetX = window.scrollX || document.documentElement.scrollLeft,
      offsetY = window.scrollY || document.documentElement.scrollTop;
    return {
      left: rect.left + offsetX,
      top: rect.top + offsetY,
      right: rect.right + offsetX,
      bottom: rect.bottom + offsetY
    }
  },

  _setCursor: function (cur) {
    this._dialog.style.cursor = cur;
    this._dialogTitle.style.cursor = cur;
  },

  _setDialogContentSizing: function () {
  },
};

module.exports = {
  ToolWindow: ToolWindow
};
