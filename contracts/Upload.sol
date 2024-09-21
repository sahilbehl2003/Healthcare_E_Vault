// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Upload {

    struct Access {
        address user; 
        bool access;
    }

    struct UserFiles {
        string[] files;
        mapping(address => bool) ownership;
        mapping(address => bool) previousData;
        Access[] accessList;
    }

    mapping(address => UserFiles) private userFiles;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function add(address _user, string memory url) external {
        require(msg.sender == owner, "Only the owner can perform this action");
        userFiles[_user].files.push(url);
    }

    function allow(address user) external {
        UserFiles storage senderFiles = userFiles[msg.sender];
        senderFiles.ownership[user] = true;
        
        if (senderFiles.previousData[user]) {
            for (uint i = 0; i < senderFiles.accessList.length; i++) {
                if (senderFiles.accessList[i].user == user) {
                    senderFiles.accessList[i].access = true;
                    break;
                }
            }
        } else {
            senderFiles.accessList.push(Access(user, true));
            senderFiles.previousData[user] = true;
        }
    }

    function disallow(address user) external {
        UserFiles storage senderFiles = userFiles[msg.sender];
        senderFiles.ownership[user] = false;

        for (uint i = 0; i < senderFiles.accessList.length; i++) {
            if (senderFiles.accessList[i].user == user) {
                senderFiles.accessList[i].access = false;
                break;
            }
        }
    }

    function display(address _user) external view returns(string[] memory) {
        UserFiles storage user = userFiles[_user];
        require(_user == msg.sender || user.ownership[msg.sender], "You don't have access");
        return user.files;
    }

    function shareAccess() public view returns(Access[] memory) {
        return userFiles[msg.sender].accessList;
    }

    function removeFile(uint index) public {
        require(msg.sender == owner, "Only the owner can perform this action");
        UserFiles storage senderFiles = userFiles[msg.sender];
        require(index < senderFiles.files.length, "Invalid file index");
        senderFiles.files[index] = senderFiles.files[senderFiles.files.length - 1];
        senderFiles.files.pop();
    }
}