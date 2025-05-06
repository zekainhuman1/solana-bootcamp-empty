import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

type TokenAccount = {
  mint: string;
  amount: string;
};

const UserTokens: React.FC = () => {
  const { publicKey } = useWallet();
  const [tokens, setTokens] = useState<TokenAccount[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTokens = async () => {
      if (!publicKey) return;
      setLoading(true);

      try {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          {
            programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), // SPL Token або замінити на Token-2022 ID
          }
        );

        const parsedTokens: TokenAccount[] = tokenAccounts.value.map((acc) => ({
          mint: acc.account.data.parsed.info.mint,
          amount: acc.account.data.parsed.info.tokenAmount.uiAmountString,
        }));

        setTokens(parsedTokens);
      } catch (err) {
        console.error("Failed to fetch tokens", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [publicKey]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">User Tokens</h2>
      {loading ? (
        <p>Loading...</p>
      ) : tokens.length === 0 ? (
        <p>No tokens found</p>
      ) : (
        <ul className="space-y-2">
          {tokens.map((token, idx) => (
            <li key={idx} className="border p-2 rounded">
              <p><strong>Mint:</strong> {token.mint}</p>
              <p><strong>Amount:</strong> {token.amount}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserTokens;
