"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
function bootstrap() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors({
            origin: "*"
        });
        app.useStaticAssets(path_1.join(__dirname, '..', 'data', 'sources'));
        yield app.listen(3000);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map