import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import MultitokenAbi from "../../abis/MultiTokenAbi";
import Link from "next/link";
import React from "react";
import { TokenBalance } from "@/interfaces";

export default function Home() {
  const [isNetworkSwitchHighlighted, setIsNetworkSwitchHighlighted] =
    useState(false);
  const [isConnectHighlighted, setIsConnectHighlighted] = useState(false);
  const [showDopeBears, setShowDopeBears] = useState(false);
  const [allBalances, setAllBalances] = useState<TokenBalance[]>([]);
  const { address } = useAccount();
  const { chain } = useNetwork(); // This gives the current network chain information
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  // const [hasNetworkBalance, setNetworkBalance] = useState(false);

  const erc1155Address = process.env
    .NEXT_PUBLIC_ERC1155_ADDRESS as `0x${string}`;

  const closeAll = () => {
    setIsNetworkSwitchHighlighted(false);
    setIsConnectHighlighted(false);
  };

  const handleMouseOverDopeBears = () => {
    // getAllBalance();
    setShowDopeBears(true);
  };

  const itemsPerPage = 9; // Adjust based on how many items you want per pag
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
    enabled: false, // Disable automatic fetching
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
      setShowDopeBears(true);
      // setNetworkBalance(true);
    } else {
      setShowDopeBears(false);
      // setNetworkBalance(false);
    }
  }, [balanceData, refetch]);

  useEffect(() => {
    console.log("Setting up event listener for balance updates in index page");

    const handleBalanceUpdate = () => {
      console.log("index handle balance");
      getAllBalance();
    };

    window.addEventListener("balanceUpdated", handleBalanceUpdate);

    return () => {
      window.removeEventListener("balanceUpdated", handleBalanceUpdate);
      console.log("Cleaning up event listener from index page");
    };
  }, []);

  useEffect(() => {
    if (!address) {
      setShowDopeBears(false);
      setAllBalances([]);
      // Any other state updates you need to perform on disconnect
    }
  }, [address]);

  useEffect(() => {
    if (balanceData) {
      setPageCount(Math.ceil(allBalances.length / itemsPerPage));

      setLoaded(true);
    }
  }, [balanceData, itemsPerPage, getAllBalance]);

  // useEffect for network change
  useEffect(() => {
    if (address) {
      getAllBalance();
    }
  }, [chain, address, getAllBalance]); // Dependency on the network chain

  const currentItems: any[] = [];
  for (let i = 0; i < 9; i++) {
    currentItems.push({
      tokenId: i,
      balance: "0",
    });
  }
  // const currentItems = balances.map((balance: number, i: number) => ({
  //   tokenId: i,
  //   balance: balance.toString(),
  // }));

  console.log("currentItems", currentItems);
  // setNetworkBalance(true); // get real balances from contract

  return (
    <>
      <Head>
        <title>WalletConnect | Next Starter Template</title>
        <meta name="description" content="Generated by create-wc-dapp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={styles.backdrop}
        style={{
          opacity: isConnectHighlighted || isNetworkSwitchHighlighted ? 1 : 0,
        }}
      />
      <header className={styles.header}>
        <div className={`${styles.logo} ${styles.DBLogo}`}>
          <Image
            src="/RR.png"
            alt="WalletConnect Logo"
            height="150"
            width="150"
          />
        </div>
        <Link className={styles.linkStyle} href="/">
          <button className={styles.glowOnHover}>See Tokens</button>
        </Link>

        <Link className={styles.linkStyle} href="/forging">
          <button className={styles.glowOnHover}>Forging</button>
        </Link>

        <div className={styles.buttons}>
          <div
            onClick={closeAll}
            className={`${styles.highlight} ${
              isNetworkSwitchHighlighted ? styles.highlightSelected : ``
            }`}
          >
            <w3m-network-button />
          </div>
          <div
            onClick={closeAll}
            className={`${styles.highlight} ${
              isConnectHighlighted ? styles.highlightSelected : ``
            }`}
          >
            <w3m-button />
          </div>
        </div>
      </header>
      <main className={styles.main}>
        {/* {showDopeBears && hasNetworkBalance ? ( */}
        {showDopeBears ? (
          <div className={styles.nftGrid}>
            {currentItems.map((item, index) => (
              <div
                key={index}
                className={`${styles.wrapper} ${loaded ? styles.fadeIn : ""}`}
              >
                <div className={styles.container}>
                  <h1>ERC-1155 Token</h1>
                  <div className={styles.content}>
                    <ul>
                      <Image
                        src={`/${index}.jpeg`}
                        alt={`NFT ${item.tokenId}`}
                        className={styles.nftImage}
                        height="250"
                        width="350"
                      />
                      <div className={styles.nftTokenId}>
                        Token ID: {item.tokenId}
                      </div>
                      <div className={styles.nftTokenId}>
                        Balance: {item.balance} Tokens
                      </div>
                    </ul>
                  </div>
                </div>
                <div className={styles.footer}>
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    height={16}
                    width={16}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                    />
                  </svg>
                  <a
                    href="https://opensea.io/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Check out on opensea
                  </a> */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            onMouseOver={handleMouseOverDopeBears}
            className={`${styles.flickeringText} ${styles.welcomeContainer} ${
              showDopeBears ? styles.fadeOut : ""
            }`}
          >
            <p>Welcome To Dope Bears Lets see your Tokens</p>

            {showDopeBears ? (
              <p>lets go.</p>
            ) : (
              <div className={styles.welcomeMessage}>
                <p>
                  Looks Like you do not have any Tokens on this Network, change
                  network or go ahead and forge some Tokens
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
