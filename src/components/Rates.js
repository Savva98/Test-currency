import { useEffect, useState } from "react";

export default function Rates({
  currencyFrom,
  currencyTo,
  currencies,
}) {
  const [currencyRates, setCurrencyRates] = useState(0);
  async function makeRates(curr1, curr2) {
    try {
      const currLower = curr1.toLowerCase();
      const curr2Lower = curr2.toLowerCase();
      const resp = await fetch(
        `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currLower}/${curr2Lower}.json`
      );
      const data = await resp.json();
      setCurrencyRates(data[curr2Lower]);
    } catch (err) {
      console.error(err.message);
    }
  }
  useEffect(
    function () {
      makeRates(currencyFrom, currencyTo);
    },
    [currencyFrom, currencyTo]
  );
  return (
    <div className="rate">
      <p>
        1 {currencies[currencyFrom.toLowerCase()]} equals
      </p>
      <h2>
        {currencyRates.toFixed(2)}{" "}
        {currencies[currencyTo.toLowerCase()]}
      </h2>
    </div>
  );
}
