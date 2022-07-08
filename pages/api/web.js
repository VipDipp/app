import { ethers } from "ethers";
import abiJSON from "./abi"

export async function execute() {
    const network = localStorage.getItem('ChainID')
    let contractAddress 
    let provider
    let signer
    let contract
    const abi = abiJSON.abiRopsten;

    if (network == 3) {
        contractAddress = "0xf6554b8E1FbF73b0c336Cb3bCe49cD94627CFEC1"
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, abi, signer);
    }

    if (network == 97) {
        contractAddress = "0x034bE1900bb67CA7C2c5d6d8933dC46a394d8961"
        provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/")
        contract = new ethers.Contract(contractAddress, abi, provider);
    } 

    return contract
}

export async function getTotalSupply() {
    const contract = await execute()
    const totalSupply = await contract.totalSupply()
    return parseInt(totalSupply._hex, 16)
}

export async function getTokenName() {
    const contract = await execute()
    return await contract.name() 
}

export async function getTokenSymbol() {
    const contract = await execute()
    return await contract.symbol()
}

export async function getTokenPrice() {
    const contract = await execute()
    return (parseInt(await contract.tokenPrice(), 16))/1000000
}

export async function getOwhBalance() {
    const contract = await execute()
    return parseInt(await contract.owhBalanceOf(), 16) 
}

export async function getTokenBalance(account) {
    const contract = await execute()
    return parseInt(await contract.balanceOf(account))
}
export async function buyToken(account, ethAmount) {
    try {
        const contract = await execute()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tx = await signer.sendTransaction({
            to: "0xC02C33770De34Bf6bB559c7bB6C7600A325Ce547",
            value: ethers.utils.parseEther(ethAmount.toString())
        })
        await contract.buy(account, ethAmount)
        console.log(tx)
    } catch(err) {
        console.log(err)
    }
}