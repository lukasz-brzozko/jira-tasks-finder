function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
// ==UserScript==
// @name         Jira Tasks Finder
// @namespace    https://github.com/lukasz-brzozko/jira-tasks-finder
// @version      2024-04-30
// @description  Find Jira tasks by Fix version
// @author       Łukasz Brzózko
// @match        https://jira.nd0.pl/*
// @exclude      https://jira.nd0.pl/plugins/servlet/*
// @resource styles    https://raw.githubusercontent.com/lukasz-brzozko/jira-timesheet-formatter/main/styles.css
// @icon         https://jira.nd0.pl/s/a3v501/940003/1dlckms/_/images/fav-jsw.png
// @updateURL    https://raw.githubusercontent.com/lukasz-brzozko/jira-tasks-finder/main/timesheet.meta.js
// @downloadURL  https://raw.githubusercontent.com/lukasz-brzozko/jira-tasks-finder/main/timesheet.user.js
// @grant        GM_getResourceText
// ==/UserScript==
(function () {
  "use strict";

  var FIX_VERSION_PREFIX = "FrontPortal-";
  var MULTIPLIER = 1000;
  var MAX_FIX_VERSIONS_DIFFERENCE = 50;
  var MESSAGES = {
    containerFound: "Znaleziono kontener.",
    btnText: "Formatuj czasy",
    remainingTimeTitle: "Remaining time:",
    modal: {
      title: "Znajdź zadania po fix version",
      desc: "Uzupełnij wymagane dane i wciśnij przycisk.",
      label: "Najstarsze fix version",
      latestVersion: "Najnowsze fix version",
      excludedVersion: "Wyłączone fix version (oddzielane przecinkiem)",
      cancelBtn: "Anuluj",
      confirmBtn: "Otwórz filtr w nowej karcie",
      confirmAltBtn: "Skopiuj adres filtru do schowka"
    },
    error: {
      "default": "Wystąpił błąd. Spróbuj ponownie później.",
      wrongUrl: "Wystąpił błąd. Sprawdź poprawność podanego adresu API URL.",
      containerNotFound: "Nie znaleziono kontenera. Skrypt został wstrzymany.",
      modal: {
        inputUrl: "Najstarsze fix version nie mo\u017Ce by\u0107 wi\u0119ksze ni\u017C najnowsze fix version.<br>Maksymalna dopuszczalna r\xF3\u017Cnica wersji: ".concat(MAX_FIX_VERSIONS_DIFFERENCE, ".")
      }
    }
  };
  var SELECTORS = {
    cellWithValue: "td.nav.border.workedDay",
    rowFooter: ".rowFooter",
    footerCell: ".rowFooter .workedDay > b",
    summaryCells: "tbody > tr > td:last-child > b",
    tableBody: "#issuetable > tbody",
    boldCell: "td > b",
    modalInput: ".modal-input",
    modalFormWrapper: ".modal-form-wrapper"
  };
  var IDS = {
    dashboardContent: "dashboard-content",
    layout: "my-layout",
    formatterBtn: "formatter-btn",
    settingsBtn: "settings-btn",
    myGadget: "my-gadget",
    toast: "my-toast",
    toastMessage: "toast-message",
    myModal: "fix-version-tasks-modal",
    modalOverlay: "fix-version-modal-overlay",
    modalCancelBtn: "modal-cancel-btn",
    modalConfirmBtn: "modal-confirm-btn",
    modalConfirmAltBtn: "modal-confirm-alt-btn",
    modalFormWrapper: "modal-form-wrapper",
    modalFormVersionLatest: "modal-form-version-latest",
    modalFormVersionExcluded: "modal-form-version-excluded",
    modalInputUrl: "modal-input-url",
    modalInputOffset: "modal-input-offset",
    modalInputErrorWrapper: "modal-input-error-wrapper"
  };
  var STATE = {
    loading: "loading",
    visible: "visible",
    complete: "complete",
    notComplete: "not-complete",
    focus: "focus",
    filled: "filled",
    disabled: "disabled",
    active: "active"
  };
  var showFormError = false;
  var myModalEl;
  var modalCancelBtnEl;
  var modalConfirmBtnEl;
  var modalConfirmAltBtnEl;
  var modalInputFirstVersion;
  var modalInputLatestVersion;
  var modalInputExcludedVersion;
  var modalInputErrorWrapperEl;
  var modalInputsEls = [];
  var modalFixVersionInputs = [];
  var modalConfirmBtns = [];
  var fixVersionRegex = new RegExp(/^FrontPortal-((\d)(\.\d{0,3})?)?$/);
  var fixVersionWithoutDotRegex = new RegExp(/^FrontPortal-(\d{2,4})/);
  var fixVersionWithDigitRegex = new RegExp(/^FrontPortal-(\d)(\.\d{0,3})?$/);
  var digitRegex = new RegExp(/^\d$/g);
  var linkStyles = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var myCss, toastCss, styleTag;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            myCss = GM_getResourceText("styles");
            toastCss = GM_getResourceText("toastStyles");
            styleTag = document.createElement("style");
            styleTag.textContent = "".concat(myCss, " ").concat(toastCss);
            document.body.prepend(styleTag);
          case 5:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function linkStyles() {
      return _ref.apply(this, arguments);
    };
  }();
  var toggleModal = function toggleModal() {
    var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
    myModalEl.classList.toggle(STATE.visible, force);
  };
  var handleModalTransitionEnd = function handleModalTransitionEnd() {
    myModalEl.removeEventListener("transitionend", handleModalTransitionEnd);
  };
  var openModal = function openModal() {
    toggleModal(true);
    modalInputFirstVersion.select();
  };
  var closeModal = function closeModal() {
    toggleModal(false);
  };
  var copyJiraFilterUrlIntoClipboard = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var _getJiraFilterUrl;
      var _ref3, url, lowestVersion, highestVersion, linkName, clipboardItem;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _ref3 = (_getJiraFilterUrl = getJiraFilterUrl()) !== null && _getJiraFilterUrl !== void 0 ? _getJiraFilterUrl : {}, url = _ref3.url, lowestVersion = _ref3.lowestVersion, highestVersion = _ref3.highestVersion;
            if (url) {
              _context2.next = 3;
              break;
            }
            return _context2.abrupt("return");
          case 3:
            linkName = lowestVersion !== highestVersion ? "".concat(FIX_VERSION_PREFIX).concat(lowestVersion, "-").concat(FIX_VERSION_PREFIX).concat(highestVersion) : "".concat(FIX_VERSION_PREFIX).concat(lowestVersion);
            clipboardItem = new ClipboardItem({
              "text/plain": new Blob([url], {
                type: "text/plain"
              }),
              "text/html": new Blob(["<a href=\"".concat(url, "\">").concat(linkName, "</a>")], {
                type: "text/html"
              })
            });
            _context2.next = 7;
            return navigator.clipboard.write([clipboardItem]);
          case 7:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function copyJiraFilterUrlIntoClipboard() {
      return _ref2.apply(this, arguments);
    };
  }();
  var handleConfirmModal = function handleConfirmModal() {
    var _getJiraFilterUrl2;
    var _ref4 = (_getJiraFilterUrl2 = getJiraFilterUrl()) !== null && _getJiraFilterUrl2 !== void 0 ? _getJiraFilterUrl2 : {},
      url = _ref4.url;
    if (!url) return;
    window.open(url, "_blank");
  };
  var handleConfirmAltModal = /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return copyJiraFilterUrlIntoClipboard();
          case 2:
            showMessage("Copied to clipboard");
          case 3:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function handleConfirmAltModal() {
      return _ref5.apply(this, arguments);
    };
  }();
  var handleCancelModal = function handleCancelModal() {
    myModalEl.addEventListener("transitionend", handleModalTransitionEnd);
    closeModal();
  };
  var handleInputFocus = function handleInputFocus(e) {
    var inputWrapper = e.target.closest(SELECTORS.modalFormWrapper);
    inputWrapper.classList.add(STATE.focus);
  };
  var handleInputBlur = function handleInputBlur(e) {
    var target = e.target;
    var isInputValid = target.checkValidity();
    if (!isInputValid) target.value = "";
    var inputWrapper = target.closest(SELECTORS.modalFormWrapper);
    inputWrapper.classList.remove(STATE.focus);
  };
  var handleInputChange = function handleInputChange(e) {
    var target = e.target;
    var isInputEmpty = target.value === "";
    var inputWrapper = target.closest(SELECTORS.modalFormWrapper);
    inputWrapper.classList.toggle(STATE.filled, !isInputEmpty);
  };
  var setDotAfterFirstDigit = function setDotAfterFirstDigit(target) {
    return target.value.replace(/\d{1}/, function (match) {
      return "".concat(match, ".");
    });
  };
  var validateFixVersionInputValue = function validateFixVersionInputValue(value) {
    var isValidFixVersion = fixVersionRegex.test(value);
    var isFixVersionWithoutDot = fixVersionWithoutDotRegex.test(value);
    var isFixVersionWithDigit = fixVersionWithDigitRegex.test(value);
    var isDigit = digitRegex.test(value);
    var isValid = isValidFixVersion || isFixVersionWithoutDot || isFixVersionWithDigit || isDigit;
    return {
      isValid: isValid,
      isValidFixVersion: isValidFixVersion,
      isFixVersionWithoutDot: isFixVersionWithoutDot,
      isFixVersionWithDigit: isFixVersionWithDigit,
      isDigit: isDigit
    };
  };
  var validateInputsValue = function validateInputsValue() {
    var areValidFixVersions = modalFixVersionInputs.every(function (_ref6) {
      var value = _ref6.value;
      var _validateFixVersionIn = validateFixVersionInputValue(value),
        isFixVersionWithDigit = _validateFixVersionIn.isFixVersionWithDigit;
      return isFixVersionWithDigit;
    });
    var areFixVersionsValuesValid = validateDiffBetweenVersions();
    return areValidFixVersions && areFixVersionsValuesValid;
  };
  var toggleConfirmBtnsDisabled = function toggleConfirmBtnsDisabled(areAllInputsValid) {
    modalConfirmBtns.forEach(function (btn) {
      btn.toggleAttribute(STATE.disabled, !areAllInputsValid);
    });
  };
  var validateDiffBetweenVersions = function validateDiffBetweenVersions() {
    var _getDigitFromString = getDigitFromString(modalInputFirstVersion.value),
      _getDigitFromString2 = _slicedToArray(_getDigitFromString, 1),
      lowestVersion = _getDigitFromString2[0];
    var _getDigitFromString3 = getDigitFromString(modalInputLatestVersion.value),
      _getDigitFromString4 = _slicedToArray(_getDigitFromString3, 1),
      highestVersion = _getDigitFromString4[0];
    if (!lowestVersion || !highestVersion) return false;
    var minValue = parseDigitString(lowestVersion);
    var maxValue = parseDigitString(highestVersion);
    var fixVersionsDiff = Math.abs(maxValue - minValue);
    if (minValue > maxValue) return false;
    if (fixVersionsDiff > MAX_FIX_VERSIONS_DIFFERENCE) return false;
    return true;
  };
  var validateForm = function validateForm() {
    var areAllInputsValid = validateInputsValue();
    toggleConfirmBtnsDisabled(areAllInputsValid);
    showFormError = !areAllInputsValid;
  };
  var toggleModalError = function toggleModalError(force) {
    modalInputErrorWrapperEl.classList.toggle(STATE.visible, force);
  };
  var handleChange = function handleChange() {
    toggleModalError(showFormError);
  };
  var setTargetValue = function setTargetValue(target, value) {
    target.value = value;
    target.dataset.prevValue = value;
  };
  var handleInput = function handleInput(e) {
    var target = e.target;
    var value = target.value;
    var _validateFixVersionIn2 = validateFixVersionInputValue(value),
      isValidFixVersion = _validateFixVersionIn2.isValidFixVersion,
      isFixVersionWithoutDot = _validateFixVersionIn2.isFixVersionWithoutDot,
      isDigit = _validateFixVersionIn2.isDigit;
    console.log({
      value: value,
      isValidFixVersion: isValidFixVersion,
      isFixVersionWithoutDot: isFixVersionWithoutDot
    });
    if (isValidFixVersion) {
      target.dataset.prevValue = value;
    } else if (isFixVersionWithoutDot) {
      setTargetValue(target, setDotAfterFirstDigit(target));
    } else if (isDigit) {
      setTargetValue(target, "".concat(FIX_VERSION_PREFIX).concat(value));
    } else {
      target.value = target.dataset.prevValue;
    }
    validateForm();
    if (!showFormError) toggleModalError(showFormError);
  };
  var generateModal = function generateModal() {
    var modal = document.createElement("div");
    modal.id = IDS.myModal;
    modal.className = "my-modal active";
    modal.innerHTML = "\n      <div class=\"modal-overlay\" id=\"".concat(IDS.modalOverlay, "\"></div>\n      <div class=\"modal-wrapper\">\n        <h2 class=\"modal-title\">").concat(MESSAGES.modal.title, "</h2>\n        <div class=\"modal-content-container\">\n          <p class=\"modal-desc\">").concat(MESSAGES.modal.desc, "</p>\n          <div class=\"modal-form-wrapper filled\" id=\"").concat(IDS.modalFormWrapper, "\">\n            <label class=\"modal-label\">").concat(MESSAGES.modal.label, "</label>\n            <div class=\"modal-input-wrapper\">\n              <input class=\"modal-input\" id=\"modal-input-url\" value=\"").concat(FIX_VERSION_PREFIX, "\" data-prev-value=\"").concat(FIX_VERSION_PREFIX, "\">\n            </div>\n          </div>\n          <div class=\"modal-form-wrapper filled\" id=\"").concat(IDS.modalFormVersionLatest, "\">\n            <label class=\"modal-label\">").concat(MESSAGES.modal.latestVersion, "</label>\n            <div class=\"modal-input-wrapper\">\n              <input class=\"modal-input\" id=\"modal-input-offset\" value=\"").concat(FIX_VERSION_PREFIX, "\" data-prev-value=\"").concat(FIX_VERSION_PREFIX, "\">\n            </div>\n            <div class=\"modal-input-error-wrapper\" id=\"").concat(IDS.modalInputErrorWrapper, "\">\n              <p class=\"modal-input-error\">").concat(MESSAGES.error.modal.inputUrl, "</p>\n            </div>\n            <div class=\"modal-input-error-wrapper\">\n              <p class=\"modal-input-error\"></p>\n            </div>\n          </div>\n          <div class=\"modal-form-wrapper\" id=\"").concat(IDS.modalFormVersionExcluded, "\">\n            <label class=\"modal-label\">").concat(MESSAGES.modal.excludedVersion, "</label>\n            <div class=\"modal-input-wrapper\">\n              <input class=\"modal-input\" id=\"modal-input-offset\" value>\n            </div>\n            <div class=\"modal-input-error-wrapper\">\n              <p class=\"modal-input-error\"></p>\n            </div>\n          </div>\n        </div>\n        <div class=\"modal-btn-wrapper\">\n          <button class=\"btn btn--light btn--small-text\" id=\"").concat(IDS.modalCancelBtn, "\">").concat(MESSAGES.modal.cancelBtn, "</button>\n          <button class=\"btn btn--small-text\" id=\"").concat(IDS.modalConfirmAltBtn, "\" disabled>").concat(MESSAGES.modal.confirmAltBtn, "</button>\n          <button class=\"btn btn--small-text btn--outline\" id=\"").concat(IDS.modalConfirmBtn, "\" disabled>").concat(MESSAGES.modal.confirmBtn, "</button>\n        </div>\n      </div>");
    return modal;
  };
  var generateBtn = function generateBtn() {
    var btnContainer = document.querySelector(".aui-header-secondary");
    if (!btnContainer) return;
    var btnEl = document.createElement("button");
    btnEl.className = "copy-to-clipboard-btn secondary";
    btnEl.title = "Find tasks by fix version";
    btnEl.innerHTML = "\n        <span class=\"copy-icon js-copy-icon aui-icon aui-icon-small aui-iconfont-search\" role=\"img\" aria-label=\"Insert meaningful text here for accessibility\"></span>\n        <span class=\"copy-icon copy-icon--success js-copy-success invisible aui-icon aui-icon-small aui-iconfont-check\" role=\"img\" aria-label=\"Insert meaningful text here for accessibility\"></span>\n      ";
    btnEl.addEventListener("click", openModal);
    btnContainer.appendChild(btnEl);
  };
  var generateToast = function generateToast() {
    var divEl = document.createElement("div");
    divEl.id = IDS.toast;
    divEl.className = "my-message-copied-info";
    divEl.style.zIndex = "102";
    document.body.appendChild(divEl);
  };
  var generateUiElements = function generateUiElements() {
    var fragment = new DocumentFragment();
    var modal = generateModal();
    fragment.appendChild(modal);
    document.body.appendChild(fragment);
    myModalEl = document.getElementById(IDS.myModal);
    modalInputsEls = myModalEl.querySelectorAll(SELECTORS.modalInput);
    modalInputErrorWrapperEl = myModalEl.querySelector("#".concat(IDS.modalInputErrorWrapper));
    modalCancelBtnEl = myModalEl.querySelector("#".concat(IDS.modalCancelBtn));
    modalConfirmBtnEl = myModalEl.querySelector("#".concat(IDS.modalConfirmBtn));
    modalConfirmAltBtnEl = myModalEl.querySelector("#".concat(IDS.modalConfirmAltBtn));
    var modalOverlayEl = myModalEl.querySelector("#".concat(IDS.modalOverlay));
    var _modalInputsEls = modalInputsEls;
    var _modalInputsEls2 = _slicedToArray(_modalInputsEls, 3);
    modalInputFirstVersion = _modalInputsEls2[0];
    modalInputLatestVersion = _modalInputsEls2[1];
    modalInputExcludedVersion = _modalInputsEls2[2];
    modalFixVersionInputs = [modalInputFirstVersion, modalInputLatestVersion];
    modalConfirmBtns = [modalConfirmBtnEl, modalConfirmAltBtnEl];
    modalOverlayEl.addEventListener("click", handleCancelModal);
    modalCancelBtnEl.addEventListener("click", handleCancelModal);
    modalConfirmBtnEl.addEventListener("click", handleConfirmModal);
    modalConfirmAltBtnEl.addEventListener("click", handleConfirmAltModal);
    modalInputsEls.forEach(function (input) {
      input.addEventListener("focus", handleInputFocus);
      input.addEventListener("blur", handleInputBlur);
      input.addEventListener("change", handleInputChange);
    });
    modalFixVersionInputs.forEach(function (input) {
      input.addEventListener("input", handleInput);
      input.addEventListener("change", handleChange);
    });
    generateBtn();
    generateToast();
  };
  var showMessage = function showMessage(text) {
    var toast = document.getElementById(IDS.toast);
    toast.textContent = text;
    toast.classList.remove(STATE.active);
    void toast.offsetWidth; // force reflow
    toast.classList.add(STATE.active);
  };
  var getDigitFromString = function getDigitFromString(string) {
    var _digitRegex$exec;
    var digitRegex = new RegExp(/(\d(\.?))+/);
    return (_digitRegex$exec = digitRegex.exec(string)) !== null && _digitRegex$exec !== void 0 ? _digitRegex$exec : [];
  };
  var parseDigitString = function parseDigitString(digitString) {
    return digitString * MULTIPLIER;
  };
  var getJiraFilterUrl = function getJiraFilterUrl() {
    var _getDigitFromString5 = getDigitFromString(modalInputFirstVersion.value),
      _getDigitFromString6 = _slicedToArray(_getDigitFromString5, 1),
      lowestVersion = _getDigitFromString6[0];
    var _getDigitFromString7 = getDigitFromString(modalInputLatestVersion.value),
      _getDigitFromString8 = _slicedToArray(_getDigitFromString7, 1),
      highestVersion = _getDigitFromString8[0];
    if (!lowestVersion || !highestVersion) return;
    var filterUrl = new URL("https://jira.nd0.pl/issues/");
    var fixVersionsArray = [];
    var excludedFixVersions = modalInputExcludedVersion.value.split(",").filter(Boolean);
    var numberFormatter = new Intl.NumberFormat("de-DE");
    var minValue = parseDigitString(lowestVersion);
    var maxValue = parseDigitString(highestVersion);
    console.log({
      lowestVersion: lowestVersion,
      highestVersion: highestVersion,
      minValue: minValue,
      maxValue: maxValue,
      excludedFixVersions: excludedFixVersions,
      diff: maxValue - minValue
    });
    var fixVersionsDiff = Math.abs(maxValue - minValue);
    switch (true) {
      case minValue > maxValue:
        return console.error("First fix version cannot be greater than the last fix version.");
      case fixVersionsDiff > MAX_FIX_VERSIONS_DIFFERENCE:
        return console.error("Too much difference between fix versions. Max difference: ".concat(MAX_FIX_VERSIONS_DIFFERENCE, "."));
      default:
        break;
    }
    for (var i = minValue; i <= maxValue; i++) {
      var formattedIndex = numberFormatter.format(i);
      fixVersionsArray.push("".concat(FIX_VERSION_PREFIX).concat(formattedIndex));
    }
    var fixVersionIncludedRule = "fixVersion in (".concat(fixVersionsArray.join(", "), ")");
    var containsCommentRule = "(comment ~ \"".concat(fixVersionsArray.join(" OR "), "\")");
    var fixVersionExcludedRule = "fixVersion not in (".concat(excludedFixVersions.join(", "), ")");
    var orderFilter = "ORDER BY project ASC";
    var getExcludedFixVersionRule = function getExcludedFixVersionRule() {
      return excludedFixVersions.length > 0 ? " AND ".concat(fixVersionExcludedRule) : "";
    };
    var filter = "((".concat(fixVersionIncludedRule, " OR ").concat(containsCommentRule, ")").concat(getExcludedFixVersionRule(), ") ").concat(orderFilter);
    filterUrl.searchParams.set("jql", filter.trim());
    var url = filterUrl.toString();
    return {
      url: url,
      lowestVersion: lowestVersion,
      highestVersion: highestVersion
    };
  };
  var init = function init() {
    linkStyles();
    generateUiElements();
  };
  init();
})();