// import {expect} from "chai"
import hre from "hardhat"
import { before } from "node:test"
import {Address, parseEther} from "viem"

const {viem, publicClient}:any = hre;

describe('BinaryBet', () => {
  let owner: Address
  let user1: Address
  let contract: Awaited<ReturnType<typeof viem.deployContract>>;

  before(async ()=>{
    [owner, user1] = await viem.getAdressess()

    contract = await viem.deployContract('BinaryBet', [],{
        value: parseEther('1.0')
    });
  });

  it('Should correctly set the deployer as the owner', async () => {
    const deployedOwner = await contract.read.owner();
    expect(deployedOwner).toEqual(owner);
  });

  it('Should revert if a non-owner tries to settle the market', async () => {

    await expect(
        contract.write.settleMarket([true],{account: user1}).toBeRejectedWith("Not the contract owner")
    );
  });


    it("should allow a user to place a bet on WIN", async()=>{
        const betAmount = parseEther('0.5');
        const user1InitialBalace = await viem.getBalance({address: user1});


        if (user1InitialBalace < betAmount) {
            throw new Error("Insufficient balance for user1 to place bet");
        }
        await contract.write.placeBetWin({
            account: user1,
            value: betAmount
        });

        const user1FinalBalance = await viem.getBalance({address: user1});

        const user1BetBalance = await contract.read.winBets([user1]);
        
        expect(user1BetBalance).toEqual(betAmount);
        
        expect(user1FinalBalance).toEqual(user1InitialBalace - betAmount);
    });

    // it("should allow the owner to settle the market and distribute winnings", async()=>{
    //     const ownerInitialBalance = await viem.getBalance({address: owner});

    //     await contract.write.settleMarket([true],{account: owner});

    //     const ownerFinalBalance = await viem.getBalance({address: owner});

    //     expect(ownerFinalBalance).toEqual(ownerInitialBalance + parseEther('0.5'));
    // });

        it("should allow user to place bet on LOSE", async()=>{
            const betAmount = parseEther('0.3');
            const user1InitialBalance = await viem.getBalance({adress: user1});
            const contractBalance = await viem.getBalance({adress: contract.address})
            if(user1InitialBalance<betAmount){
                throw new Error("Insufficient balance for user1 to place bet");
            }

            const hash = await contract.write.placeBetLose({
                account: user1,
                value: betAmount
            })

            await publicClient.waitForTransactionReceipt({
                hash
            });

            const user1FinalBalace = await viem.getBalance({address: user1});
            const user1BetBalance = await contract.read.loseBets([user1]);
            const contractFinalBalace = await viem.getBalance({address: contract.address});

            expect(contractFinalBalace).toEqual(contractBalance + betAmount);
            expect (user1BetBalance).toEqual(betAmount);
            expect (user1FinalBalace).toEqual(user1InitialBalance - betAmount);
        })
})