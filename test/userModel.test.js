const mongoose = require("mongoose");
const chai = require("chai");
const expect = chai.expect;
const User = require("../model/user");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("User Model", () => {
  let mongoServer;

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("should hash the password before saving", async () => {
    const user = new User({ username: "testuser", password: "password123" });
    await user.save();

    expect(user.password).not.to.equal("password123");
  });

  it("should compare passwords correctly", async () => {
    const user = new User({ username: "testuser2", password: "password123" });
    await user.save();

    const isMatch = await user.comparePassword("password123");
    expect(isMatch).to.be.true;
  });
});
