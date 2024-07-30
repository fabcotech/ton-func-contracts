import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import '@ton/test-utils';
import { Cell, toNano } from '@ton/core';
import { compile } from '@ton/blueprint';

import { Bank } from '../wrappers/Bank';

describe('[Bank]', () => {
  let code: Cell;
  let blockchain: Blockchain;
  let user1: null | SandboxContract<TreasuryContract> = null;
  let bankContract: SandboxContract<Bank>;
  const transfers: {
    sender: SandboxContract<TreasuryContract>;
    coins: bigint;
  }[] = [];

  beforeAll(async () => {
    code = await compile('Bank');
    blockchain = await Blockchain.create();
    user1 = await blockchain.treasury('user1');
    bankContract = blockchain.openContract(Bank.createFromConfig(code));
    for (let i = 0; i < 10; i += 1) {
      transfers.push({
        sender: user1 as unknown as SandboxContract<TreasuryContract>,
        coins: BigInt(Math.round(Math.random() * 100)),
      });
    }
    /*
      smart contract balance goes
      above the 1B limit
    */
    transfers.push({
      sender: user1 as unknown as SandboxContract<TreasuryContract>,
      coins: BigInt('1000000000'),
    });
  });

  it('[Bank] user1 transfers to smart contract', async () => {
    await bankContract.sendDeploy(
      (user1 as SandboxContract<TreasuryContract>).getSender(),
      toNano('0.05')
    );
    let bi = 0n;
    for (const transfer of transfers) {
      bi += transfer.coins;
      await bankContract.sendTransfer(
        (user1 as SandboxContract<TreasuryContract>).getSender(),
        {
          value: toNano('0.05'),
          coins: transfer.coins,
        }
      );
      const bal = await bankContract.getBal();
      expect(bal).toBe(bi);
    }
  });
});