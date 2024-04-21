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
  let modalFormWrapperEl;
  let modalInputFirstVersion;
  let modalInputLatestVersion;
  let modalInputExcludedVersion;
  let modalInputErrorWrapperEl;
  let modalInputsEls = [];

  const toggleModal = (force = undefined) => {
    myModalEl.classList.toggle(STATE.visible, force);
  };

  const handleModalTransitionEnd = (e) => {
    // setInputCustomUrl();
    // setInputCustomWeekOffset();

    // modalInputsEls.forEach((input) => toggleModalFormWrapperFilledState(input));

    myModalEl.removeEventListener("transitionend", handleModalTransitionEnd);
  };

  const closeModal = () => {
    toggleModal(false);
  };

  const copyJiraFilterUrlIntoClipboard = async () => {
    const { url, lowestVersion, highestVersion } = getJiraFilterUrl();
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

  const handleConfirmModal = async () => {
    // const isUrlInputValid = validateInputUrl();

    // if (!isUrlInputValid) return toggleModalError(true);

    // localStorage.setItem(JIRA_WEEK_OFFSET, modalInputOffsetEl.value.trim());
    // localStorage.setItem(JIRA_CUSTOM_URL, modalInputUrlEl.value.trim());

    // closeModal();

    // window.open(getJiraFilterUrl().url, "_blank");
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

  const handleInput = (e) => {
    // if (!modalInputErrorWrapperEl.classList.contains(STATE.visible)) return;
    const { target } = e;
    const { value } = target;
    const fixVersionRegex = new RegExp(/^FrontPortal-((\d)(\.\d{0,3})?)?$/);
    const fixVersionWithoutDotRegex = new RegExp(/^FrontPortal-(\d{2,4})/);
    const isValidFixVersion = fixVersionRegex.test(value);
    const isfixVersionWithoutDot = fixVersionWithoutDotRegex.test(value);
    console.log({
      value,
      isValidFixVersion,
      isfixVersionWithoutDot,
    });

    if (isValidFixVersion) return (target.dataset.prevValue = value);
    if (isfixVersionWithoutDot) {
      const replacedValue = setDotAfterFirstDigit(target);
      return (target.value = replacedValue);
    }

    target.value = target.dataset.prevValue;
    // toggleModalError(false);
  };

  const generateModal = () => {
    const modal = document.createElement("div");

    modal.id = IDS.myModal;
    modal.className = "my-modal active visible";
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
          <button class="btn btn--light" id="${IDS.modalCancelBtn}">${MESSAGES.modal.cancelBtn}</button>
          <button class="btn" id="${IDS.modalConfirmBtn}">${MESSAGES.modal.confirmBtn}</button>
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
    const modalOverlayEl = myModalEl.querySelector(`#${IDS.modalOverlay}`);
    [
      modalInputFirstVersion,
      modalInputLatestVersion,
      modalInputExcludedVersion,
    ] = modalInputsEls;

    // formatterBtn.addEventListener("click", renderContent);
    // settingsBtnEl.addEventListener("click", openModal);
    modalOverlayEl.addEventListener("click", handleCancelModal);
    modalCancelBtnEl.addEventListener("click", handleCancelModal);
    modalConfirmBtnEl.addEventListener("click", handleConfirmModal);
    // modalInputFirstVersion.addEventListener("input", handleInput);

    modalInputsEls.forEach((input) => {
      input.addEventListener("focus", handleInputFocus);
      input.addEventListener("blur", handleInputBlur);
      input.addEventListener("change", handleInputChange);
    });
    [modalInputFirstVersion, modalInputLatestVersion].forEach((input) =>
      input.addEventListener("input", handleInput)
    );
  };

  const getJiraFilterUrl = () => {
    const MULTIPLIER = 1000;
    const MAX_FIX_VERSIONS_DIFFERENCE = 50;

    const digitRegex = new RegExp(/(\d(\.?))+/);
    const [lowestVersion] = digitRegex.exec(modalInputFirstVersion.value) ?? [];
    const [highestVersion] =
      digitRegex.exec(modalInputLatestVersion.value) ?? [];

    if (!lowestVersion || !highestVersion) return;

    const filterUrl = new URL("https://jira.nd0.pl/issues/");
    const fixVersionsArray = [];
    const excludedFixVersions = modalInputExcludedVersion.value
      .split(",")
      .filter(Boolean);

    const numberFormatter = new Intl.NumberFormat("de-DE");

    const minValue = lowestVersion * MULTIPLIER;
    const maxValue = highestVersion * MULTIPLIER;

    console.log({
      lowestVersion,
      highestVersion,
      minValue,
      maxValue,
      excludedFixVersions,
      diff: maxValue - minValue,
    });
    const fixVersionsDiff = Math.abs(maxValue - minValue);

    if (fixVersionsDiff > MAX_FIX_VERSIONS_DIFFERENCE) {
      return console.error(
        `Too much difference between fix versions. Max difference: ${MAX_FIX_VERSIONS_DIFFERENCE}`
      );
    }

    for (let i = minValue; i <= maxValue; i++) {
      const formattedIndex = numberFormatter.format(i);
      fixVersionsArray.push(`${FIX_VERSION_PREFIX}${formattedIndex}`);
    }

    const fixVersionIncludedRule = `fixVersion in (${fixVersionsArray.join(
      ", "
    )})`;
    const containsTextRule = `(text ~ "${fixVersionsArray.join(" OR ")}")`;
    const fixVersionExcludedRule = `fixVersion not in (${excludedFixVersions.join(
      ", "
    )})`;

    const getExcludedFixVersionRule = () =>
      excludedFixVersions.length > 0 ? `AND ${fixVersionExcludedRule}` : "";

    const filter = `(${fixVersionIncludedRule} OR ${containsTextRule}) ${getExcludedFixVersionRule()}`;

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
