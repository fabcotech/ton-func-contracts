import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

import { Fibonacci } from '../wrappers/Fibonacci';

describe('[Fibonacci]', () => {
  let code: Cell;
  let blockchain: Blockchain;
  let deployer: SandboxContract<TreasuryContract>;
  let contract: SandboxContract<Fibonacci>;
  let user1: null | SandboxContract<TreasuryContract> = null;

  beforeAll(async () => {
    code = await compile('Fibonacci');
    blockchain = await Blockchain.create();
    user1 = await blockchain.treasury('user1');
    contract = blockchain.openContract(Fibonacci.createFromConfig({}, code));
    deployer = await blockchain.treasury('deployer');
  });

  it('[Fibonacci] deploys', async () => {
    const deployResult = await contract.sendDeploy(
      deployer.getSender(),
      toNano('0.05')
    );
    expect(typeof deployResult.transactions[0].now).toBe('number');
  });

  it('[Fibonacci] triggers fibonacci sequence', async () => {
    for (const vals of [
      [1, 0],
      [1, 1],
      [2, 1],
      [3, 2],
      [5, 3],
      [8, 5],
      [13, 8],
      [21, 13],
      [34, 21],
    ]) {
      const n1 = await contract.getN1();
      const n2 = await contract.getN2();
      expect(n1).toBe(vals[0]);
      expect(n2).toBe(vals[1]);
      await contract.sendTouch(
        (user1 as SandboxContract<TreasuryContract>).getSender(),
        toNano('0.05')
      );
    }
  });
});
