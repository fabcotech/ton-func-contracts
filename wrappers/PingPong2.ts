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

export function pingPong2ConfigToCell(): Cell {
  const forwardPayload = beginCell().storeStringTail('ping').endCell();
  return beginCell().storeRef(forwardPayload).endCell();
}

export class PingPong2 implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createFromAddress(address: Address) {
    return new PingPong2(address);
  }

  static createFromConfig(config: object, code: Cell, workchain = 0) {
    const data = pingPong2ConfigToCell();
    const init = { code, data };
    return new PingPong2(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    const a = await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
    return a;
  }

  async sendToggle(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
    }
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().storeUint(10, 32).endCell(),
    });
  }

  async getStr(provider: ContractProvider) {
    const result = await provider.get('get_str', []);
    return result.stack.readCell();
  }
}
