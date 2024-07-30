import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import '@ton/test-utils';
import { Cell, toNano, ContractProvider } from '@ton/core';
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
    bankContract = blockchain.openContract(
      Bank.createFromConfig({ balance: 0 }, code)
    );
    for (let i = 0; i < 3; i += 1) {
      transfers.push({
        sender: user1 as unknown as SandboxContract<TreasuryContract>,
        coins: toNano(BigInt(Math.round(Math.random() * 100))),
      });
    }
  });

  it('[Bank] user1 transfers to smart contract', async () => {
    const deployResult = await bankContract.sendDeploy(
      (user1 as SandboxContract<TreasuryContract>).getSender(),
      toNano('0.05')
    );
    let i = 1;
    for (const transfer of transfers) {
      console.log('transfer.coins');
      console.log(transfer.coins);
      /* const balance = await bankContract.getBalance();
      console.log('balance', balance); */
      const bal = await bankContract.getBal();
      console.log('bal', bal);
      const a = await bankContract.sendTransfer(
        (user1 as SandboxContract<TreasuryContract>).getSender(),
        {
          value: toNano('0.05'),
          coins: transfer.coins,
        }
      );
      expect(true).toBe(true);
    }
  });
});
