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
  position: "auto", // can be any of: "auto", "topLeft", "topCenter", "topRight", "centerLeft", "center", "centerRight", "bottomLeft", "bottomCenter", "bottomRight"
  relativePosition: "inside", // "inside" or "outside"
  relativeToElement: null
};

let zIndex = 1000;

const positionRelations = {
  inside: "inside",
  outside: "outside"
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

const insidePositioners = {
  [positions.center]: (tw, insideRect, dialogRect) => {
    const
      left = insideRect.left + (insideRect.width - dialogRect.width) / 2,
      top = insideRect.top + (insideRect.height - dialogRect.height) / 2;
    return tw.moveTo(left, top);
  },
  [positions.topLeft]: (tw, insideRect) => {
    return tw.moveTo(insideRect.left, insideRect.top);
  },
  [positions.topCenter]: (tw, insideRect, dialogRect) => {
    const left = insideRect.left + (insideRect.width - dialogRect.width) / 2;
    return tw.moveTo(left, insideRect.top);
  },
  [positions.topRight]: (tw, insideRect, dialogRect) => {
    const left = insideRect - dialogRect.width;
    return tw.moveTo(left, insideRect.top);
  },
  [positions.centerLeft]: (tw, insideRect, dialogRect) => {
    const top = insideRect.top - (insideRect.height - dialogRect.height) / 2;
    return tw.moveTo(insideRect.left, top);
  },
  [positions.centerRight]: (tw, insideRect, dialogRect) => {
    const
      left = insideRect.left + insideRect.width - dialogRect.width,
      top = insideRect.top - (insideRect.height - dialogRect.height) / 2;
    return tw.moveTo(left, top);
  },
  [positions.bottomLeft]: (tw, insideRect, dialogRect) => {
    const top = insideRect.top + insideRect.height - dialogRect.height;
    return tw.moveTo(insideRect.left, top);
  },
  [positions.bottomCenter]: (tw, insideRect, dialogRect) => {
    const
      left = insideRect.left + (insideRect.width - dialogRect.width / 2),
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

function warn() {
  const args = Array.from(arguments);
  if (typeof args[0] === "string") {
    args[0] = "ToolWindow warning: " + args[0];
  } else {
    args.unshift("ToolWindow warning:");
  }
  console.warn.apply(console, args);
}

function ToolWindow(options) {

  this._options = Object.assign({}, defaultOptions, options || {});
  if (this._options.minZIndex > zIndex) {
    zIndex = this._options.minZIndex;
  }

  this._minW = this._options.minWidth;
  this._minH = this._options.minHeight;
  if (this._options.width < this._minW) {
    this._options.width = this._minW;
  }
  if (this._options.height < this._minH) {
    this._options.height = this._minH;
  }
  this._resizePixel = this._options.resizeHandleSize;
  this._hasEventListeners = !!window.addEventListener;
  this._isDrag = false;
  this._isResize = false;
  this._isButton = false;
  this._resizeMode = '';
  this._initialPlacementDone = false;

  this._createDialogStructure();
  this._bindMouseEvents();

  // TODO: fix this magick -- should probably be calculated on first show,
  //  once the buttons are actually rendered
  this._minW = Math.max(this._minW, (this._buttons.length - 1) * 84 + 13);
  this._minW = Math.max(this._minW, (this._buttons.length - 1) * 84 + 13);

  this._shownCount = 0;
}

ToolWindow.prototype = {
  get content() {
    return this._options.content;
  },
  set content(value) {
    this._options.content = value;
  },

  get _maxW() {
    return this._options.maxWidth < 1
      ? (this._options.keepOnScreen ? window.innerWidth : Number.MAX_SAFE_INTEGER)
      : this._options.maxWidth;
  },

  get _maxH() {
    return this._options.maxHeight < 1
      ? (this._options.keepOnScreen ? window.innerHeight : Number.MAX_SAFE_INTEGER)
      : this._options.maxHeight;
  },

  show() {
    // TODO: optionally determine initial placement from
    //  a provided event object

    this._dialog.style.display = 'block';
    const autoFocus = this._buttons[this._buttons.length - 1];
    if (autoFocus) {
      autoFocus.focus();
    }
    if (!this._initialPlacementDone) {
      const left = this._options.left === undefined
        ? (window.innerWidth - this._options.width) / 2
        : this._options.left;
      const top = this._options.top === undefined
        ? (window.innerHeight - this._options.height) / 2
        : this._options.top;
      this._initialPlacementDone = true;
      this.moveTo(left, top, this._options.width, this._options.height);
    }
    this.refresh();
    if (this._shownCount === 0 &&
      this._options.autoFitContent) {
      this.fitContent();
    }
    this._shownCount++;
  },

  hide() {
    this._dialog.style.display = "none";
  },

  refresh() {
    if (!this._options.content) {
      this._setText("No content defined");
      return;
    }
    switch (this._options.content.type) {
      case "text":
        this._fetchContent(result => this._setText(result));
        break;
      case "html":
      case "text/html":
        this._fetchContent(result => this._setHTML(result));
        break;
      case "url":
        let iframe = this._dialogContent.querySelector("iframe");
        if (!iframe) {
          this._setText(null);
          iframe = this._mkEl("iframe", "content-iframe", this._dialogContent);
        }
        this._fetchContent(result => {
          if (iframe.src === result) {
            iframe.src = "about:blank";
            window.setTimeout(() => {
              iframe.src = result;
            }, 0);
          } else {
            iframe.src = result;
          }
        });
        break;
      default:
        throw new Error("Content type not handled: " + (this._options.content.type || "(not set)"));
    }
  },

  get dimensions() {
    return [
      "top",
      "left",
      "width",
      "height"
    ].reduce((acc, cur) => {
      acc[cur] = parseInt(this._dialog.style[cur]);
      return acc;
    }, {});
  },

  fitContent() {
    const ctx = {
      self: this,
      rounds: 0,
      lastDimensions: this.dimensions
    };
    window.setTimeout(function adjust() {
      if (ctx.self._shownCount < 2) {
        ctx.self.moveToConfiguredStartPosition();
      }
      const currentDimensions = ctx.self.dimensions;
      if (ctx.rounds > 0 &&
        currentDimensions.width === ctx.lastDimensions.width &&
        currentDimensions.height === ctx.lastDimensions.height) {
        // resize may be blocked by max sizing
        return;
      }
      ctx.rounds++;
      const heightDelta = ctx.self._dialogContent.scrollHeight - ctx.self._dialogContent.clientHeight;
      if (heightDelta > 0) {
        const
          delta = Math.min(heightDelta, 10),
          half = Math.round(delta / 2);
        ctx.self.moveTo(`-${half}`, `-${half}`, `+${delta}`, `+${delta}`);
      } else if (heightDelta < 0) {
        const
          delta = Math.max(heightDelta, -10),
          half = Math.abs(Math.round(delta / 2));
        ctx.self.moveTo(`-${half}`, `-${half}`, `${delta}`, `${delta}`);
      }
      ctx.lastDimensions = currentDimensions;
      window.setTimeout(adjust, 1);
    }, 1);
  },

  moveToConfiguredStartPosition() {
    if (this._options.position === positions.auto) {
      return;
    }
    this._relativeElement = this._relativeElement || this._findRelativeElement();
    if (!this._relativeElement) {
      return;
    }
    const relative = this._options.relativePosition || positionRelations.inside;
    if (relative === positionRelations.inside) {
      this.positionInside(this._relativeElement, this._options.position);
    } else {
      this.positionOutside(this._relativeElement, this._options.position);
    }
  },

  positionInside(el, pos) {
    const
      insideRect = el.getBoundingClientRect(),
      dialogRect = this._dialog.getBoundingClientRect();
    const positioner = insidePositioners[pos];
    if (!positioner) {
      return console.error("position not understood: " + (pos || "nuffin!"));
    }
    positioner(this, insideRect, dialogRect);
  },

  positionOutside(el, pos) {
  },

  _findRelativeElement() {
    const rel = this._options.relativeToElement;
    if (!rel) {
      return null;
    }
    return typeof rel === "string"
      ? this._tryFindElementBySelector(rel)
      : rel;
  },

  _tryFindElementBySelector(selector) {
    if (!selector) {
      return null;
    }
    const results = document.querySelectorAll(selector);
    if (results.length === 0) {
      warn("unable to find any element with selector '" + selector + "'");
    } else if (results.length > 0) {
      warn("multiple elements matched by selector '" + selector + "' (first will be used)");
    }
    return results[0];
  },

  moveTo(left, top, width, height) {
    if (left !== undefined && left !== null) {
      left = this._grokRelative(left, this._dialog.style.left);
      if (left < 0) {
        left = 0;
      }
      left = Math.min(left, window.innerWidth - 5);
      this._dialog.style.left = this._px(left);
    }
    if (top !== undefined && left !== null) {
      top = this._grokRelative(top, this._dialog.style.top);
      if (top < 0) {
        top = 0;
      }
      top = Math.min(top, window.innerHeight - 5);
      this._dialog.style.top = this._px(top);
    }
    this.resizeTo(width, height);
    this.boundWithinScreen();
  },

  boundWithinScreen() {
    if (!this._options.keepOnScreen) {
      return;
    }
    const dimensions = this.dimensions;
    if (dimensions.width > window.innerWidth) {
      this.resizeTo(window.innerWidth);
    }
    if (dimensions.height > window.innerHeight) {
      this.resizeTo(null, window.innerHeight);
    }
    if (dimensions.left < 0) {
      this.moveTo(0);
    }
    if (dimensions.left + dimensions.width > window.innerWidth) {
      this.moveTo(window.innerWidth - dimensions.width);
    }
    if (dimensions.top < 0) {
      this.moveTo(0);
    }
    if (dimensions.top + dimensions.height > window.innerHeight) {
      this.moveTo(null, window.innerHeight - dimensions.height);
    }
  },

  resizeTo(width, height) {
    if (width !== undefined && width !== null) {
      width = this._grokRelative(width, this._dialog.style.width);
      if (width > this._maxW) {
        width = this._maxW;
      }
      this._dialog.style.width = this._px(width);
    }
    if (height !== undefined && height !== null) {
      height = this._grokRelative(height, this._dialog.style.height);
      if (height > this._maxH) {
        height = this._maxH;
      }
      this._dialog.style.height = this._px(height);
    }
    this._fitContentCoverOverContent();
  },

  _grokRelative(sizeSetting, currentSetting) {
    if (typeof sizeSetting !== "string") {
      return sizeSetting;
    }
    let
      delta = parseInt(sizeSetting),
      current = parseInt(currentSetting);
    if (isNaN(current)) {
      current = 0;
    }
    return current + delta;
  },

  _setText(text) {
    this._dialogContent.innerHTML = "";
    this._dialogContent.innerText = text;
  },

  _setHTML(html) {
    this._dialogContent.innerText = "";
    this._dialogContent.innerHTML = html;
  },

  _looksLikeAPromise(obj) {
    return obj && typeof (obj["then"]) === "function";
  },

  _fetchContent(callback) {
    if (typeof (this._options.content.value) === "function") {
      const result = this._options.content.value();
      if (this._looksLikeAPromise(result)) {
        result.then(content => {
          callback(content);
        });
      } else {
        callback(result);
      }
    } else {
      callback(this._options.content.value);
    }
  },

  _createDialog: function () {
    this._dialog = this._mkDiv("dialog", document.body);
    this._dialog.style.width = this._px(this._options.width);
    this._dialog.style.height = this._px(this._options.height);
    this._dialog.style.display = 'none';
    this._dialog.style.zIndex = (++zIndex).toString();
  },

  _createTitlebar() {
    this._dialogTitle = this._mkDiv("titlebar", this._dialog);
    this._dialogTitle.innerText = this._options.title;

    this._closeButton = this._mkEl("button", "close", this._dialogTitle);
    this._closeButton.innerText = this._options.closeButtonText;
    this._closeButton.addEventListener("click", this.hide.bind(this));
  },

  _createContentArea() {
    this._dialogContent = this._mkDiv("content", this._dialog);
    this._coverContentDuringMoveAndResize = this._options.content.type === "url";
  },

  _createButtonBar() {
    if (this._options.buttons.length === 0) {
      this._dialogContent.classList.add("no-buttons");
      this._buttons = [];
      return;
    }

    this._buttonBar = this._mkDiv("button-bar", this._dialog);
    this._buttons = this._options.buttons.map((def) => {
      const btn = this._mkEl("button", "dialog-button", this._buttonBar);
      btn.innerText = def.text;
      if (def.clicked) {
        btn.addEventListener("click", ev => {
          btn.disabled = true;
          let returnState = false;
          try {
            const result = def.clicked.apply(this, ev);
            if (this._looksLikeAPromise(result)) {
              returnState = true;
              result.then(() => {
                btn.disabled = false;
              }).catch(err => {
                console.error(err);
                btn.disabled = false;
              });
            }
          } catch (e) {
            console.error(e);
          }
          btn.disabled = returnState;
        });
      }
    });
  },

  _createGrippers() {
    this._mkDiv(["gripper", "left"], this._dialog);
    this._mkDiv(["gripper", "right"], this._dialog);
  },

  _createDialogStructure: function () {
    this._createDialog();
    this._createTitlebar();
    this._createContentArea();
    this._createButtonBar();
    this._createGrippers();
  },

  _bindMouseEvents() {
    this._setDialogContentSizing();
    this._addEvent(this._dialog, 'mousedown', this._onMouseDown.bind(this));
    this._addEvent(document, 'mousemove', this._onMouseMove.bind(this));
    this._addEvent(document, 'mouseup', this._onMouseUp.bind(this));
  },

  _raiseDialog() {
    this._dialog.style.zIndex = (++zIndex).toString();
  },

  _px(value) {
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

  _addEvent(elm, evt, callback) {
    if (elm == null || typeof (elm) === undefined) {
      return;
    }
    if (this._hasEventListeners) {
      elm.addEventListener(evt, callback, false);
    } else if (elm["attachEvent"]) {
      elm["attachEvent"]('on' + evt, callback);
    } else {
      elm['on' + evt] = callback;
    }
  },

  _returnEvent(evt) {
    if (evt.stopPropagation)
      evt.stopPropagation();
    if (evt.preventDefault)
      evt.preventDefault();
    else {
      evt.returnValue = false;
      return false;
    }
  },

  _onMouseDown(evt) {
    this._raiseDialog();
    evt = evt || window.event;
    if (!evt || !evt.target) {
      return;
    }
    const rect = this._getOffset(this._dialog);
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

    if (evt.target === this._dialogTitle && this._resizeMode === '') {
      this._setCursor('move');
      this._isDrag = true;
    } else if (this._resizeMode !== '') {
      this._isResize = true;
    }
    if (this._coverContentDuringMoveAndResize) {
      this._createContentCover();
    }
    return this._returnEvent(evt);
  },

  _createContentCover() {
    if (this._contentCover) {
      this._contentCover.remove();
    }
    this._contentCover = this._mkDiv(undefined, this._dialog);
    this._fitContentCoverOverContent();
  },

  _fitContentCoverOverContent() {
    if (!this._contentCover) {
      return;
    }
    const cover = this._contentCover,
      style = cover.style,
      contentRect = this._dialogContent.getBoundingClientRect(),
      titleRect = this._dialogTitle.getBoundingClientRect();

    style.width = this._px(contentRect.width);
    style.height = this._px(contentRect.height);
    style.top = this._px(titleRect.height);
    style.left = "0px";
    style.position = "absolute";
    style.background = "transparent";
    style.zIndex = "9999";
  },

  _removeContentCover() {
    if (this._contentCover) {
      this._contentCover.remove();
    }
    this._contentCover = undefined;
  },

  _doDrag(evt) {
    let dx = this._startX - evt.pageX,
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

  _doResize(evt) {
    let dw, dh, w, h;
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

  _onMouseMove(evt) {
    evt = evt || window.event;
    if (!evt || !evt.target) {
      return;
    }
    if (this._isDrag) {
      this._doDrag(evt);
    } else if (this._isResize) {
      this._doResize(evt);
    } else if (!this._isButton) {
      let cs, rm = '';
      if (evt.target === this._dialog ||
        evt.target === this._dialogTitle ||
        this._dialog.contains(evt.target)) {
        const rect = this._getOffset(this._dialog);
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
    }
    return this._returnEvent(evt);
  },

  _onMouseUp(evt) {
    evt = evt || window.event;
    if (this._isDrag) {
      this._setCursor('');
      this._isDrag = false;
    } else if (this._isResize) {
      this._setCursor('');
      this._isResize = false;
      this._resizeMode = '';
    } else if (this._isButton) {
      this._isButton = false;
    }
    this._removeContentCover();
    return this._returnEvent(evt);
  },

  _getOffset(elm) {
    const rect = elm.getBoundingClientRect(),
      offsetX = window.scrollX || document.documentElement.scrollLeft,
      offsetY = window.scrollY || document.documentElement.scrollTop;
    return {
      left: rect.left + offsetX,
      top: rect.top + offsetY,
      right: rect.right + offsetX,
      bottom: rect.bottom + offsetY
    }
  },

  _setCursor(cur) {
    this._dialog.style.cursor = cur;
    this._dialogTitle.style.cursor = cur;
  },

  _setDialogContentSizing() {
  },
};

ToolWindow.positions = positions;
ToolWindow.positionRelations = positionRelations;

module.exports = {
  ToolWindow: ToolWindow
};
