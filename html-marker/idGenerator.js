"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IdGenerator {
    constructor() {
        this.current = 0;
    }
    next() {
        this.current++;
        return 'n' + this.current.toString();
    }
}
exports.IdGenerator = IdGenerator;
