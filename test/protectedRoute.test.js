const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../index");

chai.use(chaiHttp);
const expect = chai.expect;

describe("Protected Route", () => {
  let mongoServer;
  let token;

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Register and log in a user to get a token
    await chai
      .request(app)
      .post("/auth/register")
      .send({ username: "testuser", password: "password123" });

    const res = await chai
      .request(app)
      .post("/auth/login")
      .send({ username: "testuser", password: "password123" });

    token = res.body.token;
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("should access protected route with valid token", (done) => {
    chai
      .request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.equal("This is a protected route");
        done();
      });
  });

  it("should deny access without token", (done) => {
    chai
      .request(app)
      .get("/protected")
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property(
          "error",
          "Access denied, no token provided"
        );
        done();
      });
  });
});
