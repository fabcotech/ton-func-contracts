import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type ArithmeticConfig = {
  counter: number;
};

export function arithmeticConfigToCell(config: ArithmeticConfig): Cell {
  return beginCell().storeUint(config.counter, 32).endCell();
}

export const Opcodes = {
  increase: 0x7e8764ef,
  decrease: 0xe78525c4,
  multiply: 0x6f6bc17a,
};

export class Arithmetic implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new Arithmetic(address);
  }

  static createFromConfig(config: ArithmeticConfig, code: Cell, workchain = 0) {
    const data = arithmeticConfigToCell(config);
    const init = { code, data };
    return new Arithmetic(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    const a = await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
      //debug: true,
    });
    return a;
  }

  async sendIncrease(
    provider: ContractProvider,
    via: Sender,
    opts: {
      increaseBy: number;
      value: bigint;
      queryID?: number;
    },
  ) {
    await provider.internal(via, {
      value: opts.value,
      //debug: true,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(Opcodes.increase, 32)
        .storeUint(opts.queryID ?? 0, 64)
        .storeUint(opts.increaseBy, 32)
        .endCell(),
    });
  }

  async sendDecrease(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      decreaseBy: number;
      queryID?: number;
    },
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(Opcodes.decrease, 32)
        .storeUint(opts.queryID ?? 0, 64)
        .storeUint(opts.decreaseBy, 32)
        .endCell(),
    });
  }
  async sendMultiply(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      multiplyBy: number;
      queryID?: number;
    },
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(Opcodes.multiply, 32)
        .storeUint(opts.queryID ?? 0, 64)
        .storeUint(opts.multiplyBy, 32)
        .endCell(),
    });
  }

  async getCounter(provider: ContractProvider) {
    const result = await provider.get('get_counter', []);
    return result.stack.readNumber();
  }
}
