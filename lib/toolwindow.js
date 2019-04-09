/*
 * Pure JavaScript for Draggable and Risizable Dialog Box
 *
 * Originally designed by ZulNs, @Gorontalo, Indonesia, 7 June 2017
 * Modified to be a re-usable component by Davyd McColl, 2019
 */

const {defaultOptions, alignments, positions} = require("./config");
const positioners = require("./positioners");

let zIndex = 1000;

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

  // TODO: determine auto position?

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
  this._raised = false;

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

    const autoFocus = this._buttons[this._buttons.length - 1];
    if (autoFocus) {
      autoFocus.focus();
    }
    this._dialog.style.display = "block";
    this._dialog.style.opacity = "0";
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
      this.fitContent().then(() => {
        this._doShow();
      });
    } else {
      this._doShow();
    }
    this._shownCount++;
    window.setTimeout(() => this._raiseDialog(), 0);
  },

  _doShow() {
    if (this._options.animated) {
      this._animateShow();
    } else {
      this._dialog.style.display = "block";
      this._dialog.style.opacity = "1";
    }
  },

  hide() {
    if (this._options.animated) {
      this._animateClose();
    } else {
      this._dialog.style.display = "none";
    }
  },

  _animateClose() {
    this._animateOpacity(1, 0);
  },

  _animateShow() {
    this._animateOpacity(0, 1);
  },

  _animateOpacity(from, to) {
    this._dialog.style.display = "block";
    this._dialog.style.opacity = from.toString();
    const
      mul = from > to ? -1 : 1,
      final = to === 0 ? "none" : "block",
      step = mul * (this._options.animationOpacityStep || 0.1),
      frameTime = (this._options.animationTime || 1000) / 40;
    let timer = window.setInterval(() => {
      const newOpacity = parseFloat(this._dialog.style.opacity) + step;
      if ((from > to && newOpacity <= to) ||
          (to > from && newOpacity >= to )) {
        this._dialog.style.display = final;
        this._dialog.style.opacity = to.toString();
        return window.clearInterval(timer);
      }
      this._dialog.style.opacity = newOpacity.toString();
    }, frameTime);
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
    return new Promise((resolve) => {
      window.setTimeout(function adjust() {
        if (ctx.self._shownCount < 2) {
          ctx.self.moveToConfiguredStartPosition();
        }
        const currentDimensions = ctx.self.dimensions;
        if (ctx.rounds > 0 &&
          currentDimensions.width === ctx.lastDimensions.width &&
          currentDimensions.height === ctx.lastDimensions.height) {
          // resize may be blocked by max sizing
          return resolve();
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
    });
  },

  moveToConfiguredStartPosition() {
    if (this._options.position === positions.auto) {
      return;
    }
    this._relativeElement = this._relativeElement || this._findRelativeElement();
    if (!this._relativeElement) {
      return;
    }
    const
      alignment = (this._options.align || alignments.inside).toLowerCase(),
      el = this._relativeElement,
      pos = this._options.position || "auto";

    this._positionWith(el, pos, alignment);
  },

  _positionWith(el, pos, alignment) {
    const
      positions = pos.split(","),
      alignments = alignment.split(",");
    for (let thisAlignment of alignments) {
      for (let thisPosition of positions) {
        const alignmentPositioners = positioners[thisAlignment];
        if (!alignmentPositioners) {
          return console.error("alignment not understood: " + (thisAlignment || "(not set"));
        }
        const positioner = alignmentPositioners[thisPosition];
        if (!positioner) {
          return console.error("position / alignment not understood: " + thisAlignment + "/" + (pos || "(not set)"));
        }
        const
          insideRect = el.getBoundingClientRect(),
          dialogRect = this._dialog.getBoundingClientRect();
        positioner(this, insideRect, dialogRect);
        if (this._withinView()) {
          return;
        }
      }
    }
  },

  _withinView() {
    const
      docEl = document.documentElement,
      viewportLeft = docEl.scrollLeft,
      viewportTop = docEl.scrollTop,
      viewportWidth = docEl.clientWidth + docEl.scrollLeft,
      viewportHeight = docEl.clientHeight + docEl.scrollTop,
      viewportRight= viewportLeft + viewportWidth,
      viewportBottom = viewportTop + viewportHeight,
      dialogRect = this._dialog.getBoundingClientRect();
    return dialogRect.top >= viewportTop &&
      dialogRect.left >= viewportLeft &&
      dialogRect.right <= viewportRight &&
      dialogRect.bottom >= viewportBottom;
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

  _createDialog() {
    this._dialog = this._mkDiv("dialog", document.body);
    this._dialog.style.width = this._px(this._options.width);
    this._dialog.style.height = this._px(this._options.height);
    this._dialog.style.display = 'none';
    this._dialog.style.zIndex = (++zIndex).toString();
    document.addEventListener("click", () => {
      this._raised = false;
    });
    if (this._options.escapeCloses) {
      this._dialog.addEventListener("click", ev => {
        return this._suppressEvent(ev);
      });
      document.addEventListener("keydown", (ev) => {
        if (!this._dialog || !this._dialog.parentElement) {
          return;
        }
        if (this._raised && ev.key === "Escape") {
          this.hide();
        }
      });
    }
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

  _createDialogStructure() {
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
    this._raised = true;
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

  _suppressEvent(evt) {
    if (evt.stopPropagation) {
      evt.stopPropagation();
    }
    if (evt.preventDefault) {
      evt.preventDefault();
    } else {
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
    return this._suppressEvent(evt);
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
    return this._suppressEvent(evt);
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
    return this._suppressEvent(evt);
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
ToolWindow.alignments = alignments;

module.exports = {
  ToolWindow: ToolWindow
};
