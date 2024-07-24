import React from "react";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { NFTCardProps } from "@/interfaces";

const NFTCard: React.FC<NFTCardProps> = ({ imageSrc, tokenId, balance, openseaUrl }) => {
  return (
    <div className={`${styles.wrapper} ${styles.spy} ${styles.fadeIn}`}>
      <div className={styles.container}>
        <h1>ERC-1155 Token</h1>
        <div className={styles.content}>
          <ul>
            <Image
              src={imageSrc}
              alt={`NFT ${tokenId}`}
              className={styles.nftImage}
              height="200"
              width="250"
            />

            <div className={styles.nftTokenId}>
              Token ID: {tokenId ?? "Yet to be Forged"}
            </div>
            <div className={styles.nftTokenId}>
              Balance: {balance != null ? `${balance} Tokens` : "No Tokens yet"}
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
        </svg> */}
        {/* <a href={openseaUrl} target="_blank" rel="noopener noreferrer">
          Check out on opensea
        </a> */}
      </div>
    </div>
  );
};

export default NFTCard;
