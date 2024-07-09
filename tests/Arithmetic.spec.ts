import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano, ContractProvider } from '@ton/core';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

import { Arithmetic } from '../wrappers/Arithmetic';

export const Opcodes = {
  increase: 0x7e8764ef,
  decrease: 0xe78525c4,
  multiply: 0x6f6bc17a,
};

describe('[Arithmetic]', () => {
  let code: Cell;
  let blockchain: Blockchain;
  let deployer: SandboxContract<TreasuryContract>;
  let arithmeticContract: SandboxContract<Arithmetic>;
  let user1: null | SandboxContract<TreasuryContract> = null;
  let provider: null | ContractProvider = null;

  beforeAll(async () => {
    code = await compile('Arithmetic');
    blockchain = await Blockchain.create();
    user1 = await blockchain.treasury('user1');
    arithmeticContract = blockchain.openContract(Arithmetic.createFromConfig({ counter: 0 }, code));
    provider = blockchain.provider(arithmeticContract.address);
    deployer = await blockchain.treasury('deployer');
    (provider as any).blockchain.openContract(Arithmetic.createFromConfig({ counter: 0 }, code));
  });

  it('[Arithmetic] deploys', async () => {
    const deployResult = await arithmeticContract.sendDeploy(deployer.getSender(), toNano('0.05'));
    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: arithmeticContract.address,
      deploy: true,
      success: true,
    });
  });

  it('[Arithmetic] increases', async () => {
    const initialCounter = await arithmeticContract.getCounter();
    expect(initialCounter).toBe(0);

    // increase from 0 to 12
    const increaseResult = await arithmeticContract.sendIncrease(user1.getSender(), {
      increaseBy: 12,
      value: toNano('0.05'),
    });
    expect(increaseResult.transactions).toHaveTransaction({
      from: user1.address,
      to: arithmeticContract.address,
      success: true,
    });
    expect(await arithmeticContract.getCounter()).toBe(12);
  });

  it('[Arithmetic] decreases', async () => {
    await arithmeticContract.sendDecrease(user1.getSender(), {
      decreaseBy: 1,
      value: toNano('0.05'),
    });
    expect(await arithmeticContract.getCounter()).toBe(11);
  });

  it('[Arithmetic] multiplies', async () => {
    /*
    toto: manage to multiply directly with provider, somehow it only works when
    calling .sendMultiply after
    await (provider as ContractProvider).internal(user1.getSender(), {
      value: toNano('0.05'),
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().storeUint(Opcodes.multiply, 32).storeUint(0, 64).storeUint(2, 32).endCell(),
    }); */
    await arithmeticContract.sendMultiply(user1.getSender(), {
      multiplyBy: 2,
      value: toNano('0.05'),
    });
    expect(await arithmeticContract.getCounter()).toBe(22);
  });
});
