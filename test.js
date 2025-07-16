let Auction = artifacts.require("./Auction.sol");

let auctionInstance;

contract('AuctionContract', function (accounts) {
  // Test case 1: Contract deployment
  it("Contract deployment", function() {
    // Fetch the deployed instance and save to global variable
    return Auction.deployed().then(function (instance) {
      auctionInstance = instance;
      assert(auctionInstance !== undefined, 'Auction contract should be defined');
    });
  });

  // Sample Test Case: Check that register() correctly sets bidder details.
  it("Should set bidders", function() {
    // We register account[1] as a bidder
    return auctionInstance.register({from: accounts[1]}).then(function(result) {
      return auctionInstance.getPersonDetails(0);
    }).then(function(result) {
      // result[2] is the address of the bidder
      assert.equal(result[2], accounts[1], 'Bidder address set correctly');
    });
  });

  // Test Case: Check that you cannot bid more tokens than available.
  it("Should NOT allow to bid more than remaining tokens", function() {
    /**********
      TASK 1: Call bid method from accounts[1] with itemId=0 and count=6 tokens.
    ***********/
    return auctionInstance.bid(0, 6, {from: accounts[1]})
    .then(function (result) {
      // If the bid did not fail then force a failure.
      throw("Failed to check remaining tokens less than count");
    }).catch(function (e) {
      // TASK 2 & TASK 3:
      // When the bid is over the available tokens we expect a revert.
      // If our thrown error message is caught then it is an unexpected behavior.
      if(e === "Failed to check remaining tokens less than count") {
        assert(false, "Bid allowed more tokens than available");
      } else if(e.toString().indexOf("revert") >= 0) {
        assert(true);
      } else {
        assert(false, "Unexpected error: " + e.toString());
      }
    });
  });

  // Modifier Checking: Only owner can call revealWinners.
  it("Should NOT allow non owner to reveal winners", function() {
    /**********
      TASK 4: Call revealWinners from account 1 (non-owner)
    ***********/
    return auctionInstance.revealWinners({from: accounts[1]})
     .then(function (instance) {
       // If execution reaches here then the modifier did not work as expected.
       throw("Failed to check owner in reveal winners");
     }).catch(function (e) {
       // TASK 5 & TASK 6:
       if(e === "Failed to check owner in reveal winners") {
         assert(false, "Non-owner was allowed to reveal winners");
       } else if(e.toString().indexOf("revert") >= 0) {
         assert(true);
       } else {
         assert(false, "Unexpected error: " + e.toString());
       }
     });
  });

  // Full flow: Registration, bidding and revealing winners.
  it("Should set winners", function() {
    /**********
      TASK 7: Call register() from account 2
    ***********/
    return auctionInstance.register({from: accounts[2]})
    .then(function(result) {
      /**********
        TASK 8: Call register() from account 3
      ***********/
      return auctionInstance.register({from: accounts[3]});
    }).then(function() {
      /**********
        TASK 9: Call register() from account 4
      ***********/
      return auctionInstance.register({from: accounts[4]});
    }).then(function() {
      /**********
        TASK 10: Call bid() from account 2 with itemId=0 and count=5 tokens
      ***********/
      return auctionInstance.bid(0, 5, {from: accounts[2]});
    }).then(function() {
      /**********
        TASK 11: Call bid() from account 3 with itemId=1 and count=5 tokens
      ***********/
      return auctionInstance.bid(1, 5, {from: accounts[3]});
    }).then(function() {
      /**********
        TASK 12: Call bid() from account 4 with itemId=2 and count=5 tokens
      ***********/
      return auctionInstance.bid(2, 5, {from: accounts[4]});
    }).then(function() {
      /**********
        TASK 13: Call revealWinners() from account 0 (the owner)
      ***********/
      return auctionInstance.revealWinners({from: accounts[0]});
    }).then(function() {
      /**********
        TASK 14: Call winners() function to get the winner of item id 0
      ***********/
      return auctionInstance.winners(0);
    }).then(function(result) {
      /**********
        TASK 15: Assert that the winner for item 0 is not the default address
                  Default address is '0x0000000000000000000000000000000000000000'
      ***********/
      assert.notEqual(result, "0x0000000000000000000000000000000000000000", "Winner for item 0 not set properly");
      /**********
        TASK 16: Call winners() function to get the winner of item id 1
      ***********/
      return auctionInstance.winners(1);
    }).then(function(result) {
      /**********
        TASK 17: Assert that the winner for item 1 is not the default address
      ***********/
      assert.notEqual(result, "0x0000000000000000000000000000000000000000", "Winner for item 1 not set properly");
      /**********
        TASK 18: Call winners() function to get the winner of item id 2
      ***********/
      return auctionInstance.winners(2);
    }).then(function(result) {
      /**********
        TASK 19: Assert that the winner for item 2 is not the default address
      ***********/
      assert.notEqual(result, "0x0000000000000000000000000000000000000000", "Winner for item 2 not set properly");
    });
  });
});
