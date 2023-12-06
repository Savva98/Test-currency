import axios from "axios";
import { useState, useEffect } from "react";
import InputForExchange from "./InputFieldForExchange";
const currencyArr = ["UAH", "USD", "EUR", "GBP", "PLN"];

export default function AsynchroniousInputs() {
  const [rate1, setRate1] = useState(0);
  const [rate2, setRate2] = useState(0);
  const [currencyFrom, setCurrencyFrom] = useState("USD");
  const [currencyTo, setCurrencyTo] = useState("UAH");
  const [inputFrom, setInputFrom] = useState(1);
  const [inputTo, setInputTo] = useState(0);

  useEffect(
    function () {
      async function getExchangeFromTo() {
        if (rate2 === inputFrom) return;
        try {
          const resp = await axios(
            `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currencyFrom.toLowerCase()}/${currencyTo.toLowerCase()}.json`
          );
          setRate1(
            inputFrom * resp.data[currencyTo.toLowerCase()]
          );
          setInputTo(
            inputFrom * resp.data[currencyTo.toLowerCase()]
          );
        } catch (err) {
          console.error(err);
        }
      }
      getExchangeFromTo();
    },

    [currencyFrom, currencyTo, inputFrom, rate2]
  );

  useEffect(
    function () {
      async function getExchangeToFrom() {
        if (rate1 === inputTo) return;
        try {
          const resp = await axios(
            `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currencyTo.toLowerCase()}/${currencyFrom.toLowerCase()}.json`
          );
          setRate2(
            inputTo * resp.data[currencyFrom.toLowerCase()]
          );
          setInputFrom(
            inputTo * resp.data[currencyFrom.toLowerCase()]
          );
        } catch (err) {
          console.error(err);
        }
      }
      getExchangeToFrom();
    },
    [currencyFrom, currencyTo, inputTo, rate1]
  );

  return (
    <div className="async">
      <InputForExchange
        currencyArr={currencyArr}
        currency={currencyFrom}
        input={inputFrom}
        onSetInput={setInputFrom}
        onSetCurency={setCurrencyFrom}
      />
      <InputForExchange
        currencyArr={currencyArr}
        currency={currencyTo}
        input={inputTo}
        onSetInput={setInputTo}
        onSetCurency={setCurrencyTo}
      />
    </div>
  );
}
