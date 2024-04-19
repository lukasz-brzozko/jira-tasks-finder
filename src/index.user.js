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
      confirmBtn: "Zapisz",
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
    modalOverlay: "modal-overlay",
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
      const replacedValue = e.target.value.replace(
        /\d{1}/,
        (match) => `${match}.`
      );
      target.value = replacedValue;
      e.target.value = replacedValue;

      return;
    }

    e.target.value = e.target.dataset.prevValue;
    // toggleModalError(false);
  };

  const generateModal = () => {
    const modal = document.createElement("div");

    modal.id = IDS.myModal;
    modal.className = "my-modal active visible";
    modal.innerHTML = `
      <div class="modal-overlay" id="modal-overlay"></div>
      <div class="modal-wrapper">
        <h2 class="modal-title">${MESSAGES.modal.title}</h2>
        <div class="modal-content-container">
          <p class="modal-desc">${MESSAGES.modal.desc}</p>
          <div class="modal-form-wrapper filled" id="${IDS.modalFormWrapper}">
            <label class="modal-label">${MESSAGES.modal.label}</label>
            <div class="modal-input-wrapper">
              <input class="modal-input" id="modal-input-url" value="FrontPortal-" data-prev-value="FrontPortal-">
            </div>
            <div class="modal-input-error-wrapper" id="${IDS.modalInputErrorWrapper}">
              <p class="modal-input-error">${MESSAGES.error.modal.inputUrl}</p>
            </div>
          </div>
          <div class="modal-form-wrapper filled" id="${IDS.modalFormVersionLatest}">
            <label class="modal-label">${MESSAGES.modal.latestVersion}</label>
            <div class="modal-input-wrapper">
              <input class="modal-input" id="modal-input-offset" value="FrontPortal-" data-prev-value="FrontPortal-">
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
    // modalOverlayEl.addEventListener("click", handleCancelModal);
    // modalCancelBtnEl.addEventListener("click", handleCancelModal);
    // modalConfirmBtnEl.addEventListener("click", handleConfirmModal);
    // modalInputFirstVersion.addEventListener("input", handleInput);
    modalInputsEls.forEach((input) => {
      input.addEventListener("focus", handleInputFocus);
      input.addEventListener("blur", handleInputBlur);
      input.addEventListener("change", handleInputChange);
      input.addEventListener("input", handleInput);
    });
  };

  const init = () => {
    const lowestVersion = 1.524;
    const highestVersion = 1.531;
    const multiplier = 1000;

    const baseUrl = "https://jira.nd0.pl/issues/";
    const fixVersionPrefix = "FrontPortal-";
    const fixVersionsArray = [];
    const excludedFixVersions = ["PROD_updating_10.04.2024"];

    const formatter = new Intl.NumberFormat("de-DE");

    const minValue = lowestVersion * multiplier;
    const maxValue = highestVersion * multiplier;

    for (let i = minValue; i <= maxValue; i++) {
      const formattedIndex = formatter.format(i);
      fixVersionsArray.push(`${fixVersionPrefix}${formattedIndex}`);
    }

    const filter = `(fixVersion in (${fixVersionsArray.join(
      ", "
    )}) OR (text ~ "${fixVersionsArray.join(
      " OR "
    )}")) AND fixVersion not in (${excludedFixVersions.join(", ")})`;

    const url = `${baseUrl}?jql=${encodeURIComponent(filter)}`;
    console.log(url);
    // window.open(url, "_blank");

    generateUiElements();
  };

  init();
})();
