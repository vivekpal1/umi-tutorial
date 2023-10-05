import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { Keypair, Transaction, SystemProgram } from "@solana/web3.js";

const umi = createUmi('https://api.devnet.solana.com');

const senderAccount = Keypair.generate();
const receiverAccount = Keypair.generate();

console.log("Sender Account Public Key:", senderAccount.publicKey.toString());
console.log("Receiver Account Public Key:", receiverAccount.publicKey.toString());

async function transferTokens(amount) {
    const { blockhash } = await umi.rpc.getLatestBlockhash();

    const transaction = new Transaction({ recentBlockhash: blockhash }).add(
        SystemProgram.transfer({
            fromPubkey: senderAccount.publicKey,
            toPubkey: receiverAccount.publicKey,
            lamports: amount,
        })
    );

    transaction.sign(senderAccount);
    const txid = await umi.rpc.sendTransaction(transaction);
    console.log("Transaction ID:", txid);
}

transferTokens(1000);  // 1000 lamports or 0.000001 SOL

async function showBalances() {
    const senderBalance = await umi.rpc.getBalance(senderAccount.publicKey);
    const receiverBalance = await umi.rpc.getBalance(receiverAccount.publicKey);

    console.log(`Sender Balance: ${senderBalance} lamports`);
    console.log(`Receiver Balance: ${receiverBalance} lamports`);
}

showBalances();
