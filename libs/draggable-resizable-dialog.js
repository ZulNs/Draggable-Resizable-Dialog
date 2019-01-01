/*
 * Pure JavaScript for Draggable and Risizable Dialog Box
 *
 * Designed by ZulNs, @Gorontalo, Indonesia, 7 June 2017
 */

var _minW = 200,
	_minH = 200,
	_resizePixel = 5,
	_hasEventListeners = !!window.addEventListener,
	_parent,
	_dialog,
	_dialogTitle,
	_dialogContent,
	_dialogButtonPane,
	_maxX, _maxY,
	_startX, _startY,
	_startW, _startH,
	_leftPos, _topPos,
	_isDrag = false,
	_isResize = false,
	_isButton = false,
	_isButtonHovered = false,
	_isClickEvent = true,
	_resizeMode = '',
	_whichButton,
	_buttons,
	_tabBoundary,
	_showButton,
	_status,
	
	_addEvent = function(elm, evt, callback) {
		if (elm == null || typeof(elm) == undefined)
			return;
		if (_hasEventListeners)
			elm.addEventListener(evt, callback, false);
		else if (elm.attachEvent)
			elm.attachEvent('on' + evt, callback);
		else
			elm['on' + evt] = callback;
	},
	
	_returnEvent = function(evt) {
		if (evt.stopPropagation)
			evt.stopPropagation();
		if (evt.preventDefault)
			evt.preventDefault();
		else {
			evt.returnValue = false;
			return false;
		}
	},
	
	_returnTrueEvent = function(evt) {
		evt.returnValue = true;
		return true;
	},
	
	_removeEvent = function(elm, evt, callback) {
		if (elm == null || typeof(elm) == undefined)
			return;
		if (window.removeEventListener)
			elm.removeEventListener(evt, callback, false);
		else if (elm.detachEvent)
			elm.detachEvent('on' + evt, callback);
	},
	
	_adjustFocus = function(evt) {
		evt = evt || window.event;
		if (evt.target === _dialogTitle)
			_buttons[_buttons.length - 1].focus();
		else
			_buttons[0].focus();
		return _returnEvent(evt);
	},
	
	_onFocus = function(evt) {
		evt = evt || window.event;
		evt.target.classList.add('focus');
		return _returnEvent(evt);
	},
	
	_onBlur = function(evt) {
		evt = evt || window.event;
		evt.target.classList.remove('focus');
		return _returnEvent(evt);
	},
	
	_onClick = function(evt) {
		evt = evt || window.event;
		if (_isClickEvent)
			_whichClick(evt.target);
		else
			_isClickEvent = true;
		return _returnEvent(evt);
	}
	
	_onMouseDown = function(evt) {
		evt = evt || window.event;
		var rect = _getOffset(_dialog);
		_maxX = Math.max(
			document.documentElement["clientWidth"],
			document.body["scrollWidth"],
			document.documentElement["scrollWidth"],
			document.body["offsetWidth"],
			document.documentElement["offsetWidth"]
		);
		_maxY = Math.max(
			document.documentElement["clientHeight"],
			document.body["scrollHeight"],
			document.documentElement["scrollHeight"],
			document.body["offsetHeight"],
			document.documentElement["offsetHeight"]
		);
		if (rect.right > _maxX)
			_maxX = rect.right;
		if (rect.bottom > _maxY)
			_maxY = rect.bottom;
		_startX = evt.pageX;
		_startY = evt.pageY;
		_startW = _dialog.clientWidth;
		_startH = _dialog.clientHeight;
		_leftPos = rect.left;
		_topPos = rect.top;
		if (_isButtonHovered) {
			_whichButton.classList.remove('hover');
			_whichButton.classList.remove('focus');
			_whichButton.classList.add('active');
			_isButtonHovered = false;
			_isButton = true;
		}
		else if (evt.target === _dialogTitle && _resizeMode == '') {
			_setCursor('move');
			_isDrag = true;
		}
		else if (_resizeMode != '')
			_isResize = true;
		var r = _dialog.getBoundingClientRect();
		return _returnEvent(evt);
	},
	
	_onMouseMove = function(evt) {
		evt = evt || window.event;
		if (_isDrag) {
			var dx = _startX - evt.pageX,
				dy = _startY - evt.pageY,
				left = _leftPos - dx,
				top = _topPos - dy,
				scrollL = Math.max(document.body.scrollLeft, document.documentElement.scrollLeft),
				scrollT = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
			if (dx < 0) {
				if (left + _startW > _maxX)
					left = _maxX - _startW;
			}
			if (dx > 0) {
				if (left < 0)
					left = 0;
			}
			if (dy < 0) {
				if (top + _startH > _maxY)
					top = _maxY - _startH;
			}
			if (dy > 0) {
				if (top < 0)
					top = 0;
			}
			_dialog.style.left = left + 'px';
			_dialog.style.top = top + 'px';
			if (evt.clientY > window.innerHeight - 32)
				scrollT += 32;
			else if (evt.clientY < 32)
				scrollT -= 32;
			if (evt.clientX > window.innerWidth - 32)
				scrollL += 32;
			else if (evt.clientX < 32)
				scrollL -= 32;
			if (top + _startH == _maxY)
				scrollT = _maxY - window.innerHeight + 20;
			else if (top == 0)
				scrollT = 0;
			if (left + _startW == _maxX)
				scrollL = _maxX - window.innerWidth + 20;
			else if (left == 0)
				scrollL = 0;
			if (_startH > window.innerHeight) {
				if (evt.clientY < window.innerHeight / 2)
					scrollT = 0;
				else
					scrollT = _maxY - window.innerHeight + 20;
			}
			if (_startW > window.innerWidth) {
				if (evt.clientX < window.innerWidth / 2)
					scrollL = 0;
				else
					scrollL = _maxX - window.innerWidth + 20;
			}
			window.scrollTo(scrollL, scrollT);
		}
		else if (_isResize) {
			var dw, dh, w, h;
			if (_resizeMode == 'w') {
				dw = _startX - evt.pageX;
				if (_leftPos - dw < 0)
					dw = _leftPos;
				w = _startW + dw;
				if (w < _minW) {
					w = _minW;
					dw = w - _startW;
				}
				_dialog.style.width = w + 'px';
				_dialog.style.left = (_leftPos - dw) + 'px'; 
			}
			else if (_resizeMode == 'e') {
				dw = evt.pageX - _startX;
				if (_leftPos + _startW + dw > _maxX)
					dw = _maxX - _leftPos - _startW;
				w = _startW + dw;
				if (w < _minW)
					w = _minW;
				_dialog.style.width = w + 'px';
			}
			else if (_resizeMode == 'n') {
				dh = _startY - evt.pageY;
				if (_topPos - dh < 0)
					dh = _topPos;
				h = _startH + dh;
				if (h < _minH) {
					h = _minH;
					dh = h - _startH;
				}
				_dialog.style.height = h + 'px';
				_dialog.style.top = (_topPos - dh) + 'px';
			}
			else if (_resizeMode == 's') {
				dh = evt.pageY - _startY;
				if (_topPos + _startH + dh > _maxY)
					dh = _maxY - _topPos - _startH;
				h = _startH + dh;
				if (h < _minH)
					h = _minH;
				_dialog.style.height = h + 'px';
			}
			else if (_resizeMode == 'nw') {
				dw = _startX - evt.pageX;
				dh = _startY - evt.pageY;
				if (_leftPos - dw < 0)
					dw = _leftPos;
				if (_topPos - dh < 0)
					dh = _topPos;
				w = _startW + dw;
				h = _startH + dh;
				if (w < _minW) {
					w = _minW;
					dw = w - _startW;
				}
				if (h < _minH) {
					h = _minH;
					dh = h - _startH;
				}
				_dialog.style.width = w + 'px';
				_dialog.style.height = h + 'px';
				_dialog.style.left = (_leftPos - dw) + 'px'; 
				_dialog.style.top = (_topPos - dh) + 'px';
			}
			else if (_resizeMode == 'sw') {
				dw = _startX - evt.pageX;
				dh = evt.pageY - _startY;
				if (_leftPos - dw < 0)
					dw = _leftPos;
				if (_topPos + _startH + dh > _maxY)
					dh = _maxY - _topPos - _startH;
				w = _startW + dw;
				h = _startH + dh;
				if (w < _minW) {
					w = _minW;
					dw = w - _startW;
				}
				if (h < _minH)
					h = _minH;
				_dialog.style.width = w + 'px';
				_dialog.style.height = h + 'px';
				_dialog.style.left = (_leftPos - dw) + 'px'; 
			}
			else if (_resizeMode == 'ne') {
				dw = evt.pageX - _startX;
				dh = _startY - evt.pageY;
				if (_leftPos + _startW + dw > _maxX)
					dw = _maxX - _leftPos - _startW;
				if (_topPos - dh < 0)
					dh = _topPos;
				w = _startW + dw;
				h = _startH + dh;
				if (w < _minW)
					w = _minW;
				if (h < _minH) {
					h = _minH;
					dh = h - _startH;
				}
				_dialog.style.width = w + 'px';
				_dialog.style.height = h + 'px';
				_dialog.style.top = (_topPos - dh) + 'px';
			}
			else if (_resizeMode == 'se') {
				dw = evt.pageX - _startX;
				dh = evt.pageY - _startY;
				if (_leftPos + _startW + dw > _maxX)
					dw = _maxX - _leftPos - _startW;
				if (_topPos + _startH + dh > _maxY)
					dh = _maxY - _topPos - _startH;
				w = _startW + dw;
				h = _startH + dh;
				if (w < _minW)
					w = _minW;
				if (h < _minH)
					h = _minH;
				_dialog.style.width = w + 'px';
				_dialog.style.height = h + 'px';
			}
			_setDialogContent();
		}
		else if (!_isButton) {
			var cs, rm = '';
			if (evt.target === _dialog || evt.target === _dialogTitle || evt.target === _buttons[0]) {
				var rect = _getOffset(_dialog);
				if (evt.pageY < rect.top + _resizePixel)
					rm = 'n';
				else if (evt.pageY > rect.bottom - _resizePixel)
					rm = 's';
				if (evt.pageX < rect.left + _resizePixel)
					rm += 'w';
				else if (evt.pageX > rect.right - _resizePixel)
					rm += 'e';
			}
			if (rm != '' && _resizeMode != rm) {
				if (rm == 'n' || rm == 's')
					cs = 'ns-resize';
				else if (rm == 'e' || rm == 'w')
					cs = 'ew-resize';
				else if (rm == 'ne' || rm == 'sw')
					cs = 'nesw-resize';
				else if (rm == 'nw' || rm == 'se')
					cs = 'nwse-resize';
				_setCursor(cs);
				_resizeMode = rm;
			}
			else if (rm == '' && _resizeMode != '') {
				_setCursor('');
				_resizeMode = '';
			}
			if (evt.target != _buttons[0] && evt.target.tagName.toLowerCase() == 'button' || evt.target === _buttons[0] && rm == '') {
				if (!_isButtonHovered || _isButtonHovered && evt.target != _whichButton) {
					_whichButton = evt.target;
					_whichButton.classList.add('hover');
					_isButtonHovered = true;
				}
			}
			else if (_isButtonHovered) {
				_whichButton.classList.remove('hover');
				_isButtonHovered = false;
			}
		}
		return _returnEvent(evt);
	},
	
	_onMouseUp = function(evt) {
		evt = evt || window.event;
		_isClickEvent = false;
		if (_isDrag) {
			_setCursor('');
			_isDrag = false;
		}
		else if (_isResize) {
			_setCursor('');
			_isResize = false;
			_resizeMode = '';
		}
		else if (_isButton) {
			_whichButton.classList.remove('active');
			_isButton = false;
			_whichClick(_whichButton);
		}
		else
			_isClickEvent = true;
		return _returnEvent(evt);
	},
	
	_whichClick = function(btn) {
		_dialog.style.display = 'none';
		_showButton.disabled = false;
		_showButton.focus();
		if (btn === _buttons[0])
			_status.innerHTML = 'Dialog hidden...';
		else
			_status.innerHTML = btn.innerHTML + ' button clicked...';
	},
	
	_getOffset = function(elm) {
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
	
	_setCursor = function(cur) {
		_dialog.style.cursor = cur;
		_dialogTitle.style.cursor = cur;
		_buttons[0].style.cursor = cur;
	},
	
	_setDialogContent = function() {
		var w = _dialog.clientWidth - 32,
			h = _dialog.clientHeight - 128;
		_dialogContent.style.width = w + 'px';
		_dialogContent.style.height = h + 'px';
		_dialogButtonPane.style.width = w + 'px';
		_dialogTitle.style.width = (w - 16) + 'px';
	},
	
	_showDialog = function() {
		_dialog.style.display = 'block';
		_buttons[1].focus();
		_status.innerHTML = 'Dialog showed...';
		_showButton.disabled = true;
	},
	
	_init = function() {
		_dialog = document.querySelector('.dialog');
		_dialogTitle = document.querySelector('.dialog .titlebar');
		_dialogContent = document.querySelector('.dialog .content');
		_dialogButtonPane = document.querySelector('.dialog .buttonpane');
		_tabBoundary = document.querySelector('.dialog .tabboundary');
		_setDialogContent();
		_dialog.style.left = ((window.innerWidth - _dialog.clientWidth) / 2) + 'px';
		_dialog.style.top = ((window.innerHeight - _dialog.clientHeight) / 2) + 'px';
		_dialogTitle.tabIndex = '0';
		_tabBoundary = document.createElement('div');
		_tabBoundary.tabIndex = '0';
		_dialog.appendChild(_tabBoundary);
		_addEvent(_dialog, 'mousedown', _onMouseDown);
		_addEvent(document, 'mousemove', _onMouseMove);
		_addEvent(document, 'mouseup', _onMouseUp);
		_buttons = document.querySelectorAll('.dialog button');
		_buttons[0].innerHTML = '&#x2716;';
		for (var i = 0; i < _buttons.length; i++) {
			_addEvent(_buttons[i], 'click', _onClick);
			_addEvent(_buttons[i], 'focus', _onFocus);
			_addEvent(_buttons[i], 'blur', _onBlur);
		}
		_addEvent(_dialogTitle, 'focus', _adjustFocus);
		_addEvent(_tabBoundary, 'focus', _adjustFocus);
		var div = document.querySelector('.dialog .buttonset');
		_minW = Math.max(_minW, (_buttons.length - 1) * 84 + 13);
		_dialog.style.display = 'none';
		_showButton = document.getElementById('show-dialog');
		_status = document.getElementById('dialog-status');
	};

_init();
