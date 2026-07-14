const { expect } = require("chai");
const {ethers} = require("hardhat");

describe("Lottery Contract", function () {

    let lottery;
    let owner;

    beforeEach(async function() {

        [owner] = await ethers.getSigners();

        const Lottery = await ethers.getContractFactory("Lottery");

        lottery = await Lottery.deploy();

        await lottery.waitForDeployment();

    });

    it("Should deploy successfully", async function () {

        expect(await lottery.getAddress()).to.not.equal(
            "0x0000000000000000000000000000000000000000"
        );

    });
});