// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./token.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract CoinVest {

    modifier onlyOrg() {
        require(isOrg[msg.sender], "Only a registered organization can perform this action.");
        _;
    }

    modifier onlyWhitelisted {
        require(stakeholderDetails[msg.sender].isWhitelisted, "Only whitelisted stakeholders can perform this action.");
        _;
    }

    // State Variables
    address[] public orgs;
    mapping(address => bool) private isOrg;
    mapping (address => uint) public orgTokenBalances;
    mapping (address => Organisation) public organisations; // org details
    mapping (address => address) public orgTokenDetail; // org token addresses
    mapping (address => Stakeholder) public stakeholderDetails;// stakeholders and their details
    mapping (address => address[]) public whitelistedAddresses; // a mapping of organisations to their respective whitelisted addresses

    // Organization Model
    struct Organisation {
        string name;
        address admin;  // admin
        string symbol;
        uint totalSupply;
        bool registered;
    }

    // Stakeholders Model : investors, pre-sale buyers, founders, etc.
    struct Stakeholder {
        address admin;
        string tag;
        uint vestingPeriod;
        bool isWhitelisted; //
        uint balanceOfStake;
    }

    // register as organization
    function registerAsOrg() external {
        require(msg.sender != address(0), "Invalid address");
        isOrg[msg.sender] = true;
        orgs.push(msg.sender);
    }

    // get registered orgs
    function getOrgs() public view returns (address[] memory) {
        return orgs;
    }

    // An organization should be able to register themselves and their token (basically spinning off a contract for one ERC20 token).
    function orgToken(string memory _orgName, string memory _symbol, uint _totalSupply) external onlyOrg returns (bool) {
        require(!organisations[msg.sender].registered, "Organisation already registered");
        require(bytes(_orgName).length != 0, "Provide a valid organisation name");
        require(bytes(_symbol).length != 0, "Provide a token name, i.e., an abbreviation");
        require(organisations[msg.sender].admin == address(0), "An organisation has already gone by that address");

        // create organisation's token from the provided parameters
        Token _token = new Token(_orgName, _symbol, _totalSupply);
        address tokenAddr = address(_token);
        Token token = Token(tokenAddr);
        uint supply = token.supply();
        orgTokenBalances[tokenAddr] = supply;

        orgTokenDetail[msg.sender] = tokenAddr;
        organisations[msg.sender] = Organisation({name:_orgName, admin:msg.sender, symbol:_symbol, totalSupply:supply, registered:true});
         
        return true;
        
    }

    // vesting period
    // Organisation should be able to mention the type of stakeholder and their vesting period (timelock).

    function setVestingDetails(address _stakeholderAddr, string memory _tag, uint _amount, uint _vestingPeriod) external onlyOrg {
        require(organisations[msg.sender].registered, "Only a registered organization can set vesting details.");
        require(_stakeholderAddr != address(0), "Invalid stakeholder address.");
        require(bytes(_tag).length != 0, "Provide a valid stakeholder type.");
        require(_vestingPeriod > 0, "Vesting period must be greater than zero.");
        address tokenAddr = orgTokenDetail[msg.sender];
        Token token = Token(tokenAddr);
        require(tokenAddr != address(0), "Token not found for the organisation.");
        require(token.balanceOf(tokenAddr) >= _amount, "Organisation is out of tokens.");

        uint LOCKDURATION =  _vestingPeriod ;
        uint ENDLOCK = block.timestamp + LOCKDURATION;

        stakeholderDetails[_stakeholderAddr] = Stakeholder({admin: msg.sender, tag:_tag, vestingPeriod:ENDLOCK, isWhitelisted:false, balanceOfStake:_amount});
        
        token.burn(tokenAddr, _amount);
        orgTokenBalances[tokenAddr] = token.supply();
        
    }

    // whitelist stakeholders
    function setWhitelist(address _stakeholderAddr) external onlyOrg {
        require(_stakeholderAddr != address(0), "Invalid stakeholder address.");
        require(!stakeholderDetails[_stakeholderAddr].isWhitelisted, "Stakeholder has already been whitelisted.");
        stakeholderDetails[_stakeholderAddr].isWhitelisted = true;
        whitelistedAddresses[msg.sender].push(_stakeholderAddr);
    }

    // org withdrawals to whitelisted addresses
    function claimTokensFor(address _stakeholderAddr) external onlyOrg {
        require(_stakeholderAddr != address(0), "Provide a valid address");
        require(stakeholderDetails[_stakeholderAddr].balanceOfStake > 0, "No tokens available to claim.");
        require(stakeholderDetails[_stakeholderAddr].vestingPeriod <= block.timestamp , "Vesting period not yet completed.");

        uint256 claimableAmount = stakeholderDetails[_stakeholderAddr].balanceOfStake;
        stakeholderDetails[_stakeholderAddr].balanceOfStake = 0;

        address orgTokenAddr = orgTokenDetail[stakeholderDetails[_stakeholderAddr].admin];
        Token token = Token(orgTokenAddr);
        
        token.wire(_stakeholderAddr, claimableAmount);
    }


    function claimTokens() external onlyWhitelisted returns(uint256) { 
        require(msg.sender != address(0), "The address is not a valid address.");
        require(stakeholderDetails[msg.sender].balanceOfStake > 0, "No tokens available to claim.");
        require(stakeholderDetails[msg.sender].vestingPeriod <= block.timestamp , "Vesting period not yet completed.");

        uint256 claimableAmount = stakeholderDetails[msg.sender].balanceOfStake;
        stakeholderDetails[msg.sender].balanceOfStake = 0;

        address orgTokenAddr = orgTokenDetail[stakeholderDetails[msg.sender].admin];
        Token token = Token(orgTokenAddr);
        
        token.wire(msg.sender, claimableAmount);

        // return balance
        return token.getBalance(msg.sender);

    }

}