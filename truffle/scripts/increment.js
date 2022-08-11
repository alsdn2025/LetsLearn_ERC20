/*
  Try `truffle exec scripts/increment.js`, you should `truffle migrate` first.

  Learn more about Truffle external scripts: 
  https://trufflesuite.com/docs/truffle/getting-started/writing-external-scripts
*/

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

const SimpleStorage = artifacts.require("SimpleStorage");

module.exports = async function (callback) {
  const deployed = await SimpleStorage.deployed();

  const currentValue = (await deployed.read()).toNumber();
  console.log(`Current SimpleStorage value: ${currentValue}`);

  const { tx } = await deployed.write(currentValue + 1);
  console.log(`Confirmed transaction ${tx}`);

  const updatedValue = (await deployed.read()).toNumber();
  console.log(`Updated SimpleStorage value: ${updatedValue}`);

  callback();
};
