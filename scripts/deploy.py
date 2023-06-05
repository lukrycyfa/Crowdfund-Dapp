from brownie import FundRaiser, accounts, network, config
from brownie.network.gas.strategies import LinearScalingStrategy
import json
import os


gas_strategy = LinearScalingStrategy("10 gwei", "50 gwei", 1.1)

def main():
    # Deploy On Akfajores And Copy The ABI And Address To The React App
    if network.show_active()=='alfajores':
        adr = {}
        dev = accounts.add(config["wallets"]["from_key0"])
        print(network.show_active())
        deployed = FundRaiser.deploy({'from':dev, "gas_price":gas_strategy})
        adr["address"] = deployed.address
        with open('./build/deployments/deployAlfajores.json', 'w') as outfile: 
            json.dump(adr, outfile, indent=4)
            if not os.path.exists("./crowd-fund-app/src/artifacts"):
                os.mkdir("./crowd-fund-app/src/artifacts")
                with open('./build/contracts/contracts/FundRaiser.json', 'r') as dep:
                    abi_file = json.load(dep)
                    with open('./crowd-fund-app/src/artifacts/FundRaiser.json', 'w') as abi:
                        json.dump(abi_file, abi, indent=4)
                    with open('./crowd-fund-app/src/artifacts/Address.json', 'w') as conAdr:
                        json.dump(adr, conAdr, indent=4)
            else:
                with open('./build/contracts/contracts/FundRaiser.json', 'r') as dep:
                    abi_file = json.load(dep)
                    with open('./crowd-fund-app/src/artifacts/FundRaiser.json', 'w') as abi:
                        json.dump(abi_file, abi, indent=4)
                    with open('./crowd-fund-app/src/artifacts/Address.json', 'w') as conAdr:
                        json.dump(adr, conAdr, indent=4)                
        return deployed

    # Deploy On Ganache
    if network.show_active()=='development':
        adr = {}       
        owner = accounts[0]
        deployed = FundRaiser.deploy({'from':owner, "gas_price":gas_strategy})
        adr["address"] = deployed.address
        with open('./build/deployments/deployLocal.json', 'w') as outfile: #lukrycyfa
            json.dump(adr, outfile, indent=4) #lukrycyfa   
        return deployed