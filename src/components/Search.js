import { useEffect, useRef } from "react";

export default function Search({ onSetQuery, query }) {
  const inputEl = useRef(null);

  useEffect(
    function () {
      function callBack(e) {
        if (document.activeElement === inputEl.current) {
          return;
        }
        if (e.key === "Enter") {
          inputEl.current.focus();
          onSetQuery("");
        }
      }

      document.addEventListener("keydown", callBack);

      return function () {
        document.addEventListener("keydown", callBack);
      };
    },
    [onSetQuery]
  );
  return (
    <input
      type="text"
      value={query}
      placeholder="Search a currency..."
      onChange={(e) => onSetQuery(e.target.value)}
      ref={inputEl}
      className="search"
    ></input>
  );
}
