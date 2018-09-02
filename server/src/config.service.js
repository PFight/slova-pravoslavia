"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
let ConfigService = class ConfigService {
    constructor() {
        this.DATA_DIR = "./data";
        this.CATALOG_FILE = "Catalog.json";
        this.SOURCE_FILE_INFO_FILE = "SourceFileInfo.json";
        this.WORSHIPS_FILE = "Worships.json";
        this.WORSHIP_CONDITIONS_FILE = "WorshipConditions.json";
    }
};
ConfigService = tslib_1.__decorate([
    common_1.Injectable()
], ConfigService);
exports.ConfigService = ConfigService;
//# sourceMappingURL=config.service.js.map