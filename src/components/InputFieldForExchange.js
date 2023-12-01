export default function InputForExchange({
  input,
  onSetInput,
  currency,
  onSetCurency,
  currencyArr,
}) {
  return (
    <div className="inputs">
      <input
        type="text"
        value={input}
        onChange={(e) => onSetInput(Number(e.target.value))}
      ></input>
      <select
        value={currency}
        onChange={(e) => onSetCurency(e.target.value)}
      >
        {currencyArr.map((cur) => (
          <option value={cur} key={cur}>
            {cur}
          </option>
        ))}
      </select>
    </div>
  );
}
