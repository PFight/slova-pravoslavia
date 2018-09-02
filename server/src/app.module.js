"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const data_file_controller_1 = require("./data-file.controller");
const data_file_service_1 = require("./data-file.service");
const config_service_1 = require("./config.service");
let AppModule = class AppModule {
};
AppModule = tslib_1.__decorate([
    common_1.Module({
        controllers: [data_file_controller_1.DataFileController],
        providers: [config_service_1.ConfigService, data_file_service_1.DataFileService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map