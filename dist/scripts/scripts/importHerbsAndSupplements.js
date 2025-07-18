"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var herbs_1 = require("../data/herbs");
var page_1 = require("../app/supplements/[slug]/page");
var prisma = new client_1.PrismaClient();
function importHerbs() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, herbData_1, herb, e_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0, herbData_1 = herbs_1.herbs;
                    _b.label = 1;
                case 1:
                    if (!(_i < herbData_1.length)) return [3 /*break*/, 6];
                    herb = herbData_1[_i];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, prisma.herb.create({
                            data: {
                                commonName: herb.name,
                                slug: herb.slug,
                                description: herb.description,
                                heroImageUrl: herb.image,
                                cardImageUrl: herb.image,
                                metaTitle: herb.name,
                                metaDescription: ((_a = herb.description) === null || _a === void 0 ? void 0 : _a.slice(0, 150)) || undefined,
                                galleryImages: herb.image ? [herb.image] : undefined,
                                cautions: herb.safety,
                                productFormulations: herb.preparation ? [herb.preparation] : undefined,
                                references: herb.traditionalUses ? herb.traditionalUses.map(function (t) { return ({ type: 'traditional', value: t }); }) : undefined,
                            },
                        })];
                case 3:
                    _b.sent();
                    console.log("Imported herb: ".concat(herb.name));
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _b.sent();
                    console.error("Failed to import herb: ".concat(herb.name), e_1);
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function importSupplements() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, _b, slug, supp, e_2;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _i = 0, _a = Object.entries(page_1.supplements);
                    _d.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    _b = _a[_i], slug = _b[0], supp = _b[1];
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, prisma.supplement.create({
                            data: {
                                name: supp.title,
                                slug: slug,
                                description: supp.description,
                                metaTitle: supp.title,
                                metaDescription: ((_c = supp.description) === null || _c === void 0 ? void 0 : _c.slice(0, 150)) || undefined,
                                cautions: supp.sideEffects,
                                productFormulations: supp.dosage ? [supp.dosage] : undefined,
                                references: supp.benefits ? supp.benefits.map(function (b) { return ({ type: 'benefit', value: b }); }) : undefined,
                                cardImageUrl: undefined,
                                heroImageUrl: undefined,
                                galleryImages: undefined,
                                organic: undefined,
                                strength: undefined,
                                formulation: undefined,
                                affiliatePercentage: undefined,
                                customerReviews: undefined,
                            },
                        })];
                case 3:
                    _d.sent();
                    console.log("Imported supplement: ".concat(supp.title));
                    return [3 /*break*/, 5];
                case 4:
                    e_2 = _d.sent();
                    console.error("Failed to import supplement: ".concat(supp.title), e_2);
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, importHerbs()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, importSupplements()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, prisma.$disconnect()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main();
