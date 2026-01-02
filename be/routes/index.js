const express = require("express");
const router = express.Router();
const validateJWT = require("../helper/jwtValidation.js");

const authController = require("../controllers/authController");
const accessController = require("../controllers/accessController.js");
const toolsController = require("../controllers/toolsController.js");
const inspectionControllers = require("../controllers/inspectionControllers");

// auth routes
router.post("/login", authController.login);
router.post("/users", validateJWT, authController.createUser);
router.get("/users/:userId", validateJWT, authController.getUserById);
router.get("/users", validateJWT, authController.getUsers);
router.put("/users/:userId", validateJWT, authController.updateUser);
router.delete("/users/:userId", validateJWT, authController.deleteUser);
router.get("/users/:userId/signature", validateJWT, authController.getSignFile);
router.post(
  "/users/:userId/signature",
  validateJWT,
  authController.setSignFile
);

// role routes
router.post("/roles", validateJWT, authController.createRole);
router.get("/roles", validateJWT, authController.getRoles);
router.put("/roles/:roleId", validateJWT, authController.updateRole);
router.delete("/roles/:roleId", validateJWT, authController.deleteRole);
router.get("/roles/:roleId", validateJWT, authController.getRoleById);

// access routes
router.put("/access/:roleId", validateJWT, accessController.setRoleAccess);
router.post("/access", validateJWT, accessController.getAccess);
router.delete(
  "/access/:roleId",
  validateJWT,
  accessController.removeRoleAccess
);
router.get("/access/:roleId", validateJWT, accessController.getRoleAccess);

// tools routes
router.get("/tools", validateJWT, toolsController.getTools);
router.post("/tools", validateJWT, toolsController.createTool);
router.put("/tools/:toolId", validateJWT, toolsController.updateTool);
router.delete("/tools/:toolId", validateJWT, toolsController.deleteTool);
router.get("/tools/:toolId", validateJWT, toolsController.getToolById);
router.post("/types", validateJWT, toolsController.createType);
router.get("/types", validateJWT, toolsController.getTypes);
router.put("/types/:typeId", validateJWT, toolsController.editType);
router.delete("/types/:typeId", validateJWT, toolsController.deleteType);
router.get("/types/:typeId", validateJWT, toolsController.getTypeById);
router.get("/ranks", validateJWT, toolsController.getRanks);
router.get("/ranks/:rankId", validateJWT, toolsController.getRankById);
router.get("/tools/image/:toolId", validateJWT, toolsController.getToolImage);
router.post("/tools/image/:toolId", validateJWT, toolsController.setToolImage);
router.post("/tools/data/:toolId", validateJWT, toolsController.setToolData);

// inspection item routes
router.post(
  "/inspections/:toolId/insitems",
  validateJWT,
  inspectionControllers.addInsItem
);
router.get(
  "/inspections/:toolId/insitems",
  validateJWT,
  inspectionControllers.getInsItems
);
router.get(
  "/inspections/insitems/:itemId",
  validateJWT,
  inspectionControllers.getInsItemById
);
router.put(
  "/inspections/:itemId/insitems",
  validateJWT,
  inspectionControllers.updateInsItem
);
router.post(
  "/inspections/methods",
  validateJWT,
  inspectionControllers.addMethod
);
router.get(
  "/inspections/:insId/methods",
  validateJWT,
  inspectionControllers.getMethods
);
router.put(
  "/inspections/methods/:methodId",
  validateJWT,
  inspectionControllers.editMethod
);
router.delete(
  "/inspections/methods/:methodId",
  validateJWT,
  inspectionControllers.deleteMethod
);
router.delete(
  "/inspections/insitems/:itemId",
  validateJWT,
  inspectionControllers.deleteInsItem
);
router.get("/inspections/logics", validateJWT, inspectionControllers.getLogics);
router.get(
  "/inspections/daily",
  validateJWT,
  inspectionControllers.getDailyInspections
);
router.post("/inspections/notused", validateJWT, inspectionControllers.notused);
router.post(
  "/inspections/daily/:toolId",
  validateJWT,
  inspectionControllers.submitInspection
);
router.post(
  "/inspections/weekly",
  validateJWT,
  inspectionControllers.getWeeklyInspections
);
router.post(
  "/inspections/weekly/confirm",
  validateJWT,
  inspectionControllers.weeklyConfirm
);

router.post(
  "/inspections/monthly",
  validateJWT,
  inspectionControllers.getMonthlyInspections
);

router.post(
  "/inspections/monthly/confirm",
  validateJWT,
  inspectionControllers.monthlyConfirm
);
router.post(
  "/inspections/abnormalities_dated",
  validateJWT,
  inspectionControllers.getAbnormalities_dated
);
router.get(
  "/inspections/abnormalities",
  validateJWT,
  inspectionControllers.getAbnormalities
);
router.post(
  "/inspections/abnormalities/confirm",
  validateJWT,
  inspectionControllers.confirmReport
);
router.post(
  "/inspection/finished",
  validateJWT,
  inspectionControllers.getFinished
);

router.post(
  "/inspections/abnormalities/phase2",
  validateJWT,
  inspectionControllers.abConfirm2
);

router.post(
  "/inspections/abnormalities/phase3",
  validateJWT,
  inspectionControllers.abConfirm3
);

router.post(
  "/inspections/abnormalities/phase4",
  validateJWT,
  inspectionControllers.abConfirm4
);

router.get(
  "/inspections/abnormalities/getPhase/:abId",
  validateJWT,
  inspectionControllers.getAbnPhase
);

router.put(
  "/roles/:roleId/signPermissions",
  validateJWT,
  accessController.setSignPermission
);

router.get(
  "/roles/:roleId/signPermissions",
  validateJWT,
  accessController.getSignPermission
);

module.exports = router;
