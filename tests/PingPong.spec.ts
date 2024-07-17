import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano, ContractProvider } from '@ton/core';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

import { PingPong } from '../wrappers/PingPong';

describe('[PingPong]', () => {
  let code: Cell;
  let blockchain: Blockchain;
  let deployer: SandboxContract<TreasuryContract>;
  let pingPongContract: SandboxContract<PingPong>;
  let user1: null | SandboxContract<TreasuryContract> = null;
  let provider: null | ContractProvider = null;

  beforeAll(async () => {
    code = await compile('PingPong');
    blockchain = await Blockchain.create();
    user1 = await blockchain.treasury('user1');
    pingPongContract = blockchain.openContract(
      PingPong.createFromConfig({}, code)
    );
    provider = blockchain.provider(pingPongContract.address);
    deployer = await blockchain.treasury('deployer');
    (provider as any).blockchain.openContract(
      PingPong.createFromConfig({}, code)
    );
  });

  it('[PingPong] deploys', async () => {
    const deployResult = await pingPongContract.sendDeploy(
      deployer.getSender(),
      toNano('0.05')
    );
    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: pingPongContract.address,
      deploy: true,
      success: true,
    });
  });

  it('[PingPong] toggle', async () => {
    const str = await pingPongContract.getStr();
    const strOk = (str as any).toString().replace('x{', '').replace('}', '');
    const decoded = Buffer.from(strOk, 'hex').toString('utf8');
    expect(decoded).toBe('ping');

    await pingPongContract.sendToggle(
      (user1 as SandboxContract<TreasuryContract>).getSender(),
      {
        value: toNano('0.05'),
      }
    );
    const str2 = await pingPongContract.getStr();
    const str2Ok = (str2 as any).toString().replace('x{', '').replace('}', '');
    const decoded2 = Buffer.from(str2Ok, 'hex').toString('utf8');
    expect(decoded2).toBe('pong');

    await pingPongContract.sendToggle(
      (user1 as SandboxContract<TreasuryContract>).getSender(),
      {
        value: toNano('0.05'),
      }
    );
    const str3 = await pingPongContract.getStr();
    const str3Ok = (str3 as any).toString().replace('x{', '').replace('}', '');
    const decoded3 = Buffer.from(str3Ok, 'hex').toString('utf8');
    expect(decoded3).toBe('ping');
  });
});
