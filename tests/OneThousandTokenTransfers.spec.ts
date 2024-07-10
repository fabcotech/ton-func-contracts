import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano, Address } from '@ton/core';
import { JettonWallet } from '../wrappers/JettonWallet';
import { JettonMinter, jettonContentToCell } from '../wrappers/JettonMinter';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('[One thousand token transfers]', () => {
  let jwallet_code = new Cell();
  let minter_code = new Cell();
  let blockchain: Blockchain;
  let user1: SandboxContract<TreasuryContract>;
  let user2: SandboxContract<TreasuryContract>;
  let user3: SandboxContract<TreasuryContract>;
  let jettonMinter: SandboxContract<JettonMinter>;
  let userWallet: any;
  let defaultContent: Cell;
  const transfers: {
    sender: SandboxContract<TreasuryContract>;
    receiver: SandboxContract<TreasuryContract>;
    value: bigint;
  }[] = [];

  beforeAll(async () => {
    jwallet_code = await compile('JettonWallet');
    minter_code = await compile('JettonMinter');
    blockchain = await Blockchain.create();
    user1 = await blockchain.treasury('user1');
    user2 = await blockchain.treasury('user2');
    user3 = await blockchain.treasury('user3');
    defaultContent = jettonContentToCell({ type: 1, uri: 'https://testjetton.org/content.json' });
    jettonMinter = blockchain.openContract(
      JettonMinter.createFromConfig(
        {
          admin: user1.address,
          content: defaultContent,
          wallet_code: jwallet_code,
        },
        minter_code,
      ),
    );
    userWallet = async (address: Address) =>
      blockchain.openContract(JettonWallet.createFromAddress(await jettonMinter.getWalletAddress(address)));

    for (let i = 0; i < 1000; i += 1) {
      if (Math.random() < 0.33) {
        transfers.push({
          sender: user1 as unknown as SandboxContract<TreasuryContract>,
          receiver: user2 as unknown as SandboxContract<TreasuryContract>,
          value: BigInt(Math.round(Math.random() * 100)),
        });
      } else if (Math.random() < 0.66) {
        transfers.push({
          sender: user2 as unknown as SandboxContract<TreasuryContract>,
          receiver: user3 as unknown as SandboxContract<TreasuryContract>,
          value: BigInt(Math.round(Math.random() * 100)),
        });
      } else {
        transfers.push({
          sender: user3 as unknown as SandboxContract<TreasuryContract>,
          receiver: user1 as unknown as SandboxContract<TreasuryContract>,
          value: BigInt(Math.round(Math.random() * 100)),
        });
      }
    }
  });

  // implementation detail
  it('[One thousand token transfers] deploys', async () => {
    const deployResult = await jettonMinter.sendDeploy(user1.getSender(), toNano('100'));

    expect(deployResult.transactions).toHaveTransaction({
      from: user1.address,
      to: jettonMinter.address,
      deploy: true,
    });
  });

  it('[One thousand token transfers] mints initial 100B supply', async () => {
    const initialTotalSupply = await jettonMinter.getTotalSupply();
    expect(initialTotalSupply).toBe(BigInt('0'));
    await jettonMinter.sendMint(
      user1.getSender(),
      user1.address,
      BigInt('100000000000'),
      toNano('0.05'),
      toNano('1'),
    );
    expect(await jettonMinter.getTotalSupply()).toBe(BigInt('100000000000'));
  });

  it('[One thousand token transfers] user1 (deployer+minter) sends a portion to user2 and user3', async () => {
    const user1JettonWallet = await userWallet(user1.address);
    const user2JettonWallet = await userWallet(user2.address);
    const user3JettonWallet = await userWallet(user3.address);
    await user1JettonWallet.sendTransfer(
      user1.getSender(),
      toNano('0.1'),
      BigInt('33000000000'),
      user2.address,
      user1.address,
      null,
      toNano('0.05'),
      null,
    );
    await user1JettonWallet.sendTransfer(
      user1.getSender(),
      toNano('0.1'),
      BigInt('33000000000'),
      user3.address,
      user1.address,
      null,
      toNano('0.05'),
      null,
    );
    expect(await user2JettonWallet.getJettonBalance()).toEqual(BigInt('33000000000'));
    expect(await user3JettonWallet.getJettonBalance()).toEqual(BigInt('33000000000'));
  });

  it('[One thousand token transfers] do the 1.000 transfers', async () => {
    let i = 1;
    for (const transfer of transfers) {
      const senderJettonWallet = await userWallet(transfer.sender.address);
      const receiverJettonWallet = await userWallet(transfer.receiver.address);

      const balanceReceiverBefore = await receiverJettonWallet.getJettonBalance();

      await senderJettonWallet.sendTransfer(
        transfer.sender.getSender(),
        toNano('0.1'),
        transfer.value,
        transfer.receiver.address,
        transfer.sender.address,
        null,
        toNano('0.05'),
        null,
      );
      expect(await await receiverJettonWallet.getJettonBalance()).toBe(balanceReceiverBefore + transfer.value);
      i += 1;
      if (i % 100 === 0 && process.argv.includes('--logs')) {
        console.log(
          `[One thousand token transfers] ok transfer no${i} ${transfer.sender.address} -> ${transfer.receiver.address} (${transfer.value})`,
        );
      }
    }
  });
});
