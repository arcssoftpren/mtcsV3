require("dotenv").config();
const Crud = require("../helper/crud");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const toolsDb = new Crud("tools");
const headersDb = new Crud("headers");
const ranksDb = new Crud("ranks");
const dataDb = new Crud("toolData");
const logicsDb = new Crud("logics");
const moment = require("moment");

module.exports = {
  addInsItem: async (req, res) => {
    try {
      const { toolId } = req.params;
      const { label } = req.body;
      const data = { toolId, label };
      const insDb = new Crud("inspectionItems");
      await insDb.insert(data);
      return res.status(201).json({
        title: "Inspection Item Added",
        text: "Inspection item added successfully.",
        icon: "success",
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text:
          error.message ||
          "An error occurred while adding the inspection item.",
        icon: "error",
      });
    }
  },
  getInsItems: async (req, res) => {
    try {
      const { toolId } = req.params;
      const insDb = new Crud("inspectionItems");
      const items = await insDb.where("toolId", toolId).get();
      return res.status(200).json({
        title: "Inspection Items Retrieved",
        text: "Inspection items retrieved successfully.",
        icon: "success",
        data: items,
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text:
          error.message ||
          "An error occurred while retrieving the inspection items.",
        icon: "error",
      });
    }
  },
  getInsItemById: async (req, res) => {
    try {
      const { itemId } = req.params;
      const insDb = new Crud("inspectionItems");
      const item = await insDb.where("insId", itemId).get();
      return res.status(200).json({
        title: "Inspection Item Retrieved",
        text: "Inspection item retrieved successfully.",
        icon: "success",
        data: item[0],
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text:
          error.message ||
          "An error occurred while retrieving the inspection items.",
        icon: "error",
      });
    }
  },
  updateInsItem: async (req, res) => {
    try {
      const { itemId } = req.params;
      const insDb = new Crud("inspectionItems");
      await insDb.where("insId", itemId).update(req.body);
      return res.status(200).json({
        title: "Inspection Item Updated",
        text: "Inspection item updated successfully.",
        icon: "success",
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text:
          error.message ||
          "An error occurred while updating the inspection item.",
        icon: "error",
      });
    }
  },
  addMethod: async (req, res) => {
    try {
      const { label, logic, standard, insId, unit } = req.body;
      const methodDb = new Crud("insmethods");
      await methodDb.insert({ insId, label, logic, standard, unit });
      return res.status(201).json({
        title: "Inspection Method Added",
        text: "Inspection method added successfully.",
        icon: "success",
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text: error.message || "An error occurred while adding the method.",
        icon: "error",
      });
    }
  },
  getMethods: async (req, res) => {
    try {
      const { insId } = req.params;
      const methodDb = new Crud("insmethods");
      const methods = await methodDb
        .select("insmethods.*, logics.label as logicLabel")
        .where("insId", insId)
        .join("logics", "logics.id=insmethods.logic", "left")
        .get();
      return res.status(200).json({
        title: "Inspection Methods Retrieved",
        text: "Inspection methods retrieved successfully.",
        icon: "success",
        data: methods,
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text: error.message || "An error occurred while retrieving methods.",
        icon: "error",
      });
    }
  },
  editMethod: async (req, res) => {
    try {
      const { methodId } = req.params;
      const methodDb = new Crud("insmethods");
      await methodDb.where("methodId", methodId).update(req.body);
      return res.status(200).json({
        title: "Inspection Method Updated",
        text: "Inspection method updated successfully.",
        icon: "success",
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text:
          error.message ||
          "An error occurred while updating the inspection method.",
        icon: "error",
      });
    }
  },
  deleteMethod: async (req, res) => {
    try {
      const { methodId } = req.params;
      const methodDb = new Crud("insmethods");
      await methodDb.where("methodId", methodId).delete();
      return res.status(200).json({
        title: "Inspection Method Deleted",
        text: "Inspection method deleted successfully.",
        icon: "success",
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text:
          error.message ||
          "An error occurred while updating the inspection method.",
        icon: "error",
      });
    }
  },
  deleteInsItem: async (req, res) => {
    try {
      const { itemId } = req.params;
      const insDb = new Crud("inspectionItems");
      await insDb.where("insId", itemId).delete();
      return res.status(200).json({
        title: "Inspection Item Deleted",
        text: "Inspection item deleted successfully.",
        icon: "success",
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text:
          error.message ||
          "An error occurred while deleting the inspection item.",
        icon: "error",
      });
    }
  },
  getLogics: async (req, res) => {
    try {
      const logics = await logicsDb.get();
      return res.status(200).json({
        title: "Logics Retrieved",
        text: "Logics retrieved successfully.",
        icon: "success",
        data: logics,
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text: error.message || "An error occurred while retrieving logics.",
        icon: "error",
      });
    }
  },
  getDailyInspections: async (req, res) => {
    try {
      const date = moment().format("YYYY-MM-DD");
      const tools = await toolsDb
        .select("tools.*, ranks.label as rankName, types.label as typeName")
        .join("ranks", "ranks.id=tools.rankId", "left")
        .join("types", "types.id=tools.type", "left")
        .orderBy("tools.type", "ASC")
        .get();
      const inspectionDb = new Crud("inspections");

      let inspections = await Promise.all(
        tools.map(async (tool) => {
          const newinsDb = new Crud("inspections");
          let ins = await newinsDb
            .where("toolId", tool.toolId)
            .where("inspectionDate", date)
            .get();

          const notused = await new Crud("notused")
            .where("toolId", tool.toolId)
            .where("date", date)
            .get();

          const toolDataDb = new Crud("toolData");
          const toolData = await toolDataDb.where("toolId", tool.toolId).get();
          if (ins.length < 1 && notused.length < 1) {
            return {
              toolId: tool.toolId,
              toolName: tool.toolName,
              regNumber: tool.regNumber,
              type: tool.typeName,
              rank: tool.rankName,
              toolData,
              location: toolData.find((d) => d.headerId == 26).value || "-",
              lastCalibrationDate: toolData.find((d) => d.headerId == 29).value
                ? moment(toolData.find((d) => d.headerId == 29).value).format(
                    "DD/MM/YYYY"
                  )
                : "-",
            };
          }
        })
      );
      return res.status(200).json({
        title: "Daily Inspections Retrieved",
        text: "Daily inspections retrieved successfully.",
        icon: "success",
        data: inspections.filter((ins) => ins !== undefined),
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text: error.message || "An error occurred while retrieving logics.",
        icon: "error",
      });
    }
  },
  submitInspection: async (req, res) => {
    try {
      const { toolId } = req.params;
      const { data, abnormalityReport } = req.body;
      let methods = data.methods;
      const inspectionData = {
        toolId: data.toolId,
        inspectionDate: data.inspectionDate,
        inspector: data.inspector,
        judgement: data.judgement,
      };
      const inspectionDb = new Crud("inspections");
      const dupe = await inspectionDb
        .where("toolId", toolId)
        .where("inspectionDate", data.inspectionDate)
        .get();
      if (dupe.length > 0) {
        return res.status(400).json({
          title: "Duplicate Inspection",
          text: "An inspection for this tool on this date already exists.",
          icon: "error",
        });
      } else {
        const insert = await inspectionDb.insert(inspectionData);
        const insId = insert.insertId;
        methods = methods.map((method) => {
          return { ...method, inspectionId: insId };
        });
        const methodDb = new Crud("inspectionresult");
        const dupeMethods = await methodDb.where("inspectionId", insId).get();
        if (dupeMethods.length > 0) {
          return res.status(400).json({
            title: "Duplicate Inspection Methods",
            text: "Inspection methods for this tool on this date already exist.",
            icon: "error",
          });
        } else {
          await methodDb.insertBatch(methods);

          if (abnormalityReport) {
            const abnormalityDb = new Crud("abnormalreport_prod");
            await abnormalityDb.insert(abnormalityReport);
          }

          return res.status(201).json({
            title: "Inspection Submitted",
            text: "Inspection submitted successfully.",
            icon: "success",
          });
        }
      }
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text: error.message || "An error occurred while submitting inspection.",
        icon: "error",
      });
    }
  },
  notused: async (req, res) => {
    try {
      const { toolId, date, inspector } = req.body;
      const db = await new Crud("notused").insert(req.body);
      return res.status(200).json({
        title: "Report Submited",
        message: "The tool are successfully reported as unused.",
        icon: "success",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
  getWeeklyInspections: async (req, res) => {
    try {
      const { startDate, endDate } = req.body;
      const toolsDb = new Crud("tools");
      const tools = await toolsDb
        .select("tools.*, ranks.label as rankName, types.label as typeName")
        .join("ranks", "ranks.id=tools.rankId", "left")
        .join("types", "types.id=tools.type", "left")
        .orderBy("tools.type", "ASC")
        .get();
      let inspections = await Promise.all(
        tools.map(async (tool) => {
          const newinsDb = new Crud("inspections");
          let ins = await newinsDb
            .where("toolId", tool.toolId)
            .where("inspectionDate >=", startDate)
            .where("inspectionDate <=", endDate)
            .get();

          let unused = await new Crud("notused")
            .where("toolId", tool.toolId)
            .where("date>=", startDate)
            .where("date<=", endDate)
            .get();

          await Promise.all(
            unused.map((u) => {
              const insfind = ins.find((e) => e.inspectionDate == u.date);
              if (!insfind) {
                ins.push({
                  toolId: u.toolId,
                  inspectionDate: u.date,
                  inspector: u.inspector,
                  unused: true,
                });
              }
            })
          );

          const weeklyDb = new Crud("weeklyConfirmation");
          const confirmation = await weeklyDb
            .where("toolId", tool.toolId)
            .where("dateRangeStart", startDate)
            .where("dateRangeEnd", endDate)
            .get();

          tool.confirmation = confirmation.length > 0 ? confirmation[0] : null;

          let toolData = new Crud("toolData");

          const toolDataResult = await toolData
            .where("toolId", tool.toolId)
            .where("headerId", 26)
            .get();

          tool.location =
            toolDataResult.length > 0 ? toolDataResult[0].value : "-";

          ins = await Promise.all(
            ins.map(async (i) => {
              const methodDb = new Crud("inspectionresult");
              let methods = await methodDb
                .select(
                  "inspectionresult.*, insmethods.label as methodLabel, insmethods.unit, insmethods.logic, logics.label as logicLabel, insmethods.standard"
                )
                .where("inspectionId", i.id)
                .join(
                  "insmethods",
                  "insmethods.methodId=inspectionresult.methodId",
                  "left"
                )
                .join("logics", "logics.id=insmethods.logic", "left")
                .get();
              i.inspectionDate = moment(i.inspectionDate).format("YYYY-MM-DD");
              return { ...i, methods };
            })
          );

          return {
            ...tool,
            inspections: ins.length > 0 ? ins : unused.length > 0 ? unused : [],
            notused: unused.length > 0,
            notusedData: unused,
          };
        })
      );

      inspections = inspections.flat();
      return res.status(200).json({
        title: "Weekly Inspections Retrieved",
        text: "Weekly inspections retrieved successfully.",
        data: inspections.filter(
          (ins) => ins.inspections.length > 0 && ins.confirmation == null
        ),
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text: error.message || "An error occurred while retrieving logics.",
        icon: "error",
      });
    }
  },
  weeklyConfirm: async (req, res) => {
    try {
      const toolId = req.body.toolId;
      const { dateRangeStart, dateRangeEnd, confirmationDate, confirmator } =
        req.body;
      const weeklyDb = new Crud("weeklyConfirmation");
      const dupe = await weeklyDb
        .where("toolId", toolId)
        .where("dateRangeStart", dateRangeStart)
        .get();
      if (dupe.length > 0) {
        return res.status(400).json({
          title: "Duplicate Confirmation",
          text: "A confirmation for this tool in this date range already exists.",
          icon: "error",
        });
      } else {
        await weeklyDb.insert({
          toolId,
          dateRangeStart,
          dateRangeEnd,
          confirmationDate,
          confirmator,
        });
        return res.status(201).json({
          title: "Inspection Confirmed",
          text: "Inspection confirmed successfully.",
          icon: "success",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        title: "Server Error",
        text: error.message || "An error occurred while confirming report.",
        icon: "error",
      });
    }
  },
  getMonthlyInspections: async (req, res) => {
    try {
      const month = req.body.month;
      const year = moment(month, "YYYY-MM").year();
      const monthNum = moment(month, "YYYY-MM").month(); // 0-based
      const startOfMonth = moment([year, monthNum, 1]);
      const endOfMonth = moment([year, monthNum]).endOf("month");
      let weeks_ = [];
      let current = startOfMonth.clone().startOf("isoWeek"); // Monday of the week containing the 1st
      while (
        current.isBefore(endOfMonth) ||
        current.isSame(endOfMonth, "day")
      ) {
        const weekStart = current.format("YYYY-MM-DD");
        const weekEnd = current.clone().endOf("isoWeek").format("YYYY-MM-DD"); // Sunday
        weeks_.push({ weekStart, weekEnd });
        current.add(1, "week");
      }

      const monthlyDb = new Crud("monthlyConfirmation");
      const monthlyConfirmations = await monthlyDb.where("month", month).get();
      const toolsDb = new Crud("tools");
      const tools = await toolsDb
        .select("tools.*, ranks.label as rankName, types.label as typeName")
        .join("ranks", "ranks.id=tools.rankId", "left")
        .join("types", "types.id=tools.type", "left")
        .orderBy("tools.type", "ASC")
        .get();
      let data = await Promise.all(
        tools.map(async (tool) => {
          tool.inspections = await Promise.all(
            weeks_.map(async (week) => {
              const weeklyDb = new Crud("weeklyConfirmation");
              const confirmation = await weeklyDb
                .select(
                  "weeklyConfirmation.*, inspectors.userName as confirmatorName"
                )
                .where("toolId", tool.toolId)
                .where("dateRangeStart", week.weekStart)
                .join(
                  "users as inspectors",
                  "inspectors.userId=weeklyConfirmation.confirmator",
                  "left"
                )
                .get();

              const inspectionDb = new Crud("inspections");
              const inspections = await inspectionDb
                .select("inspections.*, inspectors.userName as inspectorName")
                .where("toolId", tool.toolId)
                .where("inspectionDate >=", week.weekStart)
                .where("inspectionDate <=", week.weekEnd)
                .join(
                  "users as inspectors",
                  "inspectors.userId=inspections.inspector",
                  "left"
                )
                .get();
              const inspections_ = await Promise.all(
                inspections.map(async (i) => {
                  const methodDb = new Crud("inspectionresult");
                  let methods = await methodDb
                    .where("inspectionId", i.id)
                    .get();
                  i.methods = methods;
                  return i;
                })
              );

              return confirmation.length > 0
                ? {
                    ...confirmation[0],
                    inspections: inspections_.length > 0 ? inspections_ : [],
                  }
                : null;
            })
          );

          tool.unused = await new Crud("notused")
            .where("toolId", tool.toolId)
            .where("date>=", startOfMonth.format("YYYY-MM-DD"))
            .where("date<=", endOfMonth.format("YYYY-MM-DD"))
            .get();

          const toolDataDb = new Crud("toolData");
          const toolDataResult = await toolDataDb
            .where("toolId", tool.toolId)
            .where("headerId", 26)
            .get();

          tool.location =
            toolDataResult.length > 0 ? toolDataResult[0].value : "-";

          const insItemsDb = new Crud("inspectionItems");
          const insItems = await insItemsDb.where("toolId", tool.toolId).get();
          tool.inspectionItems = await Promise.all(
            insItems.map(async (item) => {
              const methodsDb = new Crud("insmethods");
              const methods = await methodsDb.where("insId", item.insId).get();
              return { ...item, methods };
            })
          );

          return tool;
        })
      );
      return res.status(200).json({
        title: "Monthly Inspections Retrieved",
        text: "Monthly inspections retrieved successfully.",
        data: data.filter(
          (d) =>
            monthlyConfirmations.findIndex((mc) => mc.toolId === d.toolId) < 0
        ),
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        title: "Server Error",
        text: error.message || "An error occurred while retrieving logics.",
        icon: "error",
      });
    }
  },
  monthlyConfirm: async (req, res) => {
    try {
      const { toolId, month, confirmationDate, confirmator } = req.body;
      const monthlyDb = new Crud("monthlyConfirmation");
      const existingConfirmation = await monthlyDb
        .where("toolId", toolId)
        .where("month", month)
        .get();

      if (existingConfirmation.length > 0) {
        return res.status(400).json({
          title: "Bad Request",
          text: "Monthly confirmation already exists.",
          icon: "error",
        });
      }

      const newConfirmation = await monthlyDb.insert({
        toolId,
        month,
        confirmationDate,
        confirmator,
      });

      return res.status(201).json({
        title: "Monthly Confirmation Created",
        text: "Monthly confirmation created successfully.",
        data: newConfirmation,
      });
    } catch (error) {
      return res.status(500).json({
        title: "Server Error",
        text:
          error.message ||
          "An error occurred while creating monthly confirmation.",
        icon: "error",
      });
    }
  },
  getAbnormalities_dated: async (req, res) => {
    try {
      const { toolId, startDate, endDate } = req.body;
      const abnormalityDb = new Crud("abnormalreport_prod");
      let abnormalities = await abnormalityDb
        .select(
          "abnormalreport_prod.*, reporters.userName as reporterName, confirmators.userName as confirmatorName, tools.toolName, tools.regNumber"
        )
        .where("abnormalreport_prod.toolId", toolId)
        .where("findingDate >=", startDate)
        .where("findingDate <=", endDate)
        .join(
          "users as reporters",
          "reporters.userId=abnormalreport_prod.reporter",
          "left"
        )
        .join(
          "users as confirmators",
          "confirmators.userId=abnormalreport_prod.confirmator",
          "left"
        )
        .join("tools", "tools.toolId=abnormalreport_prod.toolId")
        .orderBy("findingDate", "DESC")
        .get();
      return res.status(200).json({ data: abnormalities });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        title: "Server Error",
        text:
          error.message || "An error occurred while retrieving abnormalities.",
        icon: "error",
      });
    }
  },
  getAbnormalities: async (req, res) => {
    try {
      const abnormalityDb = new Crud("abnormalreport_prod");
      let abnormalities = await abnormalityDb
        .select(
          "abnormalreport_prod.*, reporters.userName as reporterName, confirmators.userName as confirmatorName, tools.toolName, tools.regNumber"
        )
        .join(
          "users as reporters",
          "reporters.userId=abnormalreport_prod.reporter",
          "left"
        )
        .join(
          "users as confirmators",
          "confirmators.userId=abnormalreport_prod.confirmator",
          "left"
        )
        .join("tools", "tools.toolId=abnormalreport_prod.toolId")
        .orderBy("findingDate", "DESC")
        .get();

      abnormalities = await Promise.all(
        abnormalities.map(async (abn) => {
          const toolDataDb = new Crud("toolData");
          const locationData = await toolDataDb
            .where("toolId", abn.toolId)
            .get();
          return {
            ...abn,
            location:
              locationData.length > 0
                ? locationData.find((d) => d.headerId == 26)?.value
                : "-",
            lastCalibrationDate:
              locationData.length > 0
                ? locationData.find((d) => d.headerId == 29)?.value
                : "-",
          };
        })
      );
      return res.status(200).json({ data: abnormalities });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        title: "Server Error",
        text:
          error.message || "An error occurred while retrieving abnormalities.",
        icon: "error",
      });
    }
  },
  confirmReport: async (req, res) => {
    try {
      const { id, cause, tempActions, confirmator } = req.body;
      const abnormalityDb = new Crud("abnormalreport_prod");
      const data = {
        cause,
        tempActions,
        confirmator,
        confirmationDate: moment().format("YYYY-MM-DD"),
      };
      await abnormalityDb.where("id", id).update(data);
      return res.status(200).json({
        title: "Report Confirmed",
        text: "Abnormality report confirmed successfully.",
        icon: "success",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        title: "Server Error",
        text: error.message || "An error occurred while confirming the report.",
        icon: "error",
      });
    }
  },
  getFinished: async (req, res) => {
    try {
      const month = req.body.month;
      const year = moment(month, "YYYY-MM").year();
      const monthNum = moment(month, "YYYY-MM").month(); // 0-based
      const startOfMonth = moment([year, monthNum, 1]);
      const endOfMonth = moment([year, monthNum]).endOf("month");
      let weeks_ = [];
      let current = startOfMonth.clone().startOf("isoWeek"); // Monday of the week containing the 1st
      while (
        current.isBefore(endOfMonth) ||
        current.isSame(endOfMonth, "day")
      ) {
        const weekStart = current.format("YYYY-MM-DD");
        const weekEnd = current.clone().endOf("isoWeek").format("YYYY-MM-DD"); // Sunday
        weeks_.push({ weekStart, weekEnd });
        current.add(1, "week");
      }

      const monthlyDb = new Crud("monthlyConfirmation");
      monthlyDb.select(
        "monthlyConfirmation.*, users.userName as confirmatorName"
      );
      monthlyDb.join(
        "users",
        "users.userId=monthlyConfirmation.confirmator",
        "left"
      );
      const monthlyConfirmations = await monthlyDb.where("month", month).get();
      const toolsDb = new Crud("tools");
      const tools = await toolsDb
        .select("tools.*, ranks.label as rankName, types.label as typeName")
        .join("ranks", "ranks.id=tools.rankId", "left")
        .join("types", "types.id=tools.type", "left")
        .orderBy("tools.type", "ASC")
        .get();
      let data = await Promise.all(
        tools.map(async (tool) => {
          tool.unused = await new Crud("notused")
            .where("toolId", tool.toolId)
            .where("date>=", startOfMonth.format("YYYY-MM-DD"))
            .where("date<=", endOfMonth.format("YYYY-MM-DD"))
            .get();
          tool.inspections = await Promise.all(
            weeks_.map(async (week) => {
              const weeklyDb = new Crud("weeklyConfirmation");
              const confirmation = await weeklyDb
                .select(
                  "weeklyConfirmation.*, inspectors.userName as confirmatorName"
                )
                .where("toolId", tool.toolId)
                .where("dateRangeStart", week.weekStart)
                .join(
                  "users as inspectors",
                  "inspectors.userId=weeklyConfirmation.confirmator",
                  "left"
                )
                .get();

              const inspectionDb = new Crud("inspections");
              const inspections = await inspectionDb
                .select("inspections.*, inspectors.userName as inspectorName")
                .where("toolId", tool.toolId)
                .where("inspectionDate >=", week.weekStart)
                .where("inspectionDate <=", week.weekEnd)
                .join(
                  "users as inspectors",
                  "inspectors.userId=inspections.inspector",
                  "left"
                )
                .get();
              const inspections_ = await Promise.all(
                inspections.map(async (i) => {
                  const methodDb = new Crud("inspectionresult");
                  let methods = await methodDb
                    .where("inspectionId", i.id)
                    .get();
                  i.methods = methods;
                  return i;
                })
              );

              return confirmation.length > 0
                ? {
                    ...confirmation[0],
                    inspections: inspections_.length > 0 ? inspections_ : [],
                  }
                : null;
            })
          );

          const toolDataDb = new Crud("toolData");
          const toolDataResult = await toolDataDb
            .where("toolId", tool.toolId)
            .where("headerId", 26)
            .get();

          tool.location =
            toolDataResult.length > 0 ? toolDataResult[0].value : "-";

          const insItemsDb = new Crud("inspectionItems");
          const insItems = await insItemsDb.where("toolId", tool.toolId).get();
          tool.inspectionItems = await Promise.all(
            insItems.map(async (item) => {
              const methodsDb = new Crud("insmethods");
              const methods = await methodsDb.where("insId", item.insId).get();
              return { ...item, methods };
            })
          );

          tool.monthlyConf = await Promise.all(
            monthlyConfirmations.map((conf) => {
              if (conf.toolId == tool.toolId) {
                return conf;
              }
            })
          );

          tool.monthlyConf = tool.monthlyConf.find((c) => c);

          return tool;
        })
      );
      console.log(data);
      return res.status(200).json({
        title: "Monthly Inspections Retrieved",
        text: "Monthly inspections retrieved successfully.",
        data: data.filter((d) => d.monthlyConf),
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        title: "Server Error",
        text: error.message || "An error occurred while retrieving logics.",
        icon: "error",
      });
    }
  },
  getAbnPhase: async (req, res) => {
    try {
      const { abId } = req.params;
      const db1 = new Crud("abnormalreport_prod");
      const db2 = new Crud("abnormalreport_phase2");
      const db3 = new Crud("abnormalreport_phase3");
      const db4 = new Crud("abnormalreport_phase4");

      // Get phase 1 data (cause, tempActions, reporter)
      db1.select(
        "abnormalreport_prod.cause, abnormalreport_prod.tempActions, abnormalreport_prod.reporter, users.userName as reporterName"
      );
      db1.join("users", "users.userId = abnormalreport_prod.reporter", "left");
      const data1 = await db1.where("abnormalreport_prod.id", abId).get();

      db2.select(
        "abnormalreport_phase2.*, qcPICUser.userName as qcPICName, qcMgrUser.userName as qcMgrName"
      );
      db2.join(
        "users as qcPICUser",
        "qcPICUser.userId = abnormalreport_phase2.qcPIC",
        "left"
      );
      db2.join(
        "users as qcMgrUser",
        "qcMgrUser.userId = abnormalreport_phase2.qcMgr",
        "left"
      );
      const data2 = await db2.where("abId", abId).get();

      db3.select(
        "abnormalreport_phase3.*, users.userName as prodConfirmatorName"
      );
      db3.join(
        "users",
        "users.userId = abnormalreport_phase3.prodConfirmator",
        "left"
      );
      const data3 = await db3.where("abId", abId).get();

      db4.select(
        "abnormalreport_phase4.id, abnormalreport_phase4.abId, abnormalreport_phase4.qcConfirmNote, " +
          "abnormalreport_phase4.qcMgr as qcMgr4, abnormalreport_phase4.qcMgrDate as qcMgr4Date, " +
          "abnormalreport_phase4.qcConfirmator, abnormalreport_phase4.qcConfirmDate, " +
          "qcMgrUser4.userName as qcMgr4Name, qcConfUser.userName as qcConfirmatorName"
      );
      db4.join(
        "users as qcMgrUser4",
        "qcMgrUser4.userId = abnormalreport_phase4.qcMgr",
        "left"
      );
      db4.join(
        "users as qcConfUser",
        "qcConfUser.userId = abnormalreport_phase4.qcConfirmator",
        "left"
      );
      const data4 = await db4.where("abId", abId).get();

      const result = {
        ...(data1.length > 0 ? data1[0] : {}),
        ...(data2.length > 0 ? data2[0] : {}),
        ...(data3.length > 0 ? data3[0] : {}),
        ...(data4.length > 0 ? data4[0] : {}),
      };

      return res.status(200).json({
        title: "Data Retrieved",
        text: "Data retrieved successfully.",
        data: Object.keys(result).length > 0 ? result : null,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        title: "Server Error",
        text: error.message || "An error occurred while retrieving logics.",
        icon: "error",
      });
    }
  },
  abConfirm2: async (req, res) => {
    try {
      const { abId, actToProducts, actToTools, qcActionNote, qcPIC, qcMgr } =
        req.body;
      const db = new Crud("abnormalreport_phase2");

      // Check if record exists
      const existing = await db.where("abId", abId).get();

      if (existing.length > 0) {
        // Update existing record
        const updateData = {};
        if (qcPIC) {
          updateData.qcPIC = qcPIC;
          updateData.qcActionDate = moment().format("YYYY-MM-DD");
        }
        if (qcMgr) {
          updateData.qcMgr = qcMgr;
          updateData.qcMgrDate = moment().format("YYYY-MM-DD");
        }
        await db.where("abId", abId).update(updateData);
      } else {
        // Insert new record
        await db.insert({
          abId,
          actToProducts,
          actToTools: Array.isArray(actToTools)
            ? actToTools.join(",")
            : actToTools,
          qcActionNote,
          qcPIC: qcPIC || null,
          qcActionDate: qcPIC ? moment().format("YYYY-MM-DD") : null,
          qcMgr: qcMgr || null,
          qcMgrDate: qcMgr ? moment().format("YYYY-MM-DD") : null,
        });
      }

      return res.status(200).json({
        title: "Confirmation Successful",
        text: "QC action has been submitted successfully.",
        icon: "success",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        title: "Server Error",
        text: error.message || "An error occurred while confirming the report.",
        icon: "error",
      });
    }
  },
  abConfirm3: async (req, res) => {
    try {
      const { abId, prodConfirmNote, prodConfirmator } = req.body;
      const db = new Crud("abnormalreport_phase3");
      await db.insert({
        abId,
        prodConfirmNote,
        prodConfirmator,
        prodConfirmDate: moment().format("YYYY-MM-DD"),
      });
      return res.status(200).json({
        title: "Confirmation Successful",
        text: "Production confirmation has been submitted successfully.",
        icon: "success",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        title: "Server Error",
        text: error.message || "An error occurred while confirming the report.",
        icon: "error",
      });
    }
  },
  abConfirm4: async (req, res) => {
    try {
      const { abId, qcConfirmNote, qcMgr, qcConfirmator } = req.body;
      const db = new Crud("abnormalreport_phase4");

      // Check if record exists
      const existing = await db.where("abId", abId).get();

      if (existing.length > 0) {
        // Update existing record
        const updateData = {};
        if (qcMgr) {
          updateData.qcMgr = qcMgr;
          updateData.qcMgrDate = moment().format("YYYY-MM-DD");
        }
        if (qcConfirmator) {
          updateData.qcConfirmator = qcConfirmator;
          updateData.qcConfirmDate = moment().format("YYYY-MM-DD");
        }
        await db.where("abId", abId).update(updateData);

        // Check if both signatures are complete
        const updated = await db.where("abId", abId).get();
        if (updated[0].qcMgr && updated[0].qcConfirmator) {
          // Update status to closed (1) in abnormalreport_prod
          const abnormalDb = new Crud("abnormalreport_prod");
          await abnormalDb.where("id", abId).update({ status: 1 });
        }
      } else {
        // Insert new record
        await db.insert({
          abId,
          qcConfirmNote,
          qcMgr: qcMgr || null,
          qcMgrDate: qcMgr ? moment().format("YYYY-MM-DD") : null,
          qcConfirmator: qcConfirmator || null,
          qcConfirmDate: qcConfirmator ? moment().format("YYYY-MM-DD") : null,
        });

        // Check if both signatures are complete on insert
        if (qcMgr && qcConfirmator) {
          const abnormalDb = new Crud("abnormalreport_prod");
          await abnormalDb.where("id", abId).update({ status: 1 });
        }
      }

      return res.status(200).json({
        title: "Confirmation Successful",
        text: "QC confirmation has been submitted successfully.",
        icon: "success",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        title: "Server Error",
        text: error.message || "An error occurred while confirming the report.",
        icon: "error",
      });
    }
  },
};
