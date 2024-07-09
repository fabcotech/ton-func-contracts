import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
  targets: [
    'contracts/imports/stdlib.fc',
    'contracts/params.fc',
    'contracts/op-codes.fc',
    'contracts/discovery-params.fc',
    'contracts/jetton-utils.fc',
    'contracts/jetton-minter-discoverable.fc',
  ],
};
