// https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json

import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import Search from "./components/Search";
import Exchanger from "./components/Exchanger";
import InputForExchange from "./components/InputFieldForExchange";
import Rates from "./components/Rates";
const currencyArr = ["UAH", "USD", "EUR", "GBP", "PLN"];

export default function App() {
  const [exchangeRate, setExchangeRate] = useState(0);
  const [exchangeRate2, setexchangeRate2] = useState(0);
  const [query, setQuery] = useState("UAH");
  const [currencyFrom, setCurrencyFrom] = useState("USD");
  const [currencyTo, setCurrencyTo] = useState("UAH");
  const [inputFrom, setInputFrom] = useState(1);
  const [inputTo, setInputTo] = useState(0);
  const [currency, setCurrencies] = useState({});
  const [rates, setRates] = useState({
    uah: "UAH",
    usd: "USD",
    eur: "EUR",
    gbp: "GBP",
    pln: "PLN",
  });
  const defaultInputCurrencyTo = useRef(null);

  function fixedNumbers(num) {
    return num.toFixed(2);
  }

  function settingInput(amount, currency1, currency2) {
    return (
      amount *
      rates[currency1.toLowerCase()][
        currency2.toLowerCase()
      ]
    );
  }

  function settingCurrencies(input, chosenCur, curTo) {
    return (
      input *
      rates[chosenCur.toLowerCase()][curTo.toLowerCase()]
    );
  }
  function handleChangeAmount1(amount) {
    setInputTo(
      fixedNumbers(
        settingInput(amount, currencyFrom, currencyTo)
      )
    );
    setInputFrom(amount);
    defaultInputCurrencyTo.current = 0;
  }

  function handleChangeCurrency1(currency) {
    setInputTo(
      fixedNumbers(
        settingCurrencies(inputFrom, currency, currencyTo)
      )
    );
    setCurrencyFrom(currency);
    defaultInputCurrencyTo.current = settingCurrencies(
      inputFrom,
      currency,
      currencyTo
    );
  }

  function handleChangeAmount2(amount) {
    setInputFrom(
      amount
        ? fixedNumbers(
            settingInput(amount, currencyTo, currencyFrom)
          )
        : 0
    );
    setInputTo(amount);

    defaultInputCurrencyTo.current = 0;
  }
  function handleChangeCurrency2(currency) {
    if (!inputTo) {
      setInputFrom(
        fixedNumbers(
          settingCurrencies(
            defaultInputCurrencyTo.current,
            currency,
            currencyFrom
          )
        )
      );
    } else {
      setInputFrom(
        fixedNumbers(
          settingCurrencies(inputTo, currency, currencyFrom)
        )
      );
    }
    setCurrencyTo(currency);
  }

  useEffect(
    function () {
      const controller = new AbortController();
      async function exchange() {
        const search = query.toLowerCase();
        if (search.length < 3) {
          setExchangeRate(0);
          setexchangeRate2(0);
          return;
        }
        if (!Object.keys(currency).includes(search)) {
          setExchangeRate(0);
          setexchangeRate2(0);
          return;
        }
        try {
          const resp = await fetch(
            `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/eur/${search}.json`,
            { signal: controller.signal }
          );
          const data = await resp.json();
          setExchangeRate(fixedNumbers(data[search]));

          const resp2 = await fetch(
            `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/${search}.json`,
            { signal: controller.signal }
          );
          const data2 = await resp2.json();
          setexchangeRate2(fixedNumbers(data2[search]));
        } catch (err) {
          if (err.name !== "AbortError")
            console.error(err.message);
        }
      }
      exchange();

      return function () {
        controller.abort();
      };
    },
    [query, currency]
  );

  useEffect(function () {
    async function allCurencies() {
      const currencies = await fetch(
        `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json`
      );
      const currency = await currencies.json();
      setCurrencies(currency);
      for (
        let index = 0;
        index < currencyArr.length;
        index++
      ) {
        const currency = await fetch(
          `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currencyArr[
            index
          ].toLowerCase()}.json`
        );
        const data = await currency.json();
        setRates((obj) => {
          return {
            ...obj,
            [currencyArr[index].toLowerCase()]:
              data[currencyArr[index].toLowerCase()],
          };
        });
      }
    }
    allCurencies();
  }, []);
  useEffect(function () {
    async function change() {
      const resp = await fetch(
        `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/uah.json`
      );
      const data = await resp.json();
      defaultInputCurrencyTo.current = 1 * data.uah;
    }
    change();
  }, []);

  return (
    <div className="App">
      <Header
        currency1={exchangeRate}
        currency2={exchangeRate2}
        query={query}
        currency={currency}
      >
        <Search query={query} onSetQuery={setQuery} />
      </Header>

      <Exchanger>
        <Rates
          currencyFrom={currencyFrom}
          currencyTo={currencyTo}
          currencies={currency}
          inputFrom={inputFrom}
          inputTo={setInputTo}
        />

        <InputForExchange
          currencyArr={currencyArr}
          currency={currencyFrom}
          input={inputFrom}
          onSetCurency={handleChangeCurrency1}
          onSetInput={handleChangeAmount1}
        />

        <InputForExchange
          currencyArr={currencyArr}
          currency={currencyTo}
          input={
            defaultInputCurrencyTo.current
              ? fixedNumbers(defaultInputCurrencyTo.current)
              : inputTo
          }
          onSetCurency={handleChangeCurrency2}
          onSetInput={handleChangeAmount2}
        />
      </Exchanger>
    </div>
  );
}
