export default function store(reducer$, initialState$) {
  return initialState$
    .merge(reducer$)
    .scan((state, reducer) => reducer(state))
    .shareReplay(1);
}
