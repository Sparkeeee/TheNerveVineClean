var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const herbs = yield prisma.herb.findMany({ where: { name: null, commonName: { not: null } } });
        for (const herb of herbs) {
            yield prisma.herb.update({
                where: { id: herb.id },
                data: { name: herb.commonName }
            });
            console.log(`Migrated commonName to name for herb id ${herb.id}`);
        }
    });
}
main().finally(() => prisma.$disconnect());
