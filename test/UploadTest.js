const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Upload Contract", function () {
  let Upload;
  let uploadContract;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    Upload = await ethers.getContractFactory("Upload");
    [owner, user1, user2] = await ethers.getSigners();

    uploadContract = await Upload.deploy();
    await uploadContract.deployed();
  });

  it("should allow owner to add a file", async function () {
    const fileUrl = "ipfs://example-file-url";
    
    await uploadContract.add(owner.address, fileUrl);
    const files = await uploadContract.display(owner.address);

    expect(files.length).to.equal(1);
    expect(files[0]).to.equal(fileUrl);
  });

  it("should allow owner to grant and revoke access", async function () {
    const fileUrl = "ipfs://example-file-url";
    
    await uploadContract.add(owner.address, fileUrl);
    await uploadContract.allow(user1.address);

    const filesForUser1 = await uploadContract.connect(user1).display(owner.address);
    expect(filesForUser1.length).to.equal(1);
    expect(filesForUser1[0]).to.equal(fileUrl);

    await uploadContract.disallow(user1.address);

    await expect(uploadContract.connect(user1).display(owner.address)).to.be.revertedWith("You don't have access");
  });

  it("should allow owner to remove a file", async function () {
    const fileUrl1 = "ipfs://file-1";
    const fileUrl2 = "ipfs://file-2";
    
    await uploadContract.add(owner.address, fileUrl1);
    await uploadContract.add(owner.address, fileUrl2);

    let files = await uploadContract.display(owner.address);
    expect(files.length).to.equal(2);

    await uploadContract.removeFile(0);

    files = await uploadContract.display(owner.address);
    expect(files.length).to.equal(1);
    expect(files[0]).to.equal(fileUrl2);
  });

  it("should revert when trying to remove a file with an invalid index", async function () {
    await expect(uploadContract.removeFile(999)).to.be.revertedWith("Invalid file index");
  });

  it("should return the access list", async function () {
    await uploadContract.allow(user1.address);
    await uploadContract.allow(user2.address);

    const accessList = await uploadContract.shareAccess();

    expect(accessList.length).to.equal(2);
    expect(accessList[0].user).to.equal(user1.address);
    expect(accessList[1].user).to.equal(user2.address);
  });

  it("should not allow non-owners to add or remove files", async function () {
    const fileUrl = "ipfs://non-owner-file";

    await expect(uploadContract.connect(user1).add(user1.address, fileUrl)).to.be.revertedWith("Only the owner can perform this action");

    await expect(uploadContract.connect(user1).removeFile(0)).to.be.revertedWith("Only the owner can perform this action");
  });

  it("should not allow non-owners without access to view files", async function () {
    const fileUrl = "ipfs://example-file-url";
    
    await uploadContract.add(owner.address, fileUrl);

    await expect(uploadContract.connect(user1).display(owner.address)).to.be.revertedWith("You don't have access");
  });
});