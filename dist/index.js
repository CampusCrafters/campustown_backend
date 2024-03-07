"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// index.ts
require("dotenv/config");
const express_1 = require("express");
const cors_1 = require("cors");
const index_ts_1 = require("./routes/index.ts");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/v1', index_ts_1.default);
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
//# sourceMappingURL=index.js.map