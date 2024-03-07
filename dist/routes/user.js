"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Sign in
router.post('/signin', async (req, res) => {
    console.log('signed in successfully');
});
exports.default = router;
//# sourceMappingURL=user.js.map