require("dotenv").config();
const Crud = require("../helper/crud");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userDb = new Crud("users");
const roleDb = new Crud("roles");
const accessDb = new Crud("roleaccess");
const secret = process.env.JWT_SECRET;
const path = require("path");
const fs = require("fs");

module.exports = {
  createUser: async (req, res) => {
    try {
      const { userNik, userName, userPassword, roleId } = req.body;
      const duplicate = await userDb.where("userNik", userNik).get();
      if (duplicate.length > 0) {
        throw {
          message: "User with this NIK is already exist.",
        };
      }

      const hashedPassword = await bcrypt.hash(userPassword, 10);
      const newUser = {
        userNik,
        userName,
        userPassword: hashedPassword,
        roleId,
      };
      await userDb.insert(newUser);
      return res.status(200).json({
        title: "User Created",
        text: "New user has been created successfully.",
        icon: "success",
      });
    } catch (error) {
      return res
        .status(400)
        .json({ title: "Server error", text: error.message, icon: "error" });
    }
  },
  login: async (req, res) => {
    try {
      const { userNik, userPassword } = req.body;
      let users = await userDb
        .join("roles", "users.roleId = roles.roleId", "LEFT")
        .where("userNik", userNik)
        .get();
      if (users.length === 0) {
        throw {
          message: "No user found with this NIK.",
        };
      }

      const isPasswordValid = await bcrypt.compare(
        userPassword,
        users[0].userPassword
      );
      if (!isPasswordValid) {
        throw {
          message: "Password invalid.",
        };
      }

      const token = jwt.sign({ id: users[0].userId }, secret, {
        expiresIn: "24h",
      });

      users[0].userPassword = undefined;

      const access = await accessDb.where("roleId", users[0].roleId).get();
      users[0].access = access.map((a) => a.path);

      return res.status(200).json({
        title: "Login Successful",
        text: "You have logged in successfully.",
        icon: "success",
        token,
        userData: users[0],
      });
    } catch (error) {
      return res
        .status(500)
        .json({ title: "Server error", text: error.message, icon: "error" });
    }
  },
  getUserById: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await userDb.where("userId", userId).get();
      if (user.length === 0) {
        throw {
          message: "User not found.",
        };
      }
      return res.status(200).json({
        title: "User Found",
        text: "User details retrieved successfully.",
        icon: "success",
        data: user[0],
      });
    } catch (error) {
      return res
        .status(500)
        .json({ title: "Server error", text: error.message, icon: "error" });
    }
  },
  getUsers: async (req, res) => {
    try {
      let users = await userDb
        .join("roles", "users.roleId = roles.roleId", "LEFT")
        .get();

      return res.status(200).json({
        title: "Users Retrieved",
        text: "User list retrieved successfully.",
        icon: "success",
        data: users,
      });
    } catch (error) {
      return res
        .status(400)
        .json({ title: "Server error", text: error.message, icon: "error" });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const { userNik, userName, userPassword, roleId } = req.body;
      const user = await userDb
        .where("userId!=", userId)
        .where("userNik", userNik)
        .get();
      if (user.length > 0) {
        throw {
          message: "User with same NIK is already exist.",
        };
      }

      // Fetch current user to get existing password if not updating
      const currentUser = await userDb.where("userId", userId).get();
      if (currentUser.length === 0) {
        throw {
          message: "User not found.",
        };
      }

      const updatedUser = {
        userNik,
        userName,
        userPassword: userPassword
          ? await bcrypt.hash(userPassword, 10)
          : currentUser[0].userPassword,
        roleId,
      };
      await userDb.where("userId", userId).update(updatedUser);
      return res.status(200).json({
        title: "User Updated",
        text: "User details updated successfully.",
        icon: "success",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ title: "Server error", text: error.message, icon: "error" });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await userDb.where("userId", userId).get();
      if (user.length === 0) {
        throw {
          message: "User not found.",
        };
      }
      await userDb.where("userId", userId).delete();

      const signFilePath = path.join(
        __dirname,
        "../uploads/signatures",
        `${userId}_sign.png`
      );
      if (fs.existsSync(signFilePath)) {
        fs.unlinkSync(signFilePath);
      }
      return res.status(200).json({
        title: "User Deleted",
        text: "User has been deleted successfully.",
        icon: "success",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ title: "Server error", text: error.message, icon: "error" });
    }
  },
  createRole: async (req, res) => {
    try {
      const { roleName, homePage } = req.body;
      const duplicate = await roleDb.where("roleName", roleName).get();
      if (duplicate.length > 0) {
        throw {
          message: "Role with same role name is already exist.",
        };
      }

      await roleDb.insert({ roleName, homePage });
      return res.status(200).json({
        title: "Role Created",
        text: "New role has been created successfully.",
        icon: "success",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ title: "Server error", text: error.message, icon: "error" });
    }
  },
  getRoles: async (req, res) => {
    try {
      const roles = await roleDb.get();
      return res.status(200).json({
        title: "Roles Retrieved",
        text: "Role list retrieved successfully.",
        icon: "success",
        data: roles,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ title: "Server error", text: error.message, icon: "error" });
    }
  },
  updateRole: async (req, res) => {
    try {
      const { roleId } = req.params;
      const { roleName, homePage } = req.body;
      const role = await roleDb
        .where("roleId!=", roleId)
        .where("roleName", roleName)
        .get();
      if (role.length > 0) {
        throw {
          message: "Role with same name is already exist.",
        };
      }

      const updatedRole = {
        roleName,
        homePage,
      };

      await roleDb.where("roleId", roleId).update(updatedRole);
      return res.status(200).json({
        title: "Role Updated",
        text: "Role details updated successfully.",
        icon: "success",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ title: "Server error", text: error.message, icon: "error" });
    }
  },
  deleteRole: async (req, res) => {
    try {
      const { roleId } = req.params;
      const role = await roleDb.where("roleId", roleId).get();
      if (role.length === 0) {
        throw {
          message: "Role not found.",
        };
      }
      await roleDb.where("roleId", roleId).delete();
      return res.status(200).json({
        title: "Role Deleted",
        text: "Role has been deleted successfully.",
        icon: "success",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ title: "Server error", text: error.message, icon: "error" });
    }
  },
  getRoleById: async (req, res) => {
    try {
      const { roleId } = req.params;
      const role = await roleDb.where("roleId", roleId).get();
      if (role.length === 0) {
        throw {
          message: "Role not found.",
        };
      }
      return res.status(200).json({
        title: "Role Retrieved",
        text: "Role details retrieved successfully.",
        icon: "success",
        data: role[0],
      });
    } catch (error) {
      return res
        .status(500)
        .json({ title: "Server error", text: error.message, icon: "error" });
    }
  },
  getSignFile: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await userDb.where("userId", userId).get();
      if (user.length === 0) {
        throw {
          message: "User not found.",
        };
      }
      const signaturePath = path.join(
        __dirname,
        "../uploads/signatures",
        `${userId}_sign.png`
      );
      const signature = fs.existsSync(signaturePath)
        ? fs.readFileSync(signaturePath, { encoding: "base64" })
        : false;
      if (!signature) {
        return res.status(200).json({
          title: "No Signature",
          text: "User has no signature uploaded.",
        });
      }
      return res.status(200).json({
        title: "Signature Retrieved",
        text: "User signature retrieved successfully.",
        icon: "success",
        data: signature,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ title: "Server error", text: error.message, icon: "error" });
    }
  },
  setSignFile: async (req, res) => {
    try {
      const { userId } = req.params;
      const file = req.files["signature"];
      console.log(file);
      if (!file) {
        throw {
          message: "No file uploaded.",
        };
      }
      const signaturePath = path.join(
        __dirname,
        "../uploads/signatures",
        `${userId}_sign.png`
      );
      fs.writeFileSync(signaturePath, file.data);
      return res.status(200).json({
        title: "Signature Uploaded",
        text: "User signature uploaded successfully.",
        icon: "success",
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server error",
        text: error.message,
        icon: "error",
      });
    }
  },
};

// Export db instances for testing
module.exports.userDb = userDb;
module.exports.roleDb = roleDb;
module.exports.accessDb = accessDb;
