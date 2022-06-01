import * as splToken from '@solana/spl-token';
import * as web3 from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';

const rpcHost = process.env.NEXT_PUBLIC_RPC_HOST_URL!;
console.log(rpcHost, 'rpcHost');

const connection = new anchor.web3.Connection(rpcHost, {
  commitment: 'confirmed',
});

//TRANSFER_ADDRESS

export async function buyRaffle(
  wallet: WalletContextState,
  id: string,
  amount: number,
  price: number
) {
  if (!wallet.publicKey) {
    throw new Error('wallet not connected');
  }
  if (amount === 0) throw new Error('Need to specify higher ticket amount');

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/alive/${id}`
  );
  const jsonResponse = await response.json();

  if (jsonResponse.alive === true) {
    const mint = new web3.PublicKey(
      process.env.NEXT_PUBLIC_SPL_TOKEN
    );

    const mintTokenAccount = await splToken.Token.getAssociatedTokenAddress(
      splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
      splToken.TOKEN_PROGRAM_ID,
      mint,
      wallet.publicKey
    );
    const toMintTokenAccount = await splToken.Token.getAssociatedTokenAddress(
      splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
      splToken.TOKEN_PROGRAM_ID,
      mint,
      new web3.PublicKey(process.env.NEXT_PUBLIC_SPL_TRANSFER_ADDRESS)
    )


    const transferItx = new web3.Transaction().add(
      splToken.Token.createTransferInstruction(
        splToken.TOKEN_PROGRAM_ID,
        mintTokenAccount,
        toMintTokenAccount,
        wallet.publicKey,
        [],
        amount * price * parseInt(process.env.NEXT_PUBLIC_SPL_DECIMALS)
      )
    );
    const blockHash = await connection.getRecentBlockhash();
    transferItx.feePayer = wallet.publicKey;
    transferItx.recentBlockhash = await blockHash.blockhash;
    if (!wallet.signTransaction) {
      return;
    }
    const signed = await wallet.signTransaction(transferItx);
    const signature = await connection.sendRawTransaction(signed.serialize());
    const resp1 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raffleId: id,
        txHash: signature,
      }),
    });
    if (resp1.status !== 200) {
      throw new Error('error on raffle server');
    }
    const json1 = await resp1.json();

    return json1;
  } else {
    throw new Error('couldnt connect to raffle server');
  }
}
