"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;if (!f && c) return c(i, !0);if (u) return u(i, !0);var a = new Error("Cannot find module '" + i + "'");throw a.code = "MODULE_NOT_FOUND", a;
        }var p = n[i] = { exports: {} };e[i][0].call(p.exports, function (r) {
          var n = e[i][1][r];return o(n || r);
        }, p, p.exports, r, e, n, t);
      }return n[i].exports;
    }for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
      o(t[i]);
    }return o;
  }return r;
})()({ 1: [function (require, module, exports) {
    window.ToolWindow = require("./lib/toolwindow").ToolWindow;
  }, { "./lib/toolwindow": 4 }], 2: [function (require, module, exports) {
    var defaultOptions = {
      title: "Tool Window",
      closeButtonText: "✖",
      buttons: [{
        text: "Ok",
        clicked: function clicked() {
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

    var alignments = {
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
      verticalEdge: "verticalEdge"
    };

    var positions = {
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
      defaultOptions: defaultOptions,
      alignments: alignments,
      positions: positions
    };
  }, {}], 3: [function (require, module, exports) {
    var _outside, _inside, _horizontalEdge, _verticalEdge;

    var _require = require("./config"),
        positions = _require.positions;

    var outside = (_outside = {}, _defineProperty(_outside, positions.topLeft, function (moveFn, outsideRect, dialogRect) {
      var left = outsideRect.left - dialogRect.width,
          top = outsideRect.top - dialogRect.height;
      return moveFn(left, top);
    }), _defineProperty(_outside, positions.topCenter, function (moveFn, outsideRect, dialogRect) {
      var left = outsideRect.left + (outsideRect.width - dialogRect.width) / 2,
          top = outsideRect.top - dialogRect.height;
      return moveFn(left, top);
    }), _defineProperty(_outside, positions.topRight, function (moveFn, outsideRect, dialogRect) {
      var left = outsideRect.right,
          top = outsideRect.top - dialogRect.height;
      return moveFn(left, top);
    }), _defineProperty(_outside, positions.centerLeft, function (moveFn, outsideRect, dialogRect) {
      var left = outsideRect.left - dialogRect.width,
          top = outsideRect.top - (dialogRect.height - outsideRect.height) / 2;
      return moveFn(left, top);
    }), _defineProperty(_outside, positions.center, function (moveFn, outsideRect, dialogRect) {
      var left = outsideRect.left - (dialogRect.width - outsideRect.width) / 2,
          top = outsideRect.top - (dialogRect.height - outsideRect.height) / 2;
      return moveFn(left, top);
    }), _defineProperty(_outside, positions.centerRight, function (moveFn, outsideRect, dialogRect) {
      var left = outsideRect.right,
          top = outsideRect.top - (dialogRect.height - outsideRect.height) / 2;
      return moveFn(left, top);
    }), _defineProperty(_outside, positions.bottomCenter, function (moveFn, relativeRect, dialogRect) {
      var left = relativeRect.left + (relativeRect.width - dialogRect.width) / 2;
      return moveFn(left, relativeRect.bottom);
    }), _outside);

    var inside = (_inside = {}, _defineProperty(_inside, positions.topLeft, function (moveFn, relativeRect) {
      return moveFn(relativeRect.left, relativeRect.top);
    }), _defineProperty(_inside, positions.topCenter, function (moveFn, relativeRect, dialogRect) {
      var left = relativeRect.left + (relativeRect.width - dialogRect.width) / 2;
      return moveFn(left, relativeRect.top);
    }), _defineProperty(_inside, positions.topRight, function (moveFn, relativeRect, dialogRect) {
      var left = relativeRect.left + relativeRect.width - dialogRect.width;
      return moveFn(left, relativeRect.top);
    }), _defineProperty(_inside, positions.centerLeft, function (moveFn, relativeRect, dialogRect) {
      var top = relativeRect.top + (relativeRect.height - dialogRect.height) / 2;
      return moveFn(relativeRect.left, top);
    }), _defineProperty(_inside, positions.center, function (moveFn, relativeRect, dialogRect) {
      return outside[positions.center](moveFn, relativeRect, dialogRect);
    }), _defineProperty(_inside, positions.centerRight, function (moveFn, relativeRect, dialogRect) {
      var left = relativeRect.left + relativeRect.width - dialogRect.width,
          top = relativeRect.top + (relativeRect.height - dialogRect.height) / 2;
      return moveFn(left, top);
    }), _defineProperty(_inside, positions.bottomLeft, function (moveFn, relativeRect, dialogRect) {
      var top = relativeRect.top + relativeRect.height - dialogRect.height;
      return moveFn(relativeRect.left, top);
    }), _defineProperty(_inside, positions.bottomCenter, function (moveFn, relativeRect, dialogRect) {
      var left = relativeRect.left + (relativeRect.width - dialogRect.width) / 2,
          top = relativeRect.top + relativeRect.height - dialogRect.height;
      return moveFn(left, top);
    }), _defineProperty(_inside, positions.bottomRight, function (moveFn, relativeRect, dialogRect) {
      var left = relativeRect.left + relativeRect.width - dialogRect.width,
          top = relativeRect.top + relativeRect.height - dialogRect.height;
      return moveFn(left, top);
    }), _inside);

    var horizontalEdge = (_horizontalEdge = {}, _defineProperty(_horizontalEdge, positions.topLeft, function (moveFn, relativeRect, dialogRect) {
      var left = relativeRect.left - dialogRect.width;
      return moveFn(left, relativeRect.top);
    }), _defineProperty(_horizontalEdge, positions.topCenter, function (moveFn, relativeRect, dialogRect) {
      return outside[positions.topCenter](moveFn, relativeRect, dialogRect);
    }), _defineProperty(_horizontalEdge, positions.topRight, function (moveFn, relativeRect) {
      var left = relativeRect.left + relativeRect.width,
          top = relativeRect.top;
      return moveFn(left, top);
    }), _defineProperty(_horizontalEdge, positions.centerLeft, function (moveFn, relativeRect, dialogRect) {
      var left = relativeRect.left - dialogRect.width,
          top = relativeRect.top + relativeRect.height / 2;
      return moveFn(left, top);
    }), _defineProperty(_horizontalEdge, positions.center, function (moveFn, relativeRect, dialogRect) {
      return outside[positions.center](moveFn, relativeRect, dialogRect);
    }), _defineProperty(_horizontalEdge, positions.centerRight, function (moveFn, relativeRect) {
      var left = relativeRect.left + relativeRect.width,
          top = relativeRect.top + relativeRect.height / 2;
      return moveFn(left, top);
    }), _defineProperty(_horizontalEdge, positions.bottomLeft, function (moveFn, relativeRect, dialogRect) {
      var left = relativeRect.left - dialogRect.width,
          top = relativeRect.top + relativeRect.height - dialogRect.height;
      return moveFn(left, top);
    }), _defineProperty(_horizontalEdge, positions.bottomCenter, function (moveFn, relativeRect, dialogRect) {
      return outside[positions.bottomCenter](moveFn, relativeRect, dialogRect);
    }), _defineProperty(_horizontalEdge, positions.bottomRight, function (moveFn, relativeRect, dialogRect) {
      var left = relativeRect.left + relativeRect.width,
          top = relativeRect.top + relativeRect.height - dialogRect.height;
      return moveFn(left, top);
    }), _horizontalEdge);

    var verticalEdge = (_verticalEdge = {}, _defineProperty(_verticalEdge, positions.topLeft, function (moveFn, relativeRect, dialogRect) {
      var top = relativeRect.top - dialogRect.height;
      return moveFn(relativeRect.left, top);
    }), _defineProperty(_verticalEdge, positions.topCenter, function (moveFn, relativeRect, dialogRect) {
      return outside[positions.topCenter](moveFn, relativeRect, dialogRect);
    }), _defineProperty(_verticalEdge, positions.topRight, function (moveFn, relativeRect, dialogRect) {
      var top = relativeRect.top - dialogRect.height,
          left = relativeRect.right - dialogRect.width;
      return moveFn(left, top);
    }), _defineProperty(_verticalEdge, positions.centerLeft, function (moveFn, relativeRect, dialogRect) {
      var top = relativeRect.top - (dialogRect.height - relativeRect.height) / 2,
          left = relativeRect.left - dialogRect.width;
      return moveFn(left, top);
    }), _defineProperty(_verticalEdge, positions.center, function (moveFn, relativeRect, dialogRect) {
      return outside[positions.center](moveFn, relativeRect, dialogRect);
    }), _defineProperty(_verticalEdge, positions.centerRight, function (moveFn, relativeRect, dialogRect) {
      var top = relativeRect.top - (dialogRect.height - relativeRect.height) / 2,
          left = relativeRect.right - dialogRect.width;
      return moveFn(left, top);
    }), _defineProperty(_verticalEdge, positions.bottomLeft, function (moveFn, relativeRect) {
      return moveFn(relativeRect.left, relativeRect.bottom);
    }), _defineProperty(_verticalEdge, positions.bottomCenter, function (moveFn, relativeRect, dialogRect) {
      return outside[positions.bottomCenter](moveFn, relativeRect, dialogRect);
    }), _defineProperty(_verticalEdge, positions.bottomRight, function (moveFn, relativeRect, dialogRect) {
      var left = relativeRect.right - dialogRect.width;
      return moveFn(left, relativeRect.bottom);
    }), _verticalEdge);

    module.exports = {
      inside: inside,
      outside: outside,
      horizontalEdge: horizontalEdge,
      verticalEdge: verticalEdge
    };
  }, { "./config": 2 }], 4: [function (require, module, exports) {
    /*
     * Pure JavaScript for Draggable and Risizable Dialog Box
     *
     * Originally designed by ZulNs, @Gorontalo, Indonesia, 7 June 2017
     * Modified to be a re-usable component by Davyd McColl, 2019
     */

    var _require2 = require("./config"),
        defaultOptions = _require2.defaultOptions,
        alignments = _require2.alignments,
        positions = _require2.positions;

    var positioners = require("./positioners");

    var zIndex = 1000;

    function warn() {
      var args = Array.from(arguments);
      if (typeof args[0] === "string") {
        args[0] = "ToolWindow warning: " + args[0];
      } else {
        args.unshift("ToolWindow warning:");
      }
      console.warn.apply(console, args);
    }

    function ToolWindow(options) {

      options = options || {};
      Object.keys(options).forEach(function (k) {
        if (options[k] === undefined || options[k] === null) {
          // prevent an unintentional undefined / null from overwriting default options
          delete options[k];
        }
      });
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
      this._handlingMouseEvent = false;

      if (this._options.boundingElement) {
        this._boundingElement = typeof this._options.boundingElement === "string" ? document.querySelector(this._options.boundingElement) : this._options.boundingElement;
      }

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
        return this._options.maxWidth < 1 ? this._options.keepOnScreen ? window.innerWidth : Number.MAX_SAFE_INTEGER : this._options.maxWidth;
      },

      get _maxH() {
        return this._options.maxHeight < 1 ? this._options.keepOnScreen ? window.innerHeight : Number.MAX_SAFE_INTEGER : this._options.maxHeight;
      },

      show: function show() {
        var _this = this;

        // TODO: optionally determine initial placement from
        //  a provided event object

        var autoFocus = this._buttons[this._buttons.length - 1];
        if (autoFocus) {
          autoFocus.focus();
        }
        this._dialog.style.display = "block";
        this._dialog.style.opacity = "0";
        if (!this._initialPlacementDone) {
          var left = this._options.left === undefined ? (window.innerWidth - this._options.width) / 2 : this._options.left;
          var top = this._options.top === undefined ? (window.innerHeight - this._options.height) / 2 : this._options.top;
          this._initialPlacementDone = true;
          this.moveTo(left, top, this._options.width, this._options.height);
        }
        this.refresh();
        if (this._shownCount === 0 && this._options.autoFitContent) {
          this.fitContent().then(function () {
            _this._doShow();
          });
        } else {
          this._doShow();
        }
        this._shownCount++;
        window.setTimeout(function () {
          return _this._raiseDialog();
        }, 0);
      },
      _doShow: function _doShow() {
        if (this._options.animated) {
          this._animateShow();
        } else {
          this._dialog.style.display = "block";
          this._dialog.style.opacity = "1";
        }
      },
      hide: function hide() {
        this._raised = false; // stop another Escape key from flashing this back in again
        if (this._options.animated) {
          this._animateClose();
        } else {
          this._dialog.style.display = "none";
        }
      },
      _animateClose: function _animateClose() {
        this._animateOpacity(1, 0);
      },
      _animateShow: function _animateShow() {
        this._animateOpacity(0, 1);
      },
      _animateOpacity: function _animateOpacity(from, to) {
        var _this2 = this;

        this._dialog.style.display = "block";
        this._dialog.style.opacity = from.toString();
        var mul = from > to ? -1 : 1,
            final = to === 0 ? "none" : "block",
            step = mul * (this._options.animationOpacityStep || 0.1),
            frameTime = (this._options.animationTime || 1000) / 40;
        var timer = window.setInterval(function () {
          var newOpacity = parseFloat(_this2._dialog.style.opacity) + step;
          if (from > to && newOpacity <= to || to > from && newOpacity >= to) {
            _this2._dialog.style.display = final;
            _this2._dialog.style.opacity = to.toString();
            return window.clearInterval(timer);
          }
          _this2._dialog.style.opacity = newOpacity.toString();
        }, frameTime);
      },
      refresh: function refresh() {
        var _this3 = this;

        if (!this._options.content) {
          this._setText("No content defined");
          return;
        }
        switch (this._options.content.type) {
          case "text":
            this._fetchContent(function (result) {
              return _this3._setText(result);
            });
            break;
          case "html":
          case "text/html":
            this._fetchContent(function (result) {
              return _this3._setHTML(result);
            });
            break;
          case "url":
            var iframe = this._dialogContent.querySelector("iframe");
            if (!iframe) {
              this._setText(null);
              iframe = this._mkEl("iframe", "content-iframe", this._dialogContent);
            }
            this._fetchContent(function (result) {
              if (iframe.src === result) {
                iframe.src = "about:blank";
                window.setTimeout(function () {
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
        var _this4 = this;

        var result = ["top", "left", "width", "height"].reduce(function (acc, cur) {
          acc[cur] = parseInt(_this4._dialog.style[cur]);
          return acc;
        }, {});
        result.right = result.left + result.width;
        result.bottom = result.top + result.height;
        return result;
      },

      fitContent: function fitContent() {
        var ctx = {
          self: this,
          rounds: 0,
          lastDimensions: this.dimensions
        };
        return new Promise(function (resolve) {
          window.setTimeout(function adjust() {
            if (ctx.self._shownCount < 2) {
              ctx.self.moveToConfiguredStartPosition();
            }
            var currentDimensions = ctx.self.dimensions;
            if (ctx.rounds > 0 && currentDimensions.width === ctx.lastDimensions.width && currentDimensions.height === ctx.lastDimensions.height) {
              // resize may be blocked by max sizing
              return resolve();
            }
            ctx.rounds++;
            var heightDelta = ctx.self._dialogContent.scrollHeight - ctx.self._dialogContent.clientHeight;
            if (heightDelta > 0) {
              var delta = Math.min(heightDelta, 10),
                  half = Math.round(delta / 2);
              ctx.self.moveTo("-" + half, "-" + half, "+" + delta, "+" + delta);
            } else if (heightDelta < 0) {
              var _delta = Math.max(heightDelta, -10),
                  _half = Math.abs(Math.round(_delta / 2));
              ctx.self.moveTo("-" + _half, "-" + _half, "" + _delta, "" + _delta);
            }
            ctx.lastDimensions = currentDimensions;
            window.setTimeout(adjust, 1);
          }, 1);
        });
      },
      moveToConfiguredStartPosition: function moveToConfiguredStartPosition() {
        if (this._isAutoPosition) {
          return;
        }
        this._relativeElement = this._relativeElement || this._findRelativeElement();
        if (!this._relativeElement) {
          return;
        }
        var el = this._relativeElement;

        this._positionWith(el, this._options.placement);
      },


      get _isAutoPosition() {
        var placement = (this._options.placement || "").trim().toLowerCase();
        return !placement || placement.split("|").indexOf("auto") > -1;
      },

      _positionWith: function _positionWith(el, placements) {
        var moveFn = this.moveUnconstrained.bind(this);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = placements.split("|")[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var placement = _step.value;

            var _grokPlacement = this._grokPlacement(placement),
                align = _grokPlacement.align,
                position = _grokPlacement.position;

            if (!position || !align) {
              return;
            }
            var alignmentPositioners = positioners[align];
            if (!alignmentPositioners) {
              return console.error("alignment not understood: " + align);
            }
            var positioner = alignmentPositioners[position];
            if (!positioner) {
              return console.error("position not understood for alignment '" + align + "': '" + position + "'");
            }
            var insideRect = el.getBoundingClientRect(),
                dialogRect = this._dialog.getBoundingClientRect(),
                positionResult = positioner(moveFn, insideRect, dialogRect);
            if (positionResult && this._withinView()) {
              return;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      },
      _grokPlacement: function _grokPlacement(placement) {
        var parts = placement.split(",");
        if (parts.length !== 2) {
          console.error("Bad placement: '" + placement);
          return null;
        }
        return Object.keys(alignments).indexOf(parts[0]) > -1 ? {
          align: parts[0],
          position: parts[1]
        } : {
          align: parts[1],
          position: parts[0]
        };
      },
      _withinView: function _withinView() {
        var docEl = document.documentElement,
            viewportLeft = docEl.scrollLeft,
            viewportTop = docEl.scrollTop,
            viewportWidth = docEl.clientWidth + docEl.scrollLeft,
            viewportHeight = docEl.clientHeight + docEl.scrollTop,
            viewportRight = viewportLeft + viewportWidth,
            viewportBottom = viewportTop + viewportHeight,
            dialogRect = this._dialog.getBoundingClientRect();
        return dialogRect.top >= viewportTop && dialogRect.left >= viewportLeft && dialogRect.right <= viewportRight && dialogRect.bottom <= viewportBottom;
      },
      _findRelativeElement: function _findRelativeElement() {
        var rel = this._options.relativeToElement;
        if (!rel) {
          return null;
        }
        return typeof rel === "string" ? this._tryFindElementBySelector(rel) : rel;
      },
      _tryFindElementBySelector: function _tryFindElementBySelector(selector) {
        if (!selector) {
          return null;
        }
        var results = document.querySelectorAll(selector);
        if (results.length === 0) {
          warn("unable to find any element with selector '" + selector + "'");
        } else if (results.length > 1) {
          warn("multiple elements matched by selector '" + selector + "' (first will be used)");
        }
        return results[0];
      },
      moveTo: function moveTo(left, top, width, height) {
        this._moveTo(left, top, width, height);
        this.constrain();
        return this._validatePosition(left, top, width, height);
      },
      moveUnconstrained: function moveUnconstrained(left, top, width, height) {
        this._moveTo(left, top, width, height);
        return this._validatePosition(left, top, width, height);
      },
      _validatePosition: function _validatePosition(left, top, width, height) {
        var dialogRect = this._dialog.getBoundingClientRect();
        return this._closeEnough(left, dialogRect.left) && this._closeEnough(top, dialogRect.top) && this._closeEnough(width, dialogRect.width) && this._closeEnough(height, dialogRect.height);
      },
      _closeEnough: function _closeEnough(num1, num2) {
        if (num1 === undefined || num2 === undefined || num1 === null || num2 === null) {
          return true;
        }
        return Math.abs(num1 - num2) < 1;
      },
      _moveTo: function _moveTo(left, top, width, height) {
        if (left !== undefined && left !== null) {
          left = this._grokRelative(left, this._dialog.style.left);
          if (left < 0) {
            left = 0;
          }
          left = Math.min(left, window.innerWidth - 5);
          this._dialog.style.left = this._px(left);
        }
        if (top !== undefined && top !== null) {
          top = this._grokRelative(top, this._dialog.style.top);
          if (top < 0) {
            top = 0;
          }
          this._dialog.style.top = this._px(top);
        }
        this._resizeTo(width, height);
      },


      get boundingRect() {
        return this._boundingElement ? this._boundingElement.getBoundingClientRect() : this._makeDocumentElementBoundingRect();
      },

      _makeDocumentElementBoundingRect: function _makeDocumentElementBoundingRect() {
        var rect = document.documentElement.getBoundingClientRect(),
            width = rect.width,
            height = rect.height;
        if (rect.height > window.innerHeight) {
          width -= 5; // allow for a scrollbar
        }
        return {
          top: 0,
          left: 0,
          width: width,
          height: height,
          right: width,
          bottom: height
        };
      },
      constrain: function constrain() {
        if (!this._options.keepOnScreen) {
          return;
        }
        var dimensions = this.dimensions,
            boundingRect = this.boundingRect;

        var resizeWidth = null,
            resizeHeight = null,
            moveLeft = null,
            moveTop = null;
        if (dimensions.width > boundingRect.width) {
          resizeWidth = boundingRect.width;
        }
        if (dimensions.height > boundingRect.height) {
          resizeHeight = boundingRect.height;
        }

        if (dimensions.left < boundingRect.left) {
          moveLeft = boundingRect.left;
        }
        if (dimensions.top < boundingRect.top) {
          moveTop = boundingRect.top;
        }
        if (dimensions.right > boundingRect.right) {
          moveLeft = Math.floor(boundingRect.right) - Math.ceil(dimensions.width);
        }
        if (dimensions.bottom > boundingRect.bottom) {
          // noinspection JSSuspiciousNameCombination
          moveTop = Math.floor(boundingRect.bottom) - Math.ceil(dimensions.height);
        }
        if (resizeWidth !== null || resizeHeight !== null || moveLeft !== null || moveTop !== null) {
          this._moveTo(moveLeft, moveTop, resizeWidth, resizeHeight);
        }
      },
      resizeTo: function resizeTo(width, height) {
        this._resizeTo(width, height);
        this.constrain();
      },
      _resizeTo: function _resizeTo(width, height) {
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
      _grokRelative: function _grokRelative(sizeSetting, currentSetting) {
        if (typeof sizeSetting !== "string") {
          return sizeSetting;
        }
        var delta = parseInt(sizeSetting),
            current = parseInt(currentSetting);
        if (isNaN(current)) {
          current = 0;
        }
        return current + delta;
      },
      _setText: function _setText(text) {
        this._dialogContent.innerHTML = "";
        if (typeof text !== "string") {
          text = (text || "").toString();
        }
        this._dialogContent.innerText = text;
      },
      _setHTML: function _setHTML(html) {
        this._dialogContent.innerText = "";
        if (this._looksLikeAnHTMLElement(html)) {
          this._dialogContent.appendChild(html);
        } else {
          this._dialogContent.innerHTML = html;
        }
      },
      _looksLikeAnHTMLElement: function _looksLikeAnHTMLElement(item) {
        return (typeof item === "undefined" ? "undefined" : _typeof(item)) === "object" && item.tagName !== undefined && typeof item.getAttribute === "function";
      },
      _looksLikeAPromise: function _looksLikeAPromise(obj) {
        return obj && typeof obj["then"] === "function";
      },
      _fetchContent: function _fetchContent(callback) {
        if (typeof this._options.content.value === "function") {
          var result = this._options.content.value();
          if (this._looksLikeAPromise(result)) {
            result.then(function (content) {
              callback(content);
            });
          } else {
            callback(result);
          }
        } else {
          callback(this._options.content.value);
        }
      },
      _createDialog: function _createDialog() {
        var _this5 = this;

        this._dialog = this._mkDiv("dialog", document.body);
        this._dialog.style.width = this._px(this._options.width);
        this._dialog.style.height = this._px(this._options.height);
        this._dialog.style.display = 'none';
        this._dialog.style.zIndex = (++zIndex).toString();
        document.addEventListener("click", function () {
          _this5._raised = false;
        });
        if (this._options.escapeCloses) {
          this._dialog.addEventListener("click", function (ev) {
            return _this5._suppressEvent(ev);
          });
          document.addEventListener("keydown", function (ev) {
            if (!_this5._dialog || !_this5._dialog.parentElement) {
              return;
            }
            if (_this5._raised && ev.key === "Escape") {
              _this5.hide();
            }
          });
        }
      },
      _createTitlebar: function _createTitlebar() {
        this._dialogTitle = this._mkDiv("titlebar", this._dialog);
        this._dialogTitle.innerText = this._options.title;

        this._closeButton = this._mkEl("button", "close", this._dialogTitle);
        this._closeButton.innerText = this._options.closeButtonText;
        this._closeButton.addEventListener("click", this.hide.bind(this));
      },
      _createContentArea: function _createContentArea() {
        this._dialogContent = this._mkDiv("content", this._dialog);
        this._coverContentDuringMoveAndResize = this._options.content.type === "url";
      },
      _createButtonBar: function _createButtonBar() {
        var _this6 = this;

        if (this._options.buttons.length === 0) {
          this._dialogContent.classList.add("no-buttons");
          this._buttons = [];
          return;
        }

        this._buttonBar = this._mkDiv("button-bar", this._dialog);
        this._buttons = this._options.buttons.map(function (def) {
          var btn = _this6._mkEl("button", "dialog-button", _this6._buttonBar);
          btn.innerText = def.text;
          if (def.clicked) {
            btn.addEventListener("click", function (ev) {
              btn.disabled = true;
              var returnState = false;
              try {
                var result = def.clicked.apply(_this6, ev);
                if (_this6._looksLikeAPromise(result)) {
                  returnState = true;
                  result.then(function () {
                    btn.disabled = false;
                  }).catch(function (err) {
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
      _createGrippers: function _createGrippers() {
        this._mkDiv(["gripper", "left"], this._dialog);
        this._mkDiv(["gripper", "right"], this._dialog);
      },
      _createDialogStructure: function _createDialogStructure() {
        this._createDialog();
        this._createTitlebar();
        this._createContentArea();
        this._createButtonBar();
        this._createGrippers();
      },
      _bindMouseEvents: function _bindMouseEvents() {
        this._setDialogContentSizing();
        this._addEvent(this._dialog, "mousedown", this._onMouseDown.bind(this));
        this._addEvent(document, "mousemove", this._onMouseMove.bind(this));
        this._addEvent(document, "mouseup", this._onMouseUp.bind(this));
      },
      _raiseDialog: function _raiseDialog() {
        this._dialog.style.zIndex = (++zIndex).toString();
        this._raised = true;
      },
      _px: function _px(value) {
        value = (value || "0") + "";
        return value.match(/px$/) ? value : value + "px";
      },
      _mkDiv: function _mkDiv(classList, parent) {
        return this._mkEl("div", classList, parent);
      },
      _mkEl: function _mkEl(tag, classList, parent) {
        var el = document.createElement(tag);
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
      _addEvent: function _addEvent(elm, evt, callback) {
        if (elm == null || (typeof elm === "undefined" ? "undefined" : _typeof(elm)) === undefined) {
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
      _suppressEvent: function _suppressEvent(evt) {
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
      _onMouseDown: function _onMouseDown(evt) {
        this._raiseDialog();
        evt = evt || window.event;
        if (!evt || !evt.target) {
          return;
        }
        var rect = this._getOffset(this._dialog);
        this._maxX = Math.max(document.documentElement["clientWidth"], document.body["scrollWidth"], document.documentElement["scrollWidth"], document.body["offsetWidth"], document.documentElement["offsetWidth"]);
        this._maxY = Math.max(document.documentElement["clientHeight"], document.body["scrollHeight"], document.documentElement["scrollHeight"], document.body["offsetHeight"], document.documentElement["offsetHeight"]);
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
      _createContentCover: function _createContentCover() {
        if (this._contentCover) {
          this._contentCover.remove();
        }
        this._contentCover = this._mkDiv(undefined, this._dialog);
        this._fitContentCoverOverContent();
      },
      _fitContentCoverOverContent: function _fitContentCoverOverContent() {
        if (!this._contentCover) {
          return;
        }
        var cover = this._contentCover,
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
      _removeContentCover: function _removeContentCover() {
        if (this._contentCover) {
          this._contentCover.remove();
        }
        this._contentCover = undefined;
      },
      _doDrag: function _doDrag(evt) {
        var dx = this._startX - evt.pageX,
            dy = this._startY - evt.pageY,
            left = this._leftPos - dx,
            top = this._topPos - dy,
            scrollL = Math.max(document.body.scrollLeft, document.documentElement.scrollLeft),
            scrollT = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
        if (dx < 0) {
          if (left + this._startW > this._maxX) left = this._maxX - this._startW;
        }
        if (dx > 0 && left < 0) {
          left = 0;
        }
        if (dy < 0 && top + this._startH > this._maxY) {
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
      _doResize: function _doResize(evt) {
        var dw = void 0,
            dh = void 0,
            w = void 0,
            h = void 0;
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
          if (this._leftPos + this._startW + dw > this._maxX) dw = this._maxX - this._leftPos - this._startW;
          w = this._startW + dw;
          if (w < this._minW) w = this._minW;
          this.resizeTo(w);
        } else if (this._resizeMode === 'n') {
          dh = this._startY - evt.pageY;
          if (this._topPos - dh < 0) dh = this._topPos;
          h = this._startH + dh;
          if (h < this._minH) {
            h = this._minH;
            dh = h - this._startH;
          }
          this.resizeTo(undefined, h);
          this.moveTo(undefined, this._topPos - dh);
        } else if (this._resizeMode === 's') {
          dh = evt.pageY - this._startY;
          if (this._topPos + this._startH + dh > this._maxY) dh = this._maxY - this._topPos - this._startH;
          h = this._startH + dh;
          if (h < this._minH) h = this._minH;
          this.resizeTo(undefined, h);
        } else if (this._resizeMode === 'nw') {
          dw = this._startX - evt.pageX;
          dh = this._startY - evt.pageY;
          if (this._leftPos - dw < 0) dw = this._leftPos;
          if (this._topPos - dh < 0) dh = this._topPos;
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
          if (this._leftPos - dw < 0) dw = this._leftPos;
          if (this._topPos + this._startH + dh > this._maxY) dh = this._maxY - this._topPos - this._startH;
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
          if (this._leftPos + this._startW + dw > this._maxX) dw = this._maxX - this._leftPos - this._startW;
          if (this._topPos - dh < 0) dh = this._topPos;
          w = this._startW + dw;
          h = this._startH + dh;
          if (w < this._minW) w = this._minW;
          if (h < this._minH) {
            h = this._minH;
            dh = h - this._startH;
          }
          this.resizeTo(w, h);
          this.moveTo(undefined, this._topPos - dh);
        } else if (this._resizeMode === 'se') {
          dw = evt.pageX - this._startX;
          dh = evt.pageY - this._startY;
          if (this._leftPos + this._startW + dw > this._maxX) dw = this._maxX - this._leftPos - this._startW;
          if (this._topPos + this._startH + dh > this._maxY) dh = this._maxY - this._topPos - this._startH;
          w = this._startW + dw;
          h = this._startH + dh;
          if (w < this._minW) w = this._minW;
          if (h < this._minH) h = this._minH;
          this.resizeTo(w, h);
        }
        this._setDialogContentSizing();
      },
      _onMouseMove: function _onMouseMove(evt) {
        evt = evt || window.event;
        if (!evt || !evt.target) {
          return;
        }
        if (this._handlingMouseEvent) {
          return;
        }
        if (this._isDrag) {
          this._doDrag(evt);
        } else if (this._isResize) {
          this._doResize(evt);
        } else if (!this._isButton) {
          var cs = void 0,
              rm = '';
          if (evt.target === this._dialog || evt.target === this._dialogTitle || this._dialog.contains(evt.target)) {
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
        }
        return this._suppressEvent(evt);
      },
      _onMouseUp: function _onMouseUp(evt) {
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
      _getOffset: function _getOffset(elm) {
        var rect = elm.getBoundingClientRect(),
            offsetX = window.scrollX || document.documentElement.scrollLeft,
            offsetY = window.scrollY || document.documentElement.scrollTop;
        return {
          left: rect.left + offsetX,
          top: rect.top + offsetY,
          right: rect.right + offsetX,
          bottom: rect.bottom + offsetY
        };
      },
      _setCursor: function _setCursor(cur) {
        this._dialog.style.cursor = cur;
        this._dialogTitle.style.cursor = cur;
      },
      _setDialogContentSizing: function _setDialogContentSizing() {}
    };

    ToolWindow.positions = positions;
    ToolWindow.alignments = alignments;

    module.exports = {
      ToolWindow: ToolWindow
    };
  }, { "./config": 2, "./positioners": 3 }] }, {}, [1]);
