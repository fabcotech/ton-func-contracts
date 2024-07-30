## TON (The Open Network) blockchain - The duck repo

![state of the workflow](https://github.com/fabcotech/ton-func-contracts/actions/workflows/main.yml/badge.svg)

![The duck](https://sl.combot.org/utyaduck/webp/6xf09f98b3.webp)

A set of low, high value TON blockchain (The Open Network) FunC smart contracts
and test suites. New code coming in regularly.

- **Arithmetic** : TON Smart contract that performs basic add/substract/multiply
  operations on a integer. _Storing number on chain_, _performing operations on
  a number_
- **Fibonacci** : TON Smart contract that stores two integers, and continues the
  fibonacci sequence everytime it is touched.
- **Ten thousands transfers** : Two blockchain users exchange TON back and
  forth, 10.000 times, balance is checked after each transfer.
- **One thousand token transfer** : Mints a new token with 100B supply, 30B are
  sent to three blockchain users, they do one thousand small token transfers.
  Balance is checked after each transfer.
- **Ping pong** : A contract stores a string (as `slice`), each time it is
  called, `"ping"` is toggled to `"pong"` and vice versa. _Storing a string as
  slice on chain_, _Comparing two slices one with another_
- **Ping pong (2)** : Same as Ping pong but only one address is authorized to
  toggle ping->pong, and only one other address is authorized to toggle
  pong->ping. _Checking sender address_, _Comparing sender address with another
  arbitrary address_
- **Bank** : A simple contract can receive coins, and store them into a cell.
  _receive TON_, _store TON in a smart contract_

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

# Only test ping pong 2
yarn test tests/PingPong2.spec.ts

# Only test bank
yarn test tests/Bank.spec.ts
```
