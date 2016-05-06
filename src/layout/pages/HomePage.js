import Rx from "rx";
import { hJSX } from "@cycle/dom";

export default function HomePage(sources) {
  const { router } = sources;
  return {
    DOM: Rx.Observable.just(<h1>Home</h1>),
    router,
  };
}
