// import { useState, useEffect } from "react";

export default function Header({
  currency1,
  currency2,
  query,
  children,
  currency,
}) {
  return (
    <header className="head">
      {children}
      <ul>
        <li>
          1 EUR equals to {currency1 ? currency1 : ""}{" "}
          {query ? currency[query.toLowerCase()] : ""}
        </li>
        <li>
          1 USD equals to {currency2 ? currency2 : ""}{" "}
          {query ? currency[query.toLowerCase()] : ""}
        </li>
      </ul>
    </header>
  );
}
