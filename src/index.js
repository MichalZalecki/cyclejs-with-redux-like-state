import Rx from "rx";
import Cycle from "@cycle/core";
import { makeDOMDriver, hJSX } from "@cycle/dom";
import store from "src/store";
import { makeRouterDriver } from "cyclic-router";
import { createHistory } from "history";

import HomePage from "src/layout/pages/HomePage";
import CounterPage from "src/layout/pages/CounterPage";
import AboutPage from "src/layout/pages/AboutPage";

export function model(actions$) {
  const initialState$ = Rx.Observable.of({ count: 0 });

  const incrementCounter$ = actions$
    .filter(({ type }) => type === "INCREMENT_COUNTER")
    .map(({ payload }) => state => ({ ...state, count: state.count + payload }));

  const decrementCounter$ = actions$
    .filter(({ type }) => type === "DECREMENT_COUNTER")
    .map(({ payload }) => state => ({ ...state, count: state.count + payload }));

  const rootReducer$ = Rx.Observable.merge(
    incrementCounter$,
    decrementCounter$,
  );

  const state$ = store(rootReducer$, initialState$);

  return state$;
}

function view(createHref, page$) {
  return page$.map(page =>
    <div>
      <ul>
        <li><a href={createHref("/")}>Home</a></li>
        <li><a href={createHref("/counter")}>Counter</a></li>
        <li><a href={createHref("/about/me")}>About me</a></li>
        <li><a href={createHref("/about/you")}>About you</a></li>
      </ul>
      {page}
    </div>
  );
}

function main(sources) {
  const proxyState$ = new Rx.ReplaySubject(1);

  const match$ = sources.router.define({
    "/": HomePage,
    "/counter": CounterPage,
    "/about/:name": name => sources => AboutPage({ ...sources, props$: Rx.Observable.of({ name }) }),
  });

  const page$ = match$.map(({ path, value }) => {
    return value({ ...sources, router: sources.router.path(path), state$: proxyState$ });
  }).shareReplay();

  const pageDOM$ = page$.flatMap(page => page.DOM);
  const pageActions$ = page$.pluck("actions$").filter(Boolean).mergeAll();

  const state$ = model(pageActions$);

  state$.subscribe(proxyState$.asObserver());

  return {
    DOM: view(sources.router.createHref, pageDOM$),
    router: Rx.Observable.empty(),
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver("#root"),
  router: makeRouterDriver(createHistory()),
});
