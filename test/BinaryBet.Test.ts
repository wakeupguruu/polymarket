// import {expect} from "chai"
import hre from "hardhat"
import { before } from "node:test"
import {Address, parseEther} from "viem"

const {viem}:any = hre;

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

    
})



// import { expect } from 'chai';
// import hre from 'hardhat';
// import { Address, parseEther } from 'viem';

// // We get necessary Viem clients and addresses from the Hardhat Runtime Environment (hre)
// const { viem } = hre; 

// describe('BinaryBet', function () {
//     let owner: Address;
//     let user1: Address;
//     let contract: Awaited<ReturnType<typeof viem.deployContract>>;

//     before(async function () {
//         [owner, user1] = await viem.getAddresses();
        
//         // Deploy the contract once for all tests (use loadFixture later for efficiency)
//         contract = await viem.deployContract('BinaryBet', [], {
//             value: parseEther('1.0') // Send 1 ETH as initial liquidity
//         });
//     });

//     // --- TEST 1: SANITY CHECK ---
//     it('Should correctly set the deployer as the owner', async function () {
//         const deployedOwner = await contract.read.owner();
//         expect(deployedOwner).to.equal(owner);
//     });

//     // --- TEST 2: FAILURE CHECK ---
//     it('Should revert if a non-owner tries to settle the market', async function () {
//         // We expect the contract call to fail (revert) when user1 calls settleMarket
//         await expect(
//             contract.write.settleMarket([true], { account: user1 })
//         ).to.be.rejectedWith("Not the contract owner.");
//     });

//     // --- TEST 3: HAPPY PATH ---
//     it('Should allow a user to place a bet on WIN', async function () {
//         const betAmount = parseEther('0.5'); // 0.5 ETH

//         // Perform the state-changing action
//         await contract.write.betWin({
//             account: user1,
//             value: betAmount
//         });

//         // Verify the contract state was updated correctly
//         const user1BetBalance = await contract.read.winBets([user1]);
//         expect(user1BetBalance).to.equal(betAmount);
//     });
// });