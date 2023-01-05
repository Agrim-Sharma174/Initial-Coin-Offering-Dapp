import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import  Web3Modal, { providers } from "web3modal";
import { BigNumber, utils } from "ethers";

export default function Home() {

  const zero = BigNumber.from(0);
  const[walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();
  const {tokensMinted, setTokensMinted} = useState(zero);
  const {balanceOfASCryptoDevTokens, setBalanceOfASCryptoDevTokens} = useState(zero);

  const getProviderOrSigner = async(needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.web3Provider(provider);

    const {chainId} = await web3Provider.getNetwork();

    if(chainId !== 5){
      window.alert("Please connect to Goerli Testnet");
      throw new Error("Please connect to Goerli Testnet");
    }

    if(needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }

    return web3Provider;
  };
  
  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true)
    } catch(err){
      console.error(err)
    }
  }

  useEffect(()=> {
    if(!walletConnected){
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet()
    }
  },[]);
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
        {
          walletConnected ? (
          <div>
          <div className={styles.description}>
            You have minted {utils.formatEther(balanceOfASCryptoDevTokens)} Agrim Crypto Dev tokens
          </div>
            <div className={styles.description}>
              Overall {utils.formatEther(tokensMinted)}/10000 have been minted
            </div>
          </div>
          ) : (
          <button onClick={connectWallet} className ={styles.button}>
            Connect your Wallet
          </button>
        )}
      </div>
    </div>
  );
}
