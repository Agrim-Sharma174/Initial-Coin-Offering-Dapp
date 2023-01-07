import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import Web3Modal, { providers } from "web3modal";
import { BigNumber, utils } from "ethers";

export default function Home() {
  const zero = BigNumber.from(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();
  const [tokensMinted, setTokensMinted] = useState(zero);
  const [balanceOfASCryptoDevTokens, setBalanceOfASCryptoDevTokens] =
    useState(zero);
  const [tokenAmount, setTokenAmount] = useState(zero);
  const [loading, setLoading] = useState(false);
  const [tokensToBeClaimed, settokensToBeClaimed] = useState(zero);


  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();

    if (chainId !== 5) {
      window.alert("Please connect to Goerli Testnet");
      throw new Error("Please connect to Goerli Testnet");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }

    return web3Provider;
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  const getTokensToBeClaimed = async() => {
    try {
      const provider = await getProviderOrSigner();
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        provider
      )
      const signer = await getProviderOrSigner(true);
      const address = await signer.getAddress();
      const balance = await nftContract.balanceOf(address);

      
      
    } catch (error) {
      console.error(err);
    }
  }

  const getBalanceOfASCryptoDevTokens = async() => {
    try {
      const provider = await getProviderOrSigner();
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      );
      
      const signer = getProviderOrSigner(true);
      const address = signer.getAddress();
      const balance = await tokenContract.balanceOf(address);
      setBalanceOfASCryptoDevTokens(balance);

    } catch (error) {
      console.error(err);
    }
  };

  const getTotalTokensMinted = async() => {
    try {
      const provider = await getProviderOrSigner();
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      )
      const _tokensMinted = await tokenContract.totalSupply();
      setTokensMinted(_tokensMinted);
    } catch (error) {
      console.error(err);
    }
  }


  const mintCryptoDevToken = async(amount) => {
    try {
      const signer = await getProviderOrSigner(true);
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      );

      const value = 0.001*amount;

      const tx = await tokenContract.mint(amount,{
        value: utils.parseEther(value.toString())
      })
      setLoading(true);
      await tx.wait();
      setLoading(false);
      window.alert("Successfully minted Agrim Crypto Dev Tokens")

      await getBalanceOfASCryptoDevTokens();
      await getTotalTokensMinted();
    } catch (error) {
      console.error(err);
    }
  };
  const renderButton = () => {
    if(loading) {
      return (
        <div>
          <button className={styles.button}>
            Loading...
          </button>
        </div>
      )
    }

    if(tokensToBeClaimed){

    }

    return (
      <div style={{ display: "flex-col" }}>
        <div>
          <input
            type="number"
            placeholder="Amount of Tokens"
            onChange={(e) => setTokenAmount(BigNumber.from(e.target.value))}
          />
          <button
            className={styles.button}
            disabled={!(tokenAmount > 0)}
            onClick={() => mintCryptoDevToken(tokenAmount)}
          >
            Mint Token
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, []);
  return (
    <div>
      <Head>
        <title>Agrim Crypto Devs ICO</title>
        <meta name="description" content="ICO-dApp" />
        <link rel="icon" href="./favicon.ico" />
      </Head>

      <div className="{styles.main}">
        <h1 className="{styles.title}"> Welcome to Agrim Crypto Devs ICO </h1>
        <div className="{styles.description">
          You can claim or mint Agrim Crypto Dev tokens here
        </div>
        {walletConnected ? (
          <div>
            <div className={styles.description}>
              You have minted {utils.formatEther(balanceOfASCryptoDevTokens)}{" "}
              Agrim Crypto Dev tokens
            </div>
            <div className={styles.description}>
              Overall {utils.formatEther(tokensMinted)}/10000 have been minted
            </div>
            {renderButton}
          </div>
        ) : (
          <button onClick={connectWallet} className={styles.button}>
            Connect your Wallet
          </button>
        )}
      </div>
    </div>
  );
}
