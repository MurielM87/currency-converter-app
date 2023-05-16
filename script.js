const dropList = document.querySelectorAll('.drop_list select');
fromCurrency = document.querySelector('.from select');
toCurrency = document.querySelector('.to select');
getBtn = document.querySelector('form button');

for (let i = 0; i < dropList.length; i++) {
    for (currency_code in country_code) {
        //selecting EUR by defalt as FROM currency and USD as TO currency
        let selected;
        if (i == 0) {
            selected = currency_code == 'EUR' ? 'selected' : '';
        } else if (i == 1) {
            selected = currency_code == 'USD' ? 'selected' : '';
        }
        //creation option tag with passing currency code as a text and value
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        //insert options tag inside select tag
        dropList[i].insertAdjacentHTML('beforeend', optionTag);
    }
    dropList[i].addEventListener('change', e => {
        loadFlag(e.target); //calling loadFlag with passing target element as an argument
    });
}

function loadFlag(element) {
    for(code in country_code) {
        if(code == element.value) { //f currency code of country list is equal to option value
            let imgTag = element.parentElement.querySelector('img'); //img tag of particular drop list
            //passing country code of a selected currency code in a img url
            imgTag.src = `https://flagsapi.com/${country_code[code]}/shiny/64.png`;
        }
    }
}

window.addEventListener('load', () => {
    getExchangeRate();   
});
getBtn.addEventListener('click', e => {
    e.preventDefault();
    getExchangeRate();
    
});

const exchangeIcon = document.querySelector('.drop_list .icon');
exchangeIcon.addEventListener('click', () => {
    let tempCode = fromCurrency.value; //temporary currency code of FROM drop list
    fromCurrency.value = toCurrency.value; //passing TO currency code to FROM currency code
    toCurrency.value = tempCode; //passing temporary currency code to TO currency code
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();

});

function getExchangeRate() {
    const amount = document.querySelector('.amount input');
    exchangeRateTxt = document.querySelector('.exchange_rate');
    let amountVal = amount.value;
    //1 value by default if any value or 0
    if(amountVal == '' || amountVal == '0') {
        amount.value = '1';
        amountVal = 1;
    }
    exchangeRateTxt.innerText = 'Getting exchange rate ...';
    let url = `https://v6.exchangerate-api.com/v6/${process.env.KEY_API}/latest/${fromCurrency.value}`;
    
    fetch(url)
        .then(res => res.json())
        .then(result => {
            let exchangeRate = result.conversion_rates[toCurrency.value];
            let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
            exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
        })
        .catch(() => {
            exchangeRateTxt.innerText = 'Something went wrong, sorry !';
        });
}