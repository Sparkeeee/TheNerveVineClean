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
var prisma = new client_1.PrismaClient();
function updateHerbDescriptions() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, herbs_2, herb, updatedHerb, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Updating herb descriptions with rich content...');
                    _i = 0, herbs_2 = herbs_1.herbs;
                    _a.label = 1;
                case 1:
                    if (!(_i < herbs_2.length)) return [3 /*break*/, 6];
                    herb = herbs_2[_i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, prisma.herb.update({
                            where: { name: herb.name },
                            data: {
                                description: herb.description,
                                metaTitle: herb.metaTitle,
                                metaDescription: herb.metaDescription,
                                heroImageUrl: herb.heroImageUrl,
                                cardImageUrl: herb.cardImageUrl,
                                galleryImages: herb.galleryImages,
                                cautions: herb.cautions,
                                productFormulations: herb.productFormulations,
                                references: herb.references,
                                indications: herb.indications,
                                traditionalUses: herb.traditionalUses,
                                latinName: herb.latinName,
                            },
                        })];
                case 3:
                    updatedHerb = _a.sent();
                    console.log("Updated herb: ".concat(herb.name));
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    console.error("Failed to update herb: ".concat(herb.name), e_1);
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
                case 0: return [4 /*yield*/, updateHerbDescriptions()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, prisma.$disconnect()];
                case 2:
                    _a.sent();
                    console.log('Herb descriptions update complete!');
                    return [2 /*return*/];
            }
        });
    });
}
main();
