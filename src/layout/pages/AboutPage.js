import Rx from "rx";
import { hJSX } from "@cycle/dom";

function view(props$) {
  return props$.map(props =>
    <h1>About {props.name}</h1>
  );
}

export default function AboutPage(sources) {
  const { router, props$ } = sources;

  return {
    DOM: view(props$),
    router,
  };
}
