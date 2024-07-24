import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useCallback, useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import MultitokenAbi from "../../abis/MultiTokenAbi";
import ForgingAbi from "../../abis/ForgingAbi";
import Link from "next/link";
import React from "react";
import { TokenBalance, TokenBalanceTableProps } from "@/interfaces";
import TradeModal from "./TradeModal";
import MintModal from "./MintModal";
import NFTCard from "./NftCard";

export default function Home() {
  const [isNetworkSwitchHighlighted, setIsNetworkSwitchHighlighted] =
    useState(false);
  const [isConnectHighlighted, setIsConnectHighlighted] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showMintModal, setShowMintModal] = useState(false);
  const [allBalances, setAllBalances] = useState<TokenBalance[]>([]);
  const [showRules, setShowRules] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerText, setBannerText] = useState("Your dynamic banner text here");
  const [mintTransactionId, setMintTransactionId] = useState("");
  const [tradeTransactionId, setTradeTransactionId] = useState("");
  const [forgeTransactionId, setForgeTransactionId] = useState("");

  const [showSpy, setShowSpy] = useState(true);
  const [forgedTokenId, setForgedTokenId] = useState(0);
  const [recentAction, setRecentAction] = useState(""); // Add this state variable
  const [isError, setIsError] = useState(false);


  const forgingAddress = process.env
    .NEXT_PUBLIC_FORGING_ADDRESS as `0x${string}`;
  const erc1155Address = process.env
    .NEXT_PUBLIC_ERC1155_ADDRESS as `0x${string}`;

  const closeAll = () => {
    setIsNetworkSwitchHighlighted(false);
    setIsConnectHighlighted(false);
  };

  const { address } = useAccount();
  const { chain } = useNetwork();


  function getEtherscanUrl(chainId: number, txHash: any) {
    if (chainId === undefined) {
      return ""; // or set a default value
    }

    const baseUrl: any = {
      1: "https://etherscan.io/tx/", // Ethereum Mainnet
      3: "https://ropsten.etherscan.io/tx/", // Ropsten Testnet
      4: "https://rinkeby.etherscan.io/tx/", // Rinkeby Testnet
      5: "https://goerli.etherscan.io/tx/", // Goerli Testnet
      42: "https://kovan.etherscan.io/tx/", // Kovan Testnet
      56: "https://bscscan.com/tx/", // Binance Smart Chain Mainnet
      97: "https://testnet.bscscan.com/tx/", // Binance Smart Chain Testnet
      137: "https://polygonscan.com/tx/", // Polygon Mainnet
      80001: "https://mumbai.polygonscan.com/tx/", // Mumbai Testnet (Polygon)
    };

    return baseUrl[chainId as number]
      ? `${baseUrl[chainId as number]}${txHash}`
      : "";
  }

  function getOpenSeaUrl(chainId: number) {
    const baseUrls: Record<number, string> = {
      1: "https://opensea.io/assets/ethereum/",  // Ethereum Mainnet
      137: "https://opensea.io/assets/matic/",   // Polygon Mainnet
      // Add other networks if OpenSea supports them in the future
    };

    const baseUrl = baseUrls[chainId];
    return baseUrl ? `${baseUrl}${erc1155Address}/${forgedTokenId}` : '';
  }
  const erc1155Abi = MultitokenAbi;

  const addressInput = [
    address,
    address,
    address,
    address,
    address,
    address,
    address,
  ];
  const ids = [0, 1, 2, 3, 4, 5, 6];

  const { data: balanceData, refetch } = useContractRead({
    address: erc1155Address,
    abi: erc1155Abi,
    functionName: "balanceOfBatch",
    args: [addressInput, ids],
    enabled: false
  });

  const { data: forgeData, write: writeForge } = useContractWrite({
    address: forgingAddress,
    abi: ForgingAbi,
    functionName: "forgeToken",
  });

  const { data: mint, write: writeMint } = useContractWrite({
    address: forgingAddress,
    abi: ForgingAbi,
    functionName: "mintTokens",
  });

  const { data: tradeData, write: trade } = useContractWrite({
    address: forgingAddress,
    abi: ForgingAbi,
    functionName: "trade",
  });

  const getAllBalance = useCallback(async () => {
    await refetch();

    // Assert balanceData to be of the expected type
    const balances = balanceData as number[];
    if (balances && balances.length > 0) {
      const input = balances.map((balance: number, i: number) => ({
        tokenId: i,
        balance: balance.toString(),
      }));
      setAllBalances(input);
      handleBalanceChange();
    }
  }, [balanceData, refetch]);

  const handleBalanceChange = () => {
    // Dispatch a custom event with the new balance
    const event = new CustomEvent('balanceUpdated', { detail: "new balances" });
    window.dispatchEvent(event);
  };


  const { isLoading: isForging, isSuccess: txConfirmedForge } =
    useWaitForTransaction({
      hash: forgeData?.hash,
    });

  const { isLoading: isTrading, isSuccess: txConfirmedTrade } =
    useWaitForTransaction({
      hash: tradeData?.hash,
    });

  const { isLoading: isMinting, isSuccess: txConfirmedMint } =
    useWaitForTransaction({
      hash: mint?.hash,
    });

  const handleMouseOver = () => {
    setShowRules(true); // When mouse is over, show the rules
  };

  const getCurrentTransactionId = () => {
    switch (recentAction) {
      case "mint":
        return mintTransactionId;
      case "trade":
        return tradeTransactionId;
      case "forge":
        return forgeTransactionId;
      default:
        return "";
    }
  };

  // Function to determine the dynamic text based on recent action
  const getSpyBlockText = () => {
    switch (recentAction) {
      case 'mint':
        return 'Token yet to be minted';
      case 'trade':
        return 'Token yet to be traded';
      case 'forge':
        return 'Token yet to be forged';
      default:
        return 'Token yet to be forged, minted, or traded';
    }
  };


  // Use this function to get the current transaction ID for display
  const currentTransactionId = getCurrentTransactionId();

  // Update state when data changes
  useEffect(() => {
    if (balanceData) {
      getAllBalance();
    }
  }, [balanceData, getAllBalance]);

  // Update state when data changes
  useEffect(() => {
    if (txConfirmedForge && recentAction === 'forge') {
      setForgeTransactionId(forgeData?.hash as string);
      setBannerText(`Tx Id: ${forgeData?.hash}`);
      setShowBanner(true);
      setForgedTokenId(forgedTokenId);
      setShowSpy(false);

      // Set a timer to hide the banner after 5 seconds
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 8000);

      getAllBalance();

      return () => clearTimeout(timer);
    }
  }, [txConfirmedForge, forgeData, recentAction, getAllBalance]);

  useEffect(() => {
    if (txConfirmedTrade && recentAction === 'trade') {
      setTradeTransactionId(tradeData?.hash as string);
      setBannerText(`Tx Id: ${tradeData?.hash}`);
      setShowBanner(true);

      // Set a timer to hide the banner after 8 seconds
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 8000);

      getAllBalance();

      return () => clearTimeout(timer);
    }
  }, [txConfirmedTrade, tradeData, recentAction, getAllBalance]);

  useEffect(() => {

    if (txConfirmedMint && recentAction === 'mint') {
      setMintTransactionId(mint?.hash as string);
      setBannerText(`Tx Id: ${mint?.hash}`);
      setShowBanner(true);
      setShowSpy(false);

      // Set a timer to hide the banner after 5 seconds
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 5000);

      getAllBalance();

      return () => clearTimeout(timer); // Cleanup the timeout on component unmount
    }
  }, [txConfirmedMint, mint, recentAction, getAllBalance]);

  const handleForge = async (tokenIdRequest: number) => {
    try {
      // Call the contract function and wait for the result
      const result = writeForge({
        args: [tokenIdRequest],
      });

      setShowSpy(true);
      setIsError(false); // Reset error state on successful execution
      setForgeTransactionId(""); // Reset transaction ID
      setRecentAction("forge"); // Update recent action
      setForgedTokenId(tokenIdRequest);
      setShowBanner(true);
      setBannerText("waiting for transaction confirmation");

      // Check if the contract call was successful
      //@ts-ignore
      if (result.success) {
        setIsError(false); // Reset error state on successful execution
        setForgeTransactionId(""); // Reset transaction ID
        setRecentAction("forge"); // Update recent action
        setForgedTokenId(tokenIdRequest);
        setShowBanner(true);
        setBannerText("waiting for transaction confirmation");
      }
    } catch (error) {
      // Handle other errors (e.g., network errors) here
      // setIsError(true); // Set error state on failure
      // setBannerText(`Error: Insufficient tokens to forge ${tokenIdRequest}, please check requirements.`);
      // setShowBanner(true);
    }
  };

  const handleTrade = (
    tokenIdRequest: string | number,
    tokenIdOffering: string | number
  ) => {
    trade({
      args: [tokenIdRequest, tokenIdOffering],
    });
    setTradeTransactionId(""); // Reset trade transaction ID
    setRecentAction("trade"); // Update recent action
    setShowSpy(true);
    setShowBanner(true);
    setBannerText("waiting for transaction confirmation");
  };

  const handleMint = (tokenId: any) => {
    writeMint({ args: [tokenId] });
    setIsError(false)
    setMintTransactionId(""); // Reset mint transaction ID
    setRecentAction("mint"); // Update recent action
    setShowSpy(true);
    setShowBanner(true);
    setBannerText("waiting for transaction confirmation");
    setForgedTokenId(tokenId);
  };

  const Spinner = () => {
    return <div className={styles.spinner}></div>;
  };

  const TokenBalanceTable: React.FC<TokenBalanceTableProps> = ({
    tokenBalances,
  }) => {
    return (
      <div className={styles.tokenTableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Token ID</th>
              <th className={styles.th}>Balance</th>
            </tr>
          </thead>
          <tbody>
            {tokenBalances.map((token) => (
              // Ensure key is unique for each row. Assuming tokenId is unique.
              <tr key={token.tokenId}>
                <td className={styles.td}>{token.tokenId}</td>
                <td className={styles.td}>{token.balance} Tokens</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };


  // Wagmi hooks for wallet connection
  return (
    <>
      <Head>
        <title>WalletConnect</title>
        <meta name="description" content="Generated by create-wc-dapp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <div
          className={styles.backdrop}
          style={{
            opacity: isConnectHighlighted || isNetworkSwitchHighlighted ? 1 : 0,
          }}
        />
        <div className={styles.header}>
          <div className={`${styles.logo} ${styles.DBLogo}`}>
            <Image
              src="/DB.png"
              alt="WalletConnect Logo"
              height="150"
              width="150"
            />
          </div>
          <Link className={styles.linkStyle} href="/">
            <button className={styles.glowOnHover}>All Tokens</button>
          </Link>

          <Link className={styles.linkStyle} href="/forging">
            <button className={styles.glowOnHover}> Forging </button>
          </Link>

          <div className={styles.buttons}>
            <div
              onClick={closeAll}
              className={`${styles.highlight} ${isNetworkSwitchHighlighted ? styles.highlightSelected : ``
                }`}
            >
              <w3m-network-button />
            </div>
            <div
              onClick={closeAll}
              className={`${styles.highlight} ${isConnectHighlighted ? styles.highlightSelected : ``
                }`}
            >
              <w3m-button />
            </div>
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <div onMouseOver={handleMouseOver}>
          {showRules ? (
            <div>
              <div className={`${styles.rulesContainer} ${styles.fadeIn}`}>
                <h2 className={styles.rulesTitle}>Forging Rules</h2>
                <ul className={styles.rulesList}>
                  <li>
                    Anyone can mint tokens [0-2], but there is a 1-minute
                    cooldown between mints. These are free to mint except for
                    the gas cost.
                  </li>
                  <li>Token 3 can be minted by burning token 0 and 1.</li>
                  <li>Token 4 can be minted by burning token 1 and 2.</li>
                  <li>Token 5 can be minted by burning 0 and 2.</li>
                  <li>Token 6 can be minted by burning 0, 1, and 2.</li>
                  <li>Tokens [3-6] cannot be forged into other tokens.</li>
                  <li>Tokens [3-6] can be burned but you get nothing back.</li>
                  <li>
                    You can trade any token for [0-2] by hitting the trade
                    button.
                  </li>
                </ul>

                {showBanner && (
                  <div
                    className={`${styles.banner} ${!showBanner ? "hide" : ""}`}>
                    {(isMinting || isForging || isTrading) && <Spinner />}{" "}
                    {/* Show spinner when transaction is in progress */}
                    {currentTransactionId ? (
                      <a
                        href={getEtherscanUrl(chain!.id, currentTransactionId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.bannerText}
                      >
                        {bannerText}
                      </a>
                    ) : (
                      <span className={`${styles.bannerText} ${isError ? styles.errorMessage : ''}`}>{bannerText}</span>
                    )}
                  </div>
                )}
              </div>

              <div>
                {showSpy ? (
                  <NFTCard
                    key={"index"}
                    imageSrc="/spy.jpg"
                    tokenId={getSpyBlockText()} // Use the dynamic text here
                    balance="0"
                  // openseaUrl={getOpenSeaUrl(chain?.id)}
                  />
                ) : (
                  <NFTCard
                    key={"index"}
                    imageSrc={`/${forgedTokenId}.png`}
                    tokenId={forgedTokenId}
                    balance={allBalances[forgedTokenId].balance}
                  // openseaUrl={getOpenSeaUrl(chain?.id)}

                  />
                )}

                <div className={`${styles.fadeIn} ${styles.tokenBalance}`}>
                  <TokenBalanceTable tokenBalances={allBalances} />
                </div>
              </div>
              <div className={`${styles.forgingSection} ${styles.fadeIn}`}>
                <div className={styles.forgingLogo}>
                  <Image
                    src="/forging3.png"
                    alt="forging Logo"
                    height="200"
                    width="200"
                    style={{ margin: "10%" }}
                  />

                  <a
                    href="#"
                    className={styles.animatedButton2}
                    onClick={() => handleForge(3)}
                  >
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Forge Token 3
                  </a>

                  <a
                    href="#"
                    className={styles.animatedButton2}
                    onClick={() => handleForge(4)}
                  >
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Forge Token 4
                  </a>

                  <a
                    href="#"
                    className={styles.animatedButton2}
                    onClick={() => handleForge(5)}
                  >
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Forge Token 5
                  </a>

                  <a
                    href="#"
                    className={styles.animatedButton2}
                    onClick={() => handleForge(6)}
                  >
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Forge Token 6
                  </a>
                  <a
                    href="#"
                    className={styles.animatedButton5}
                    onClick={() => setShowTradeModal(true)}
                  >
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Trade Tokens
                  </a>

                  <a
                    href="#"
                    className={styles.animatedButton5}
                    onClick={() => setShowMintModal(true)}
                  >
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Mint Token 1-3
                  </a>
                </div>
              </div>

              <TradeModal
                isOpen={showTradeModal}
                onClose={() => setShowTradeModal(false)}
                onTrade={handleTrade}
              />

              <MintModal
                isOpen={showMintModal}
                onClose={() => setShowMintModal(false)}
                onTrade={handleMint}
              />
            </div>
          ) : (
            <div
              className={`${styles.flickeringText} ${showRules ? styles.fadeOut : ""
                }`}
            >
              Welcome to Forging ERC-1155 Tokens
            </div>
          )}
        </div>
      </main>
    </>
  );
}
