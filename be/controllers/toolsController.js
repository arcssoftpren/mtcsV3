require("dotenv").config();
const Crud = require("../helper/crud");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const toolsDb = new Crud("tools");
const headersDb = new Crud("headers");
const ranksDb = new Crud("ranks");
const dataDb = new Crud("toolData");
const fs = require("fs");
const path = require("path");

module.exports = {
  getTools: async (req, res) => {
    try {
      let tools = await toolsDb
        .select([
          "tools.*",
          "types.label as typeName",
          "ranks.label as rankName",
          "ranks.headers",
        ])
        .join("types", "types.id=tools.type", "LEFT")
        .join("ranks", "ranks.id=tools.rankId", "LEFT")
        .get();

      tools = await Promise.all(
        tools.map(async (tool) => {
          const dataDbnew = new Crud("toolData");
          dataDbnew.where("toolId", tool.toolId);
          console.log(dataDbnew.buildQuery());
          const data = await dataDbnew.get();
          const headerIds = await Promise.all(data.map((d) => d.headerId));
          let headers = await headersDb.whereIn("id", headerIds).get();
          headers = await Promise.all(
            headers.map(async (header) => {
              header.value =
                data.find((d) => d.headerId === header.id).value || "";
              return header;
            })
          );
          return {
            ...tool,
            headers: headers,
          };
        })
      );

      res.status(200).json({
        title: "Tools Retrieved",
        text: "Tools list retrieved successfully.",
        icon: "success",
        data: tools,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  createTool: async (req, res) => {
    try {
      const { regNumber } = req.body;
      const existingTool = await toolsDb.where("regNumber", regNumber).get();
      if (existingTool.length > 0) {
        return res.status(400).json({
          title: "Validation Error",
          text: "Tool with this registration number already exists.",
          icon: "error",
        });
      }
      let insert = await toolsDb.insert(req.body);
      const insertedId = insert.insertId;
      const rank = await ranksDb.where("id", req.body.rankId).get();
      let headers = JSON.parse(rank[0].headers);
      const headerData = await headersDb.whereIn("id", headers).get();

      await Promise.all(
        headerData.map(async (header) => {
          await dataDb.insert({
            toolId: insertedId,
            headerId: header.id,
          });
        })
      );

      return res.status(201).json({
        title: "Tool Created",
        text: "Tool created successfully.",
        icon: "success",
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text: error.message || "An error occurred while creating the tool.",
        icon: "error",
      });
    }
  },
  updateTool: async (req, res) => {
    try {
      const { toolId } = req.params;
      const { regNumber, toolName, rankId, status } = req.body;
      await toolsDb.where("toolId", toolId).update({
        regNumber,
        toolName,
        rankId,
        status,
      });

      return res.status(200).json({
        title: "Tool Updated",
        text: "Tool updated successfully.",
        icon: "success",
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text: error.message || "An error occurred while updating the tool.",
        icon: "error",
      });
    }
  },
  deleteTool: async (req, res) => {
    try {
      const { toolId } = req.params;
      await toolsDb.where("toolId", toolId).delete();

      const fileName = `tool_${toolId}.png`;
      const imagePath = path.join(__dirname, "..", "uploads/tools", fileName);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      return res.status(200).json({
        title: "Tool Deleted",
        text: "Tool deleted successfully.",
        icon: "success",
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text: error.message || "An error occurred while deleting the tool.",
        icon: "error",
      });
    }
  },
  getToolById: async (req, res) => {
    try {
      const { toolId } = req.params;
      let tool = await toolsDb.where("toolId", toolId).get();
      if (tool.length === 0) {
        return res.status(404).json({
          title: "Not Found",
          text: "Tool not found.",
          icon: "error",
        });
      }
      res.status(200).json({
        title: "Tool Retrieved",
        text: "Tool retrieved successfully.",
        icon: "success",
        data: tool[0],
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text: error.message || "An error occurred while retrieving the tool.",
        icon: "error",
      });
    }
  },
  createType: async (req, res) => {
    try {
      const { label } = req.body;
      const typeDb = new Crud("types");
      const existingType = await typeDb.where("label", label).get();
      if (existingType.length > 0) {
        return res.status(400).json({
          title: "Validation Error",
          text: "Type with this label already exists.",
          icon: "error",
        });
      }
      await typeDb.insert({ label });
      return res.status(201).json({
        title: "Type Created",
        text: "Type created successfully.",
        icon: "success",
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text: error.message || "An error occurred while creating the type.",
        icon: "error",
      });
    }
  },
  getTypes: async (req, res) => {
    try {
      const typeDb = new Crud("types");
      const types = await typeDb.get();
      return res.status(200).json({
        title: "Types Retrieved",
        text: "Types retrieved successfully.",
        icon: "success",
        data: types,
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text: error.message || "An error occurred while retrieving types.",
        icon: "error",
      });
    }
  },
  editType: async (req, res) => {
    try {
      const { typeId } = req.params;
      const { label } = req.body;
      const typeDb = new Crud("types");
      await typeDb.where("id", typeId).update({ label });
      return res.status(200).json({
        title: "Type Updated",
        text: "Type updated successfully.",
        icon: "success",
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text: error.message || "An error occurred while editing the type.",
        icon: "error",
      });
    }
  },
  deleteType: async (req, res) => {
    try {
      const { typeId } = req.params;
      const typeDb = new Crud("types");
      await typeDb.where("id", typeId).delete();
      return res.status(200).json({
        title: "Type Deleted",
        text: "Type deleted successfully.",
        icon: "success",
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text: error.message || "An error occurred while deleting the type.",
        icon: "error",
      });
    }
  },
  getTypeById: async (req, res) => {
    try {
      const { typeId } = req.params;
      const typeDb = new Crud("types");
      const type = await typeDb.where("id", typeId).get();
      if (type.length === 0) {
        return res.status(404).json({
          title: "Not Found",
          text: "Type not found.",
          icon: "error",
        });
      }
      return res.status(200).json({
        title: "Type Retrieved",
        text: "Type retrieved successfully.",
        icon: "success",
        data: type[0],
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text: error.message || "An error occurred while retrieving the type.",
        icon: "error",
      });
    }
  },
  getRanks: async (req, res) => {
    try {
      const ranks = await ranksDb.get();
      return res.status(200).json({
        title: "Ranks Retrieved",
        text: "Ranks retrieved successfully.",
        icon: "success",
        data: ranks,
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text: error.message || "An error occurred while retrieving ranks.",
        icon: "error",
      });
    }
  },
  getRankById: async (req, res) => {
    try {
      const { rankId } = req.params;
      const rank = await ranksDb.where("id", rankId).get();
      if (rank.length === 0) {
        return res.status(404).json({
          title: "Not Found",
          text: "Rank not found.",
          icon: "error",
        });
      }
      return res.status(200).json({
        title: "Rank Retrieved",
        text: "Rank retrieved successfully.",
        icon: "success",
        data: rank[0],
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text: error.message || "An error occurred while retrieving the rank.",
        icon: "error",
      });
    }
  },
  setToolImage: async (req, res) => {
    try {
      const { toolId } = req.params;
      const image = req.files["image"];
      if (!image) {
        throw {
          title: "Validation Error",
          text: "No image file uploaded.",
          icon: "error",
        };
      }
      const fileName = `tool_${toolId}.png`;
      const imagePath = path.join(__dirname, "..", "uploads/tools", fileName);
      fs.writeFileSync(imagePath, image.data);
      return res.status(200).json({
        title: "Tool Image Set",
        text: "Tool image set successfully.",
        icon: "success",
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text:
          error.message || "An error occurred while setting the tool image.",
        icon: "error",
      });
    }
  },
  getToolImage: async (req, res) => {
    try {
      const { toolId } = req.params;
      const fileName = `tool_${toolId}.png`;
      const imagePath = path.join(__dirname, "..", "uploads/tools", fileName);
      if (!fs.existsSync(imagePath)) {
        return res.status(404).json({
          title: "Not Found",
          text: "Tool image not found.",
          icon: "error",
        });
      }
      const image = fs.readFileSync(imagePath, {
        encoding: "base64",
      });
      return res.status(200).json({
        title: "Tool Image Retrieved",
        text: "Tool image retrieved successfully.",
        icon: "success",
        data: image,
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text:
          error.message || "An error occurred while retrieving the tool image.",
        icon: "error",
      });
    }
  },
  setToolData: async (req, res) => {
    try {
      const { toolId } = req.params;
      const { data } = req.body;
      await Promise.all(
        data.map(async (item) => {
          const dataDb_new = new Crud("toolData");
          await dataDb_new
            .where("toolId", toolId)
            .where("headerId", item.id)
            .update({ value: item.value });
        })
      );
      return res.status(200).json({
        title: "Tool Data Set",
        text: "Tool data set successfully.",
        icon: "success",
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text: error.message || "An error occurred while setting the tool data.",
        icon: "error",
      });
    }
  },
};
