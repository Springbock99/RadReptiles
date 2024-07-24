  // Define the props for your component
  export interface TokenBalanceTableProps {
    tokenBalances: TokenBalance[];
  }
  
  // Define the structure of each token balance object
  export interface TokenBalance {
    id?: React.Key;
    tokenId: string | number;
    balance: string | number;
  }
  

  export interface InputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTrade: (tokenId: string) => void;
  }
  

  export interface InputModalTrade {
    isOpen: boolean;
    onClose: () => void;
    onTrade: (tokenIdRequest: string, tokenIdOffering: string) => void;
  }

  export interface NFTCardProps {
    imageSrc: string;
    tokenId: number | string;
    balance: number | string;
    openseaUrl?: string;
  }