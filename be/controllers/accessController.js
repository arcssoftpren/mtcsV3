require("dotenv").config();
const Crud = require("../helper/crud");
const jwt = require("jsonwebtoken");
const userDb = new Crud("users");
const roleDb = new Crud("roles");
const accessDb = new Crud("roleaccess");
const secret = process.env.JWT_SECRET;

module.exports = {
  getAccess: async (req, res) => {
    const { token, path } = req.body;
    try {
      const decoded = jwt.verify(token, secret);
      console.log(decoded);
      const result = await userDb.where("userId", decoded.id).get();
      const user = result[0];
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const roles = await roleDb.where("roleId", user.roleId).get();
      const access = await accessDb
        .where("path", path)
        .where("roleId", roles[0].roleId)
        .get();
      res.status(200).json({ access: access.length > 0 });
      console.log(access);
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Invalid token" });
    }
  },
  setRoleAccess: async (req, res) => {
    try {
      const { roleId } = req.params;
      const { path } = req.body;

      const role = await roleDb.where("roleId", roleId).get();
      if (role.length === 0) {
        throw {
          message: "Role not found.",
        };
      }

      const existingAccess = await accessDb
        .where("roleId", roleId)
        .where("path", path)
        .get();

      if (existingAccess.length < 1) {
        await accessDb.insert({ roleId, path });
        return res.status(200).json({
          title: "Role Access Granted",
          text: "Role access granted successfully.",
          icon: "success",
        });
      } else {
        return res.status(200).json({
          title: "Role Access Already Granted",
          text: "Role already has access to this path.",
          icon: "info",
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ title: "Server error", text: error.message, icon: "error" });
    }
  },
  removeRoleAccess: async (req, res) => {
    try {
      const { roleId } = req.params;
      const { path } = req.body;
      const role = await roleDb.where("roleId", roleId).get();
      if (role.length === 0) {
        throw {
          message: "Role not found.",
        };
      }
      await accessDb.where("roleId", roleId).where("path", path).delete();
      return res.status(200).json({
        title: "Role Access Revoked",
        text: "Role access revoked successfully.",
        icon: "success",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ title: "Server error", text: error.message, icon: "error" });
    }
  },
  getRoleAccess: async (req, res) => {
    try {
      const { roleId } = req.params;
      const role = await roleDb.where("roleId", roleId).get();
      if (role.length === 0) {
        throw {
          message: "Role not found.",
        };
      }
      const access = await accessDb.where("roleId", roleId).get();
      return res.status(200).json({
        title: "Role Access Retrieved",
        text: "Role access retrieved successfully.",
        icon: "success",
        data: access,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ title: "Server error", text: error.message, icon: "error" });
    }
  },
  setSignPermission: async (req, res) => {
    try {
      const { roleId } = req.params;
      const { signPermissions_1, signPermissions_2, signPermissions_3 } =
        req.body;
      const role = await roleDb.where("roleId", roleId).get();
      if (role.length === 0) {
        throw {
          message: "Role not found.",
        };
      }
      await roleDb
        .where("roleId", roleId)
        .update({ signPermissions_1, signPermissions_2, signPermissions_3 });
      return res.status(200).json({
        title: "Sign Permissions Updated",
        text: "Sign permissions updated successfully.",
        icon: "success",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ title: "Server error", text: error.message, icon: "error" });
    }
  },
  getSignPermission: async (req, res) => {
    try {
      const { roleId } = req.params;
      const role = await roleDb.where("roleId", roleId).get();
      if (role.length === 0) {
        throw {
          message: "Role not found.",
        };
      }
      return res.status(200).json({
        title: "Sign Permissions Retrieved",
        text: "Sign permissions retrieved successfully.",
        icon: "success",
        data: {
          signPermissions_1: role[0].signPermissions_1,
          signPermissions_2: role[0].signPermissions_2,
          signPermissions_3: role[0].signPermissions_3,
        },
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ title: "Server error", text: error.message, icon: "error" });
    }
  },
};
