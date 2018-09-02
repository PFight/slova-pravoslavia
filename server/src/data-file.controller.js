"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const data_file_service_1 = require("./data-file.service");
let DataFileController = class DataFileController {
    constructor(data) {
        this.data = data;
    }
    getCatalog() {
        return this.data.getCatalog();
    }
    saveCatalog(catalog) {
        this.data.saveCatalog(catalog);
    }
    getSourceFileInfo() {
        return this.data.getSourceFileInfo();
    }
    saveSourceFileInfo(info) {
        this.data.saveSourceFileInfo(info);
    }
    getWorships() {
        return this.data.getWorships();
    }
    getWorship(id) {
        return this.data.getWorship(id);
    }
    saveWorship(worship) {
        this.data.saveWorship(worship);
    }
    getWorshipConditions() {
        return this.data.getWorshipConditions();
    }
    saveWorshipConditions(conditions) {
        this.data.saveWorshipConditions(conditions);
    }
};
tslib_1.__decorate([
    common_1.Get('getCatalog'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Array)
], DataFileController.prototype, "getCatalog", null);
tslib_1.__decorate([
    common_1.Put('saveCatalog'), tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Array]),
    tslib_1.__metadata("design:returntype", void 0)
], DataFileController.prototype, "saveCatalog", null);
tslib_1.__decorate([
    common_1.Get('getSourceFileInfo'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Array)
], DataFileController.prototype, "getSourceFileInfo", null);
tslib_1.__decorate([
    common_1.Put('saveSourceFileInfo'), tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Array]),
    tslib_1.__metadata("design:returntype", void 0)
], DataFileController.prototype, "saveSourceFileInfo", null);
tslib_1.__decorate([
    common_1.Get('getWorships'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Array)
], DataFileController.prototype, "getWorships", null);
tslib_1.__decorate([
    common_1.Get('getWorship/:id'), tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Object)
], DataFileController.prototype, "getWorship", null);
tslib_1.__decorate([
    common_1.Put('saveWorship'), tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], DataFileController.prototype, "saveWorship", null);
tslib_1.__decorate([
    common_1.Get('getWorshipConditions'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Array)
], DataFileController.prototype, "getWorshipConditions", null);
tslib_1.__decorate([
    common_1.Put('saveWorshipConditions'), tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Array]),
    tslib_1.__metadata("design:returntype", void 0)
], DataFileController.prototype, "saveWorshipConditions", null);
DataFileController = tslib_1.__decorate([
    common_1.Controller('DataFile'),
    tslib_1.__metadata("design:paramtypes", [data_file_service_1.DataFileService])
], DataFileController);
exports.DataFileController = DataFileController;
//# sourceMappingURL=data-file.controller.js.map