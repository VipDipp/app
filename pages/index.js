import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "react"
import { injected } from "../components/connectors"
import { buyToken, getOwhBalance, getTokenBalance, getTokenName, getTokenPrice, getTokenSymbol, getTotalSupply } from "./api/web"

export default function Home() {
  const { chainId ,active, account, library, activate, deactivate } = useWeb3React()
  const [ totalSupply, setTotalSupply ] = useState('')
  const [ name, setName ] = useState("")
  const [ symbol, setSymbol ] = useState("")
  const [ balance,setBalance ]= useState("")
  const [ price, setPrice ] = useState(0)
  const [ owhBalance, setOwhBalance ] = useState(0)
  const [ tokenBalance, setTokenBalance ] = useState(0)
  const [ ethAmount, setEthAmount ] = useState(0)

  

  async function connect() {
    try {
      await activate(injected)
      localStorage.setItem('isWalletConnected', true)
    } catch (ex) {
      console.log(ex)
    }
  }

  async function disconnect() {
    try {
      deactivate()
      localStorage.setItem('isWalletConnected', false)
    } catch (ex) {
      console.log(ex)
    }
  }
  useEffect(() => {
    const get = async () => {
      console.log(chainId)
      localStorage.setItem('ChainID', chainId)
      setTokenBalance(await getTokenBalance(account))
      setTotalSupply(await getTotalSupply())
      setName(await getTokenName())
      setSymbol(await getTokenSymbol())
      setPrice(await getTokenPrice())
      setOwhBalance(await getOwhBalance())
    }
    library?.eth.getBalance(account).then((res) => {
      setBalance(res/1e18)
    })
    active == true ? get() : null
  }, [active, chainId, account])

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage.getItem('isWalletConnected') === 'true') {
        try {
          await activate(injected)
          localStorage.setItem('isWalletConnected', true)
        } catch (ex) {
          console.log(ex)
        }
        
      }
    }
    connectWalletOnPageLoad()
    
  }, [])

  return (
    <div className="flex flex-col items-center justify-center border-2 border-black rounded-xl w-1/2 translate-y-1/4 translate-x-1/2 gap-3 font-semibold text-lg">
      {active ? 
        <div className="flex flex-col items-center justify-center gap-3">
          <span>Connected with <b>{account}</b> </span>
          <a>SuccessfulCurrencyArtificialMagnecy - SCAM</a>
          <a>Your account balance - {balance}</a>
          <a>The total supply of {name}({symbol}) - {totalSupply}</a>
          <a>The price of the token - {price}: buy NOW untill 100000x or you have barricade</a>
          <a>Your {symbol} balance: {tokenBalance} buy more!!!</a>
          <a>OwhBalance: {owhBalance} {symbol}</a>
            {ethAmount != "" ?
            <a className="whitespace-nowrap">You&apos;ll get {ethAmount/price} {symbol}</a>
            :
            null
            }
          <div className="flex flex-row w-3/4">
            <input type="text" className="border-2 border-black rounded" placeholder="Amount of ETH" onChange={(event) => {setEthAmount(event.target.value)}}/>
            <button type="button" className="w-1/2 h-auto rounded bg-blue-600 hover:bg-blue-800 text-lg font-bold text-white" onClick={async() => {await buyToken(account, ethAmount)}}>Buy Token</button>
          </div>
          <a className="absolute bottom-0 right-0 text-xs text-slate-200" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">we are not returning any money</a>
        </div>
      : 
        <span>Not connected</span>
      }
      <button onClick={connect} className="py-2 mt-1 mb-1 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">Connect to MetaMask</button>
      <button onClick={disconnect} className="py-2 mt-1 mb-1 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">Disconnect</button>
    </div>
  )
}