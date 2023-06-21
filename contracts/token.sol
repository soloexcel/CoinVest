// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";



contract Token is ERC20, ERC20Burnable {

    // mapping variable here
    uint public TotalSupply;
    mapping (address => uint) public balance; 
    mapping (address => uint) public balances; 

    constructor(string memory _orgName, string memory _symbol, uint _totalSupply) ERC20(_orgName, _symbol) {
    _mint(address(this), _totalSupply);
    TotalSupply = _totalSupply;
    }

    function supply() public view returns (uint) {
        return TotalSupply;
    }

    function burn(address _address, uint _value) public {
        require(_address != address(0), "Address not valid");
        require(_value <= TotalSupply, "Value exceeds total supply");
        TotalSupply -= _value;
        balance[_address] = TotalSupply;
    }

    function wire(address _to, uint _value) public {
        // require(_from != address(0), "Address not valid");
        require(_to != address(0), "Address not valid");
        require(_value <= TotalSupply, "Value exceeds total supply");
        balances[_to] += _value;
    }

    // get individual balances
    function getBalance(address account) public view returns (uint) {
        return balances[account];
    }
}