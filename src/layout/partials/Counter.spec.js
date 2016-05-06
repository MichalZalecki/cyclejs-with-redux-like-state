import Rx from "rx";
import { view, intent } from "./Counter";
import { mockDOMSource } from "@cycle/dom";
import createElement from "virtual-dom/create-element";

describe("Counter", () => {
  describe("intent", () => {
    it("handles increment and decrement actions", () => {
      const DOMMock = mockDOMSource({
        ".increment": {
          click: Rx.Observable.from([{ target: null }, { target: null }]),
        },
        ".decrement": {
          click: Rx.Observable.from([{ target: null }, { target: null }, { target: null }]),
        },
      });

      const { increment$, decrement$ } = intent({ DOM: DOMMock });
      increment$.toArray().subscribe(values => expect(values).toEqual([1, 1]));
      decrement$.toArray().subscribe(values => expect(values).toEqual([-1, -1, -1]));
    });
  });

  describe("view", () => {
    it("renders component with count and buttons", () => {
      const vtree$ = view(Rx.Observable.just(10));

      vtree$.subscribe(vtree => {
        const tree = createElement(vtree);
        expect(tree.querySelector("h1").textContent).toEqual("10");
        expect(tree.querySelector("button.increment")).not.toBeNull();
        expect(tree.querySelector("button.decrement")).not.toBeNull();
      });
    });
  });
});
