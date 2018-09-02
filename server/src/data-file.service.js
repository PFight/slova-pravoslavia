"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_service_1 = require("./config.service");
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
let DataFileService = class DataFileService {
    constructor(config) {
        this.config = config;
    }
    getCatalog() {
        return this.readFile(this.config.CATALOG_FILE, "[]");
    }
    saveCatalog(catalog) {
        this.writeFile(this.config.CATALOG_FILE, catalog);
    }
    getSourceFileInfo() {
        return this.readFile(this.config.SOURCE_FILE_INFO_FILE, "[]");
    }
    saveSourceFileInfo(info) {
        this.writeFile(this.config.SOURCE_FILE_INFO_FILE, info);
    }
    getWorships() {
        let worships = this.readFile(this.config.WORSHIPS_FILE, "[]");
        worships.forEach(x => delete x.nodes);
        return worships;
    }
    getWorship(id) {
        let worships = this.readFile(this.config.WORSHIPS_FILE, "[]");
        let result = worships.find(x => x.id == id);
        return result;
    }
    saveWorship(worship) {
        let worships = this.readFile(this.config.WORSHIPS_FILE, "[]");
        let index = worships.findIndex(x => x.id == worship.id);
        if (index >= 0) {
            worships[index] = worship;
        }
        else {
            worships.push(worship);
        }
        this.writeFile(this.config.WORSHIPS_FILE, worships);
    }
    getWorshipConditions() {
        return this.readFile(this.config.WORSHIP_CONDITIONS_FILE, "[]");
    }
    saveWorshipConditions(conditions) {
        this.writeFile(this.config.WORSHIP_CONDITIONS_FILE, conditions);
    }
    readFile(fileName, defaultContent) {
        let fullName = path.join(this.config.DATA_DIR, fileName);
        if (!fs.existsSync(fullName)) {
            fs.writeFileSync(fullName, defaultContent);
        }
        let strContent = fs.readFileSync(fullName, "utf-8");
        return JSON.parse(strContent);
    }
    writeFile(fileName, data) {
        let fullName = path.join(this.config.DATA_DIR, fileName);
        let strContent = JSON.stringify(data, undefined, 2);
        fs.writeFileSync(fullName, strContent);
    }
};
DataFileService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [config_service_1.ConfigService])
], DataFileService);
exports.DataFileService = DataFileService;
//# sourceMappingURL=data-file.service.js.map