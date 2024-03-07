"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/index.js
const express_1 = require("express");
const user_ts_1 = require("./user.ts"); // Make sure to include the file extension
const router = express_1.default.Router();
router.use('/user', user_ts_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map