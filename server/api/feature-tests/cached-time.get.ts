// 1st-party Nitro cache: the handler body runs at most once per `maxAge` window.
let calls = 0;

export default defineCachedEventHandler(
  () => {
    calls += 1;
    return { calls, value: `${Date.now()}-${calls}` };
  },
  {
    getKey: () => 'value',
    maxAge: 5,
    name: 'feature-tests-time',
    swr: false,
  },
);
