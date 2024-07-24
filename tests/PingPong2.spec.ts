import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano, ContractProvider } from '@ton/core';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

import { PingPong2 } from '../wrappers/PingPong2';

const decodeString = (strBuffer: Cell) => {
  const strOk = strBuffer.toString().replace('x{', '').replace('}', '');
  return Buffer.from(strOk, 'hex').toString('utf8');
};

describe('[PingPong2]', () => {
  let code: Cell;
  let blockchain: Blockchain;
  let deployer: SandboxContract<TreasuryContract>;
  let pingPong2Contract: SandboxContract<PingPong2>;
  let user1: null | SandboxContract<TreasuryContract> = null;
  let user2: null | SandboxContract<TreasuryContract> = null;
  let provider: null | ContractProvider = null;

  beforeAll(async () => {
    code = await compile('PingPong2');
    blockchain = await Blockchain.create();
    user1 = await blockchain.treasury('user1');
    user2 = await blockchain.treasury('user2');
    pingPong2Contract = blockchain.openContract(
      PingPong2.createFromConfig({}, code)
    );
    provider = blockchain.provider(pingPong2Contract.address);
    deployer = await blockchain.treasury('deployer');
    (provider as any).blockchain.openContract(
      PingPong2.createFromConfig({}, code)
    );
  });

  it('[PingPong2] deploys', async () => {
    const deployResult = await pingPong2Contract.sendDeploy(
      deployer.getSender(),
      toNano('0.05')
    );
    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: pingPong2Contract.address,
      deploy: true,
      success: true,
    });
  });

  it('[PingPong2] toggle', async () => {
    expect(decodeString(await pingPong2Contract.getStr())).toBe('ping');
    await pingPong2Contract.sendToggle(
      (user1 as SandboxContract<TreasuryContract>).getSender(),
      {
        value: toNano('0.05'),
      }
    );
    expect(decodeString(await pingPong2Contract.getStr())).toBe('pong');

    await pingPong2Contract.sendToggle(
      (user2 as SandboxContract<TreasuryContract>).getSender(),
      {
        value: toNano('0.05'),
      }
    );
    expect(decodeString(await pingPong2Contract.getStr())).toBe('ping');

    // user2 cannot toggle ping->pong
    await pingPong2Contract.sendToggle(
      (user2 as SandboxContract<TreasuryContract>).getSender(),
      {
        value: toNano('0.05'),
      }
    );
    expect(decodeString(await pingPong2Contract.getStr())).toBe('ping');
  });
});
