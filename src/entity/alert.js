"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alert = void 0;
const typeorm_1 = require("typeorm");
const Company_1 = require("./Company");
const user_1 = require("./user");
let Alert = class Alert extends typeorm_1.BaseEntity {
};
exports.Alert = Alert;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Alert.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Alert.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Alert.prototype, "shouldBeLower", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_1.User),
    __metadata("design:type", user_1.User)
], Alert.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Company_1.Company),
    __metadata("design:type", Company_1.Company)
], Alert.prototype, "company", void 0);
exports.Alert = Alert = __decorate([
    (0, typeorm_1.Entity)()
], Alert);
