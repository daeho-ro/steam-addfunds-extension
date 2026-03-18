(function () {
  if (document.getElementById('steam-helper-custom')) return;

  const container = document.getElementById('prices_user');
  if (!container) return;

  const t = chrome.i18n.getMessage;
  const locale = chrome.i18n.getUILanguage();
  const currency = t('currency');
  const minAmount = Number(t('minAmount'));
  const multiplier = Number(t('multiplier'));

  const fmt = new Intl.NumberFormat(locale, { style: 'currency', currency });
  const fmtMin = fmt.format(minAmount);

  const card = document.createElement('div');
  card.id = 'steam-helper-custom';
  card.className = 'addfunds_area_purchase_game game_area_purchase_game';
  card.innerHTML = `
    <div class="addfunds_purchase_action game_purchase_action shp-action">
      <div class="game_purchase_action_bg">
        <div class="game_purchase_price price shp-price-input">
          <input id="shp-custom-input" type="number" inputmode="decimal" placeholder="${minAmount}" min="${minAmount}">
        </div>
        <a class="btnv6_green_white_innerfade btn_medium shp-btn-disabled" id="shp-submit-btn" href="#">
          <span>${t('buttonText')}</span>
        </a>
      </div>
    </div>
    <h1>${t('title')}</h1>
    <p id="shp-helper-text">${t('minAmountText', [fmtMin])}</p>
  `;

  const first = container.querySelector('.addfunds_area_purchase_game');
  first ? container.insertBefore(card, first) : container.appendChild(card);

  const input = document.getElementById('shp-custom-input');
  const btn = document.getElementById('shp-submit-btn');
  const text = document.getElementById('shp-helper-text');

  function setBtn(enabled) {
    btn.classList.toggle('shp-btn-disabled', !enabled);
    btn.classList.toggle('shp-btn-enabled', enabled);
  }

  input.addEventListener('input', () => {
    const n = parseFloat(input.value);

    if (!input.value || isNaN(n)) {
      setBtn(false);
      text.textContent = t('minAmountText', [fmtMin]);
      text.className = '';
      return;
    }

    if (n < minAmount) {
      setBtn(false);
      text.textContent = t('minAmountText', [fmtMin]);
      text.className = 'shp-text-error';
    } else {
      setBtn(true);
      text.textContent = fmt.format(n);
      text.className = '';
    }
  });

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') btn.click();
  });

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const n = parseFloat(input.value);

    if (isNaN(n) || n < minAmount) {
      text.textContent = t('inputError', [fmtMin]);
      text.className = 'shp-text-error';
      return;
    }

    const form = document.getElementById('form_addfunds');
    const amount = document.getElementById('input_amount');
    const currencyInput = document.getElementById('input_currency');

    if (form && amount && currencyInput) {
      amount.value = Math.round(n * multiplier);
      currencyInput.value = currency;
      form.submit();
    } else {
      text.textContent = t('formNotFoundError');
      text.className = 'shp-text-error';
    }
  });
})();
