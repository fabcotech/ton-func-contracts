import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
  toNano,
} from '@ton/core';

export function bankConfigToCell(): Cell {
  return beginCell()
    .storeRef(beginCell().storeCoins(toNano('0')).endCell())
    .endCell();
}

export class Bank implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createFromAddress(address: Address) {
    return new Bank(address);
  }

  static createFromConfig(code: Cell, workchain = 0) {
    const data = bankConfigToCell();
    const init = { code, data };
    return new Bank(contractAddress(workchain, init), init);
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

  async sendTransfer(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
    }
  ) {
    await provider.internal(via, {
      value: opts.value,
      //debug: true,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async getBal(provider: ContractProvider) {
    const result = await provider.get('get_bal', []);
    return result.stack.readCell().beginParse().preloadCoins();
  }
}
