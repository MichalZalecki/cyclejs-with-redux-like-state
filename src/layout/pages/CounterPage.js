import Rx from "rx";
import { hJSX } from "@cycle/dom";
import Counter from "src/layout/partials/Counter";

function view(counterDOM$) {
  return counterDOM$.map(counterDOM =>
    <div>
      <h1>Counter:</h1>
      {counterDOM}
    </div>
  );
}

export default function CounterPage(sources) {
  const { router, state$, DOM } = sources;

  const counterProps$ = state$.map(({ count }) => ({ count }));
  const counter = Counter({ DOM, props$: counterProps$ });

  const { increment$, decrement$, DOM: counterDOM$ } = counter;

  const actions$ = Rx.Observable.merge(
    increment$.map(payload => ({ type: "INCREMENT_COUNTER", payload })),
    decrement$.map(payload => ({ type: "DECREMENT_COUNTER", payload })),
  );

  actions$.subscribe(::console.warn); // fires without problems

  return {
    DOM: view(counterDOM$),
    router,
    actions$,
  };
}
