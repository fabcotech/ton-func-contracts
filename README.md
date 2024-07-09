## TON (The Open Network) blockchain - The duck repo

![state of the workflow](https://github.com/fabcotech/nest-typeorm-boilerplate/actions/workflows/main.yml/badge.svg)

![The duck](https://sl.combot.org/utyaduck/webp/6xf09f98b3.webp)

A set of low, high value TON blockchain (The Open Network) FunC smart contracts and test suites. New code coming in regularly.

- **Arithmetic** : TON Smart contract that performs basic add/substract/multiply operations on a integer
- **Fibonacci** : TON Smart contract that stores two integers, and continues the fibonacci sequence everytime it is touched.
- **Ten thousands transfers** : Two blockchain users exchange TON back and forth, 10.000 times, balance is checked after each transfer.

```sh
npm i
npm run build
npm run test

# Only test arithmetic
npm run test tests/Arithmetic.spec.ts

# Only test fibonacci
npm run test tests/Fibonacci.spec.ts

# Only test 10.000 transfers
npm run test tests/TenThousandsTransfers.spec.ts

# Only test 1.000 token transfers
npm run test tests/OneThousandTokenTransfers.spec.ts
```
