import { Account, NetworkType } from 'nem2-sdk';
import { Apostille, Initiator } from '../../../index';

const seed = 'KV_,x797taRe}Y<+';
// A funny but valid private key
const sk = 'aaaaaaaaaaeeeeeeeeeebbbbbbbbbb5555555555dddddddddd1111111111aaee';

const generator = Account.createFromPrivateKey(sk, NetworkType.MIJIN_TEST);
const signer = Account.createFromPrivateKey(sk, NetworkType.MIJIN_TEST);
// creation payload
const payload = 'Apostille is awesome !';

const hdAccountInformation = {
  address: 'SDTE6Z-XQAQ46-FDJ5P7-MSU43E-BNT4SR-7C7EKU-HHL5',
  privateKey: 'B9EF817A39DAEB43179EE9129E5D592410B8A47FA4870A4EC16024575E51A608'.toUpperCase(),
  publicKey: '9C0C770BD1E1506FD207A8D783E0E4AC00D98B6D790401573519D82133474B90'.toUpperCase(),
};

const PrivateApostille1 = new Apostille(seed, generator);
const PrivateApostille2 = new Apostille(seed, generator);

describe('Getters should work properly', () => {
  it('should correctly generate a private apostille via a private key', () => {
    expect(PrivateApostille1.privateKey).toMatch(hdAccountInformation.privateKey);
    expect(PrivateApostille1.publicKey).toMatch(hdAccountInformation.publicKey);
    expect(PrivateApostille1.address.pretty()).toMatch(hdAccountInformation.address);
  });

  it('should return the genrator public account', () => {
    expect(PrivateApostille1.generator)
    .toMatchObject(signer.publicAccount);
  });

  it('creator sould be undefined', () => {
    expect(PrivateApostille1.creator).toBeUndefined();
  });

  it('creator sould be a valid account', async () => {
    const creator = new Initiator(signer, NetworkType.MIJIN_TEST);
    await PrivateApostille1.create(creator, payload);
    expect(PrivateApostille1.creator).toMatchObject(creator.account);
  });

  it('multisig creator sould be a valid public account', async () => {
    const dumpMultisigCreator = new Initiator(signer, NetworkType.MIJIN_TEST, signer.publicAccount, true);
    await PrivateApostille2.create(dumpMultisigCreator, payload);
    expect(PrivateApostille2.creator).toMatchObject(dumpMultisigCreator.multisigAccount);
    expect(PrivateApostille2.creator.publicKey).toMatch(dumpMultisigCreator.multisigAccount.publicKey);
  });
});

// TODO: a getter function for getting all the owners of the apostille
