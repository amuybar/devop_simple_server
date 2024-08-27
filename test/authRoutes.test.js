const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../index"); 

chai.use(chaiHttp);
const expect = chai.expect;

describe("Auth Routes", () => {
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

  it("should register a new user", (done) => {
    chai
      .request(app)
      .post("/auth/register")
      .send({ username: "testuser", password: "password123" })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property(
          "message",
          "User registered successfully"
        );
        done();
      });
  });

  it("should log in the user", (done) => {
    chai
      .request(app)
      .post("/auth/login")
      .send({ username: "testuser", password: "password123" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("token");
        done();
      });
  });

  it("should fail to log in with incorrect password", (done) => {
    chai
      .request(app)
      .post("/auth/login")
      .send({ username: "testuser", password: "wrongpassword" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property(
          "error",
          "Invalid username or password"
        );
        done();
      });
  });
});
