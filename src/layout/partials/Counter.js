import isolate from "@cycle/isolate";
import { hJSX } from "@cycle/dom";
import cls from "./Counter.css";

export function intent({ DOM }) {
  const increment$ = DOM.select(".increment").events("click").map(() => 1);
  const decrement$ = DOM.select(".decrement").events("click").map(() => -1);

  return {
    increment$,
    decrement$,
  };
}

export function view($count) {
  return $count.map(count =>
    <div className={cls.container}>
      <button className="increment">Increment</button>
      <h1>{count}</h1>
      <button className="decrement">Decrement</button>
    </div>
  );
}

function Counter({ DOM, props$ }) {
  const { increment$, decrement$ } = intent({ DOM });

  const count$ = props$.pluck("count");

  return {
    DOM: view(count$),
    increment$,
    decrement$,
  };
}

export default sources => isolate(Counter)(sources);
