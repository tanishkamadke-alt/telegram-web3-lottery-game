const { expect } = require("chai");
const {ethers} = require("hardhat");

describe("Lottery Contract", function () {

    let lottery;
    let owner;
    let player1;
    let player2;

    beforeEach(async function() {

        [owner, player1, player2] = await ethers.getSigners();

        const Lottery = await ethers.getContractFactory("Lottery");

        lottery = await Lottery.deploy();

        await lottery.waitForDeployment();

    });

    describe("Deployment", function () {

    it("Should deploy successfully", async function () {

        expect(await lottery.getAddress()).to.not.equal(
            "0x0000000000000000000000000000000000000000"
        );

    });

    it("Should set the deployer as manager", async function (){

        expect(await lottery.manager()).to.equal(owner.address);
    });

    it("Should initialize the correct ticket price", async function () {

        expect(await lottery.ticketPrice()).to.equal(
            ethers.parseEther("0.01")
        );

    });

    });

    describe("Ticket Purchase", function (){

        it("Should allow a user to buy ticket", async function(){

            await lottery.connect(player1).buyTicket({
                value: ethers.parseEther("0.01")
            });

            expect(await lottery.getTotalPlayers()).to.equal(1);

        });

        it("Should increase the contract balance after ticket purchase", async function(){
            await lottery.connect(player1).buyTicket({
                value: ethers.parseEther("0.01")
            });
            expect(await lottery.getContractBalance()).to.equal(
                ethers.parseEther("0.01")
            );
        });
    });

    describe("Access Control", function (){
        it("Should prevent a non-manager from drawing the winner", async function () {
            await lottery.connect(player1).buyTicket({
                value: ethers.parseEther("0.01")
            });

            await lottery.connect(player2).buyTicket({
                value: ethers.parseEther("0.01")
            });
            
            await expect(
                lottery.connect(player1).drawWinner()
            ).to.be.revertedWith(
                "Only manager can perform this action"
            );  
        });

    });

    describe("Winner Selection", function () {
        it("Should select a winner and increment the round", async function () {
             await lottery.connect(player1).buyTicket({
                value: ethers.parseEther("0.01")
             });

             await lottery.connect(player2).buyTicket({
                value: ethers.parseEther("0.01")
             });

              await lottery.drawWinner();

              expect(await lottery.currentRound()).to.equal(2);

              expect(await lottery.getTotalPlayers()).to.equal(0);

              expect(await lottery.getLatestWinner()).to.not.equal(

                ethers.ZeroAddress
              );
            });
    });  
    
    describe("Lottery History", function (){

        it("Should store completed lottery round in history", async function (){

            await lottery.connect(player1).buyTicket({
                value: ethers.parseEther("0.01")

            });

            await lottery.connect(player2).buyTicket({
                value: ethers.parseEther("0.01")
            });

            await lottery.drawWinner();

            expect(await lottery.getLotteryHistoryCount()).to.equal(1);

            const round= await lottery.getLotteryRound(0);

            console.log(round);

            expect(round.roundId).to.equal(1);

            expect(round.totalPlayers).to.equal(2);

            expect(round.ticketPrice).to.equal(
                ethers.parseEther("0.01")
            );
        });
    });

});    