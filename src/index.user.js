// ==UserScript==
// @name         Jira Tasks Finder
// @namespace    https://github.com/lukasz-brzozko/jira-tasks-finder
// @version      2024-04-19
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

  const FIX_VERSION_PREFIX = "FrontPortal-";
  const MULTIPLIER = 1000;
  const MAX_FIX_VERSIONS_DIFFERENCE = 50;

  const MESSAGES = {
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
      confirmAltBtn: "Skopiuj adres filtru do schowka",
    },
    error: {
      default: "Wystąpił błąd. Spróbuj ponownie później.",
      wrongUrl: "Wystąpił błąd. Sprawdź poprawność podanego adresu API URL.",
      containerNotFound: "Nie znaleziono kontenera. Skrypt został wstrzymany.",
      modal: {
        inputUrl:
          "Podano nieprawidłowy URL. Adres powinien być zgodny ze schematem: https://jira.nd0.pl/rest/timesheet-gadget/1.0/timesheet.json?{parametry}={trzynaście cyfr}",
      },
    },
  };

  const SELECTORS = {
    cellWithValue: "td.nav.border.workedDay",
    rowFooter: ".rowFooter",
    footerCell: ".rowFooter .workedDay > b",
    summaryCells: "tbody > tr > td:last-child > b",
    tableBody: "#issuetable > tbody",
    boldCell: "td > b",
    modalInput: ".modal-input",
    modalFormWrapper: ".modal-form-wrapper",
  };

  const IDS = {
    dashboardContent: "dashboard-content",
    layout: "my-layout",
    formatterBtn: "formatter-btn",
    settingsBtn: "settings-btn",
    myGadget: "my-gadget",
    toast: "toast",
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
    modalInputErrorWrapper: "modal-input-error-wrapper",
  };

  const STATE = {
    loading: "loading",
    visible: "visible",
    complete: "complete",
    notComplete: "not-complete",
    focus: "focus",
    filled: "filled",
    disabled: "disabled",
  };

  let controller;
  let formatterBtnEl;
  let layoutEl;
  let toastEl;
  let toastMessageEl;
  let dashboardContentEl;
  let settingsBtnEl;
  let myModalEl;
  let modalCancelBtnEl;
  let modalConfirmBtnEl;
  let modalConfirmAltBtnEl;
  let modalFormWrapperEl;
  let modalInputFirstVersion;
  let modalInputLatestVersion;
  let modalInputExcludedVersion;
  let modalInputErrorWrapperEl;
  let modalInputsEls = [];
  let modalFixVersionInputs = [];
  let modalConfirmBtns = [];

  const fixVersionRegex = new RegExp(/^FrontPortal-((\d)(\.\d{0,3})?)?$/);
  const fixVersionWithoutDotRegex = new RegExp(/^FrontPortal-(\d{2,4})/);
  const fixVersionWithDigit = new RegExp(/^FrontPortal-(\d)(\.\d{0,3})?$/);

  const toggleModal = (force = undefined) => {
    myModalEl.classList.toggle(STATE.visible, force);
  };

  const handleModalTransitionEnd = (e) => {
    // setInputCustomUrl();
    // setInputCustomWeekOffset();

    // modalInputsEls.forEach((input) => toggleModalFormWrapperFilledState(input));

    myModalEl.removeEventListener("transitionend", handleModalTransitionEnd);
  };

  const openModal = () => {
    // setInputCustomUrl();
    // setInputCustomWeekOffset();
    // modalInputsEls.forEach((input) => toggleModalFormWrapperFilledState(input));
    toggleModal(true);
    modalInputFirstVersion.select();
  };

  const closeModal = () => {
    toggleModal(false);
  };

  const copyJiraFilterUrlIntoClipboard = async () => {
    const { url, lowestVersion, highestVersion } = getJiraFilterUrl() ?? {};
    if (!url) return;

    const linkName =
      lowestVersion !== highestVersion
        ? `${FIX_VERSION_PREFIX}${lowestVersion}-${FIX_VERSION_PREFIX}${highestVersion}`
        : `${FIX_VERSION_PREFIX}${lowestVersion}`;

    const clipboardItem = new ClipboardItem({
      "text/plain": new Blob([url], { type: "text/plain" }),
      "text/html": new Blob([`<a href="${url}">${linkName}</a>`], {
        type: "text/html",
      }),
    });

    await navigator.clipboard.write([clipboardItem]);
  };

  const handleConfirmModal = () => {
    // const isUrlInputValid = validateInputUrl();

    // if (!isUrlInputValid) return toggleModalError(true);

    // localStorage.setItem(JIRA_WEEK_OFFSET, modalInputOffsetEl.value.trim());
    // localStorage.setItem(JIRA_CUSTOM_URL, modalInputUrlEl.value.trim());

    // closeModal();
    const { url } = getJiraFilterUrl() ?? {};
    if (!url) return;

    window.open(url, "_blank");
  };

  const handleConfirmAltModal = async () => {
    await copyJiraFilterUrlIntoClipboard();
  };

  const handleCancelModal = () => {
    myModalEl.addEventListener("transitionend", handleModalTransitionEnd);

    closeModal();
    // toggleModalError(false);
  };

  const handleInputFocus = (e) => {
    const inputWrapper = e.target.closest(SELECTORS.modalFormWrapper);
    inputWrapper.classList.add(STATE.focus);
  };

  const handleInputBlur = (e) => {
    const { target } = e;

    const isInputValid = target.checkValidity();

    if (!isInputValid) target.value = "";

    const inputWrapper = target.closest(SELECTORS.modalFormWrapper);
    inputWrapper.classList.remove(STATE.focus);
  };

  const handleInputChange = (e) => {
    const { target } = e;

    const isInputEmpty = target.value === "";

    const inputWrapper = target.closest(SELECTORS.modalFormWrapper);
    inputWrapper.classList.toggle(STATE.filled, !isInputEmpty);
  };

  const setDotAfterFirstDigit = (target) => {
    return target.value.replace(/\d{1}/, (match) => `${match}.`);
  };

  const validateFixVersionInputValue = (value) => {
    const isValidFixVersion = fixVersionRegex.test(value);
    const isFixVersionWithoutDot = fixVersionWithoutDotRegex.test(value);
    const isFixVersionWithDigit = fixVersionWithDigit.test(value);
    const isValid =
      isValidFixVersion || isFixVersionWithoutDot || isFixVersionWithDigit;

    return {
      isValid,
      isValidFixVersion,
      isFixVersionWithoutDot,
      isFixVersionWithDigit,
    };
  };

  const validateInputsValue = () => {
    const areValidFixVersions = modalFixVersionInputs.every(({ value }) => {
      const { isFixVersionWithDigit } = validateFixVersionInputValue(value);

      return isFixVersionWithDigit;
    });

    const areFixVersionsValuesValid = validateDiffBetweenVersions();

    return areValidFixVersions && areFixVersionsValuesValid;
  };

  const toggleConfirmBtnsDisabled = (areAllInputsValid) => {
    modalConfirmBtns.forEach((btn) => {
      btn.toggleAttribute(STATE.disabled, !areAllInputsValid);
    });
  };

  const validateDiffBetweenVersions = () => {
    const [lowestVersion] = getDigitFromString(modalInputFirstVersion.value);
    const [highestVersion] = getDigitFromString(modalInputLatestVersion.value);

    if (!lowestVersion || !highestVersion) return false;

    const minValue = parseDigitString(lowestVersion);
    const maxValue = parseDigitString(highestVersion);

    const fixVersionsDiff = Math.abs(maxValue - minValue);

    if (minValue > maxValue) return false;
    if (fixVersionsDiff > MAX_FIX_VERSIONS_DIFFERENCE) return false;

    return true;
  };

  const validateForm = () => {
    const areAllInputsValid = validateInputsValue();

    toggleConfirmBtnsDisabled(areAllInputsValid);
  };

  const handleInput = (e) => {
    // if (!modalInputErrorWrapperEl.classList.contains(STATE.visible)) return;
    const { target } = e;
    const { value } = target;

    const { isValidFixVersion, isFixVersionWithoutDot } =
      validateFixVersionInputValue(value);

    console.log({
      value,
      isValidFixVersion,
      isFixVersionWithoutDot,
    });

    if (isValidFixVersion) {
      target.dataset.prevValue = value;
    } else if (isFixVersionWithoutDot) {
      const replacedValue = setDotAfterFirstDigit(target);
      target.value = replacedValue;
    } else {
      target.value = target.dataset.prevValue;
    }

    validateForm();

    // TODO dodać sprawdzanie różnicy wartości pomiędzy fix version (max 50) <- tutaj bądź na onChange

    // toggleModalError(false);
  };

  const generateModal = () => {
    const modal = document.createElement("div");

    modal.id = IDS.myModal;
    modal.className = "my-modal active";
    modal.innerHTML = `
      <div class="modal-overlay" id="${IDS.modalOverlay}"></div>
      <div class="modal-wrapper">
        <h2 class="modal-title">${MESSAGES.modal.title}</h2>
        <div class="modal-content-container">
          <p class="modal-desc">${MESSAGES.modal.desc}</p>
          <div class="modal-form-wrapper filled" id="${IDS.modalFormWrapper}">
            <label class="modal-label">${MESSAGES.modal.label}</label>
            <div class="modal-input-wrapper">
              <input class="modal-input" id="modal-input-url" value="${FIX_VERSION_PREFIX}" data-prev-value="${FIX_VERSION_PREFIX}">
            </div>
            <div class="modal-input-error-wrapper" id="${IDS.modalInputErrorWrapper}">
              <p class="modal-input-error">${MESSAGES.error.modal.inputUrl}</p>
            </div>
          </div>
          <div class="modal-form-wrapper filled" id="${IDS.modalFormVersionLatest}">
            <label class="modal-label">${MESSAGES.modal.latestVersion}</label>
            <div class="modal-input-wrapper">
              <input class="modal-input" id="modal-input-offset" value="${FIX_VERSION_PREFIX}" data-prev-value="${FIX_VERSION_PREFIX}">
            </div>
            <div class="modal-input-error-wrapper">
              <p class="modal-input-error"></p>
            </div>
          </div>
          <div class="modal-form-wrapper" id="${IDS.modalFormVersionExcluded}">
            <label class="modal-label">${MESSAGES.modal.excludedVersion}</label>
            <div class="modal-input-wrapper">
              <input class="modal-input" id="modal-input-offset" value>
            </div>
            <div class="modal-input-error-wrapper">
              <p class="modal-input-error"></p>
            </div>
          </div>
        </div>
        <div class="modal-btn-wrapper">
          <button class="btn btn--light btn--small-text" id="${IDS.modalCancelBtn}">${MESSAGES.modal.cancelBtn}</button>
          <button class="btn btn--small-text" id="${IDS.modalConfirmAltBtn}" disabled>${MESSAGES.modal.confirmAltBtn}</button>
          <button class="btn btn--small-text btn--outline" id="${IDS.modalConfirmBtn}" disabled>${MESSAGES.modal.confirmBtn}</button>
        </div>
      </div>`;

    return modal;
  };

  const generateUiElements = () => {
    const fragment = new DocumentFragment();

    // const btnsWrapper = generateBtnsWrapper();
    // const settingsBtn = generateSettingsBtn();

    // const toastWrapper = generateToast();
    const modal = generateModal();

    // btnsWrapper.appendChild(settingsBtn);
    // fragment.appendChild(btnsWrapper);
    // fragment.appendChild(toastWrapper);
    fragment.appendChild(modal);
    document.body.appendChild(fragment);

    formatterBtnEl = document.getElementById(IDS.formatterBtn);
    settingsBtnEl = document.getElementById(IDS.settingsBtn);
    toastEl = document.getElementById(IDS.toast);
    myModalEl = document.getElementById(IDS.myModal);
    // toastMessageEl = toastEl.querySelector(`#${IDS.toastMessage}`);
    modalInputsEls = myModalEl.querySelectorAll(SELECTORS.modalInput);
    modalFormWrapperEl = myModalEl.querySelector(`#${IDS.modalFormWrapper}`);
    modalInputErrorWrapperEl = myModalEl.querySelector(
      `#${IDS.modalInputErrorWrapper}`
    );
    modalCancelBtnEl = myModalEl.querySelector(`#${IDS.modalCancelBtn}`);
    modalConfirmBtnEl = myModalEl.querySelector(`#${IDS.modalConfirmBtn}`);
    modalConfirmAltBtnEl = myModalEl.querySelector(
      `#${IDS.modalConfirmAltBtn}`
    );
    const modalOverlayEl = myModalEl.querySelector(`#${IDS.modalOverlay}`);
    [
      modalInputFirstVersion,
      modalInputLatestVersion,
      modalInputExcludedVersion,
    ] = modalInputsEls;
    modalFixVersionInputs = [modalInputFirstVersion, modalInputLatestVersion];
    modalConfirmBtns = [modalConfirmBtnEl, modalConfirmAltBtnEl];

    // formatterBtn.addEventListener("click", renderContent);
    // settingsBtnEl.addEventListener("click", openModal);
    modalOverlayEl.addEventListener("click", handleCancelModal);
    modalCancelBtnEl.addEventListener("click", handleCancelModal);
    modalConfirmBtnEl.addEventListener("click", handleConfirmModal);
    modalConfirmAltBtnEl.addEventListener("click", handleConfirmAltModal);
    // modalInputFirstVersion.addEventListener("input", handleInput);

    modalInputsEls.forEach((input) => {
      input.addEventListener("focus", handleInputFocus);
      input.addEventListener("blur", handleInputBlur);
      input.addEventListener("change", handleInputChange);
    });
    modalFixVersionInputs.forEach((input) => {
      input.addEventListener("input", handleInput);
    });

    openModal(); // TODO to remove
  };

  const getDigitFromString = (string) => {
    const digitRegex = new RegExp(/(\d(\.?))+/);

    return digitRegex.exec(string) ?? [];
  };

  const parseDigitString = (digitString) => digitString * MULTIPLIER;

  const getJiraFilterUrl = () => {
    const [lowestVersion] = getDigitFromString(modalInputFirstVersion.value);
    const [highestVersion] = getDigitFromString(modalInputLatestVersion.value);

    if (!lowestVersion || !highestVersion) return;

    const filterUrl = new URL("https://jira.nd0.pl/issues/");
    const fixVersionsArray = [];
    const excludedFixVersions = modalInputExcludedVersion.value
      .split(",")
      .filter(Boolean);

    const numberFormatter = new Intl.NumberFormat("de-DE");

    const minValue = parseDigitString(lowestVersion);
    const maxValue = parseDigitString(highestVersion);

    console.log({
      lowestVersion,
      highestVersion,
      minValue,
      maxValue,
      excludedFixVersions,
      diff: maxValue - minValue,
    });
    const fixVersionsDiff = Math.abs(maxValue - minValue);

    switch (true) {
      case minValue > maxValue:
        return console.error(
          `First fix version cannot be greater than the last fix version.`
        );
      case fixVersionsDiff > MAX_FIX_VERSIONS_DIFFERENCE:
        return console.error(
          `Too much difference between fix versions. Max difference: ${MAX_FIX_VERSIONS_DIFFERENCE}.`
        );
      default:
        break;
    }

    for (let i = minValue; i <= maxValue; i++) {
      const formattedIndex = numberFormatter.format(i);
      fixVersionsArray.push(`${FIX_VERSION_PREFIX}${formattedIndex}`);
    }

    const fixVersionIncludedRule = `fixVersion in (${fixVersionsArray.join(
      ", "
    )})`;
    const containsCommentRule = `(comment ~ "${fixVersionsArray.join(
      " OR "
    )}")`;
    const fixVersionExcludedRule = `fixVersion not in (${excludedFixVersions.join(
      ", "
    )})`;

    const getExcludedFixVersionRule = () =>
      excludedFixVersions.length > 0 ? `AND ${fixVersionExcludedRule}` : "";

    const filter = `(${fixVersionIncludedRule} OR ${containsCommentRule}) ${getExcludedFixVersionRule()}`;

    filterUrl.searchParams.set("jql", filter.trim());
    const url = filterUrl.toString();

    return {
      url,
      lowestVersion,
      highestVersion,
    };
  };

  const init = () => {
    generateUiElements();
  };

  init();
})();
