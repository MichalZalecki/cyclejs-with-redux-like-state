import Rx from "rx";
import store from "./store";

describe("store", () => {
  it("creates reactive state", () => {
    const initialState$ = Rx.Observable.of({ name: "foo", age: 10 });

    // actions
    const incrementAge$ = Rx.Observable.repeat(null, 3);
    const changeName$ = Rx.Observable.from(["bar", "baz"]);

    // reducers
    const incrementAgeReducer$ = incrementAge$.map(_payload => state =>
      ({ ...state, age: state.age + 1 }));
    const changeNameReducer$ = changeName$.map(payload => state =>
      ({ ...state, name: payload }));

    const rootReducer$ = Rx.Observable.concat(incrementAgeReducer$, changeNameReducer$);

    const state$ = store(rootReducer$, initialState$);

    const expectedStates = [
      { name: "foo", age: 10 },
      { name: "foo", age: 11 },
      { name: "foo", age: 12 },
      { name: "foo", age: 13 },
      { name: "bar", age: 13 },
      { name: "baz", age: 13 },
    ];

    state$.toArray().subscribe(states => expect(states).toEqual(expectedStates));
  });
});
