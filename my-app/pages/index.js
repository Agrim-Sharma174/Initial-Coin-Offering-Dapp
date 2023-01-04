import Head from "next/head";
import { useEffect, useRef } from "react";
import { Web3Modal } from "web3modal";

export default function Home() {

  const[walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();

  useEffect(()=> {
    if(!walletConnected){
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      })
    }
  },[])
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
      </div>
    </div>
  );
}
