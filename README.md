## TON (The Open Network) blockchain - The duck repo

![state of the workflow](https://github.com/fabcotech/ton-func-contracts/actions/workflows/main.yml/badge.svg)

![The duck](https://sl.combot.org/utyaduck/webp/6xf09f98b3.webp)

A set of low, high value TON blockchain (The Open Network) FunC smart contracts
and test suites. New code coming in regularly.

- **Arithmetic** : TON Smart contract that performs basic add/substract/multiply
  operations on a integer
- **Fibonacci** : TON Smart contract that stores two integers, and continues the
  fibonacci sequence everytime it is touched.
- **Ten thousands transfers** : Two blockchain users exchange TON back and
  forth, 10.000 times, balance is checked after each transfer.
- **One thousand token transfer** : Mints a new token with 100B supply, 30B are
  sent to three blockchain users, they do one thousand small token transfers.
  Balance is checked after each transfer.
- **Ping pong** : A contract stores a string (as `func slice`), each time it is
  called, `"ping"` is toggled to `"pong"` and vice versa.

```sh
yarn
yarn build
yarn test

# Only test arithmetic
yarn test tests/Arithmetic.spec.ts

# Only test fibonacci
yarn test tests/Fibonacci.spec.ts

# Only test 10.000 transfers
yarn test tests/TenThousandsTransfers.spec.ts

# Only test 1.000 token transfers
yarn test tests/OneThousandTokenTransfers.spec.ts

# Only test ping pong
yarn test tests/PingPong.spec.ts
```
