# TON (The Open Network) blockchain - The duck repo

![The duck](https://sl.combot.org/utyaduck/webp/6xf09f98b3.webp)

A set of low, high value TON blockchain (Telegram Open Network) FunC smart contracts and test suites. New code coming in regularly.

- **Arithmetic** : TON Smart contract that performs basic add/substract/multiply operations on a integer
- **Fibonacci** : TON Smart contract that stores two integers, and continues the fibonacci sequence everytime it is touched.

```sh
npm i
npm run build
npm run test

# Only test arithmetic
npm run test tests/Arithmetic.spec.ts

# Only test fibonacci
npm run test tests/Fibonacci.spec.ts
```
