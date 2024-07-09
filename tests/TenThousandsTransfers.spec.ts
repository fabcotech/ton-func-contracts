import '@ton/core';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import '@ton/test-utils';

describe('[Ten thousands transfers]', () => {
  let blockchain: Blockchain;
  let user1: null | SandboxContract<TreasuryContract> = null;
  let user2: null | SandboxContract<TreasuryContract> = null;
  const transfers: {
    sender: SandboxContract<TreasuryContract>;
    receiver: SandboxContract<TreasuryContract>;
    value: bigint;
  }[] = [];

  beforeAll(async () => {
    blockchain = await Blockchain.create();
    user1 = await blockchain.treasury('user1');
    user2 = await blockchain.treasury('user2');
    for (let i = 0; i < 10000; i += 1) {
      if (Math.random() > 0.5) {
        transfers.push({
          sender: user1 as unknown as SandboxContract<TreasuryContract>,
          receiver: user2 as unknown as SandboxContract<TreasuryContract>,
          value: BigInt(Math.round(Math.random() * 100)),
        });
      } else {
        transfers.push({
          sender: user2 as unknown as SandboxContract<TreasuryContract>,
          receiver: user1 as unknown as SandboxContract<TreasuryContract>,
          value: BigInt(Math.round(Math.random() * 100)),
        });
      }
    }
  });

  it('[Ten thousands transfers] user1 and user2 transfer money 10.000 times', async () => {
    let i = 1;
    for (const transfer of transfers) {
      const balanceReceiverBefore = await transfer.receiver.getBalance();
      await transfer.sender.send({
        value: transfer.value,
        to: transfer.receiver.address,
      });
      const expectedBalance = balanceReceiverBefore + transfer.value;
      /*
        balance is not always exact, there may be a +1 or
        -1 rounding/else error
      */
      const expectedBalances = [expectedBalance - 1n, expectedBalance, expectedBalance + 1n];
      const balanceReceiverAfter = await transfer.receiver.getBalance();
      expect(expectedBalances.includes(balanceReceiverAfter)).toBe(true);
      i += 1;
      if (process.argv.includes('--logs') && (i === 100 || i === 1000 || i % 1000 === 0)) {
        console.log(
          `[Ten thousands transfers] ok transfer no${i} ${transfer.sender.address} -> ${transfer.receiver.address} (${transfer.value})`,
        );
      }
    }
  });
});
