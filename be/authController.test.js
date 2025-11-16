const request = require("supertest");
const express = require("express");

// Mock bcrypt
jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("$2a$10$hashedpassword"),
  compare: jest.fn().mockResolvedValue(true),
}));

// Mock the Crud class
jest.mock("./helper/crud", () => {
  return jest.fn().mockImplementation(() => ({
    where: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue([]),
    insert: jest.fn().mockResolvedValue({ insertId: 1 }),
    update: jest.fn().mockResolvedValue(),
    delete: jest.fn().mockResolvedValue(),
  }));
});

const authController = require("./controllers/authController");
const { userDb, roleDb, accessDb } = authController;

const app = express();
app.use(express.json());
app.post("/auth/createUser", authController.createUser);
app.post("/auth/login", authController.login);
app.get("/auth/user/:userId", authController.getUserById);
app.get("/auth/users", authController.getUsers);
app.put("/auth/user/:userId", authController.updateUser);
app.delete("/auth/user/:userId", authController.deleteUser);
app.post("/auth/role", authController.createRole);
app.get("/auth/roles", authController.getRoles);
app.put("/auth/role/:roleId", authController.updateRole);
app.delete("/auth/role/:roleId", authController.deleteRole);
app.get("/auth/role/:roleId", authController.getRoleById);
app.post("/auth/role/:roleId/access", authController.setRoleAccess);
app.delete("/auth/role/:roleId/access", authController.removeRoleAccess);
app.get("/auth/role/:roleId/access", authController.getRoleAccess);

