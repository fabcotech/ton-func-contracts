import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
} from '@ton/core';

export function counterConfigToCell(): Cell {
  return beginCell().storeUint(0, 32).storeUint(0, 32).endCell();
}

export class Fibonacci implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createFromAddress(address: Address) {
    return new Fibonacci(address);
  }

  static createFromConfig(config: object, code: Cell, workchain = 0) {
    const data = counterConfigToCell();
    const init = { code, data };
    return new Fibonacci(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().storeUint(0, 32).storeUint(0, 32).endCell(),
    });
  }

  async sendTouch(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().storeUint(0, 32).endCell(),
    });
  }

  async getN1(provider: ContractProvider) {
    const result = (await provider.get('get_n1', [])).stack;
    return result.readNumber();
  }

  async getN2(provider: ContractProvider) {
    const result = (await provider.get('get_n2', [])).stack;
    return result.readNumber();
  }
}