describe("Auth Controller Tests", () => {
  describe("POST /auth/createUser", () => {
    it("should create a new user successfully", async () => {
      const response = await request(app)
        .post("/auth/createUser")
        .send({
          userNik: "12345",
          userName: "John Doe",
          userPassword: "password",
          roleId: 1,
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("User Created");
    });

    it("should return error for duplicate NIK", async () => {
      userDb.where.mockReturnValueOnce({
        get: jest.fn().mockResolvedValue([{ id: 1 }]),
      });

      const response = await request(app)
        .post("/auth/createUser")
        .send({
          userNik: "12345",
          userName: "John Doe",
          userPassword: "password",
          roleId: 1,
        });

      expect(response.status).toBe(400);
      expect(response.body.title).toBe("Server error");
    });
  });

  describe("POST /auth/login", () => {
    it("should login successfully", async () => {
      userDb.where.mockReturnValueOnce({
        get: jest
          .fn()
          .mockResolvedValue([
            { id: 1, userPassword: "$2a$10$hashedpassword" },
          ]),
      });

      const response = await request(app)
        .post("/auth/login")
        .send({ userNik: "12345", userPassword: "password" });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Login Successful");
      expect(response.body.token).toBeDefined();
    });

    it("should return error for invalid credentials", async () => {
      userDb.where.mockReturnValueOnce({
        get: jest.fn().mockResolvedValue([]),
      });

      const response = await request(app)
        .post("/auth/login")
        .send({ userNik: "12345", userPassword: "wrongpassword" });

      expect(response.status).toBe(500);
      expect(response.body.title).toBe("Server error");
    });
  });

  describe("GET /auth/user/:userId", () => {
    it("should get user by ID", async () => {
      userDb.where.mockReturnValueOnce({
        get: jest.fn().mockResolvedValue([{ id: 1, userName: "John" }]),
      });

      const response = await request(app).get("/auth/user/1");

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("User Found");
    });

    it("should return error if user not found", async () => {
      userDb.where.mockReturnValueOnce({
        get: jest.fn().mockResolvedValue([]),
      });

      const response = await request(app).get("/auth/user/1");

      expect(response.status).toBe(500);
      expect(response.body.title).toBe("Server error");
    });
  });

  describe("GET /auth/users", () => {
    it("should get all users", async () => {
      userDb.get.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);

      const response = await request(app).get("/auth/users");

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Users Retrieved");
    });
  });

  describe("PUT /auth/user/:userId", () => {
    it("should update user successfully", async () => {
      userDb
        .where("userId!", "1")
        .where("userNik", "12345")
        .get.mockReturnValueOnce([]);
      userDb
        .where("userId", "1")
        .get.mockReturnValueOnce([
          {
            id: 1,
            userNik: "12345",
            userName: "John Doe",
            userPassword: "$2a$10$hashedpassword",
            roleId: 1,
          },
        ]);
      userDb.where("userId", "1").update.mockReturnValueOnce({});

      const response = await request(app)
        .put("/auth/user/1")
        .send({ userNik: "12345", userName: "Jane Doe", roleId: 1 });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("User Updated");
    });

    it("should return error for duplicate NIK", async () => {
      userDb
        .where("userId!", "1")
        .where("userNik", "12345")
        .get.mockReturnValueOnce([{ id: 2 }]);

      const response = await request(app)
        .put("/auth/user/1")
        .send({ userNik: "12345", userName: "Jane Doe", roleId: 1 });

      expect(response.status).toBe(500);
      expect(response.body.title).toBe("Server error");
    });
  });

  describe("DELETE /auth/user/:userId", () => {
    it("should delete user successfully", async () => {
      userDb.where("userId", "1").get.mockReturnValueOnce([{ id: 1 }]);
      userDb.where("userId", "1").delete.mockReturnValueOnce({});

      const response = await request(app).delete("/auth/user/1");

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("User Deleted");
    });

    it("should return error if user not found", async () => {
      userDb.where("userId", "1").get.mockReturnValueOnce([]);

      const response = await request(app).delete("/auth/user/1");

      expect(response.status).toBe(500);
      expect(response.body.title).toBe("Server error");
    });
  });

  describe("POST /auth/role", () => {
    it("should create role successfully", async () => {
      roleDb.where("roleName", "Admin").get.mockReturnValueOnce([]);

      const response = await request(app)
        .post("/auth/role")
        .send({ roleName: "Admin", homePage: "/dashboard" });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Role Created");
    });
  });

  describe("GET /auth/roles", () => {
    it("should get all roles", async () => {
      roleDb.get.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);

      const response = await request(app).get("/auth/roles");

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Roles Retrieved");
    });
  });

  describe("PUT /auth/role/:roleId", () => {
    it("should update role successfully", async () => {
      roleDb
        .where("roleId!", "1")
        .where("roleName", "User")
        .get.mockReturnValueOnce([]);
      roleDb.where("roleId", "1").update.mockReturnValueOnce({});

      const response = await request(app)
        .put("/auth/role/1")
        .send({ roleName: "User", homePage: "/home" });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Role Updated");
    });
  });

  describe("DELETE /auth/role/:roleId", () => {
    it("should delete role successfully", async () => {
      roleDb.where("roleId", "1").get.mockReturnValueOnce([{ id: 1 }]);
      roleDb.where("roleId", "1").delete.mockReturnValueOnce({});

      const response = await request(app).delete("/auth/role/1");

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Role Deleted");
    });
  });

  describe("GET /auth/role/:roleId", () => {
    it("should get role by ID", async () => {
      roleDb
        .where("roleId", "1")
        .get.mockReturnValueOnce([{ id: 1, roleName: "Admin" }]);

      const response = await request(app).get("/auth/role/1");

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Role Retrieved");
    });
  });

  describe("POST /auth/role/:roleId/access", () => {
    it("should set role access successfully", async () => {
      roleDb.where("roleId", "1").get.mockReturnValueOnce([{ id: 1 }]);
      accessDb
        .where("roleId", "1")
        .where("path", "/admin")
        .get.mockReturnValueOnce([]);
      accessDb.insert.mockReturnValueOnce({});

      const response = await request(app)
        .post("/auth/role/1/access")
        .send({ path: "/admin" });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Role Access Granted");
    });
  });

  describe("DELETE /auth/role/:roleId/access", () => {
    it("should remove role access successfully", async () => {
      roleDb.where("roleId", "1").get.mockReturnValueOnce([{ id: 1 }]);
      accessDb
        .where("roleId", "1")
        .where("path", "/admin")
        .delete.mockReturnValueOnce({});

      const response = await request(app)
        .delete("/auth/role/1/access")
        .send({ path: "/admin" });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Role Access Revoked");
    });
  });

  describe("GET /auth/role/:roleId/access", () => {
    it("should get role access", async () => {
      roleDb.where("roleId", "1").get.mockReturnValueOnce([{ id: 1 }]);
      accessDb
        .where("roleId", "1")
        .get.mockReturnValueOnce([{ path: "/admin" }]);

      const response = await request(app).get("/auth/role/1/access");

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Role Access Retrieved");
    });
  });
});
