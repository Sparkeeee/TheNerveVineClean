var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import AdminJS from 'adminjs';
// @ts-expect-error import compatibility
import AdminJSExpress from '@adminjs/express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
// @ts-expect-error import compatibility
import AdminJSPrisma from '@adminjs/prisma';
import bodyParser from 'body-parser';
AdminJS.registerAdapter({ Resource: AdminJSPrisma.Resource, Database: AdminJSPrisma.Database });
const prisma = new PrismaClient();
const adminJs = new AdminJS({
    databases: [prisma],
    rootPath: '/admin',
});
const app = express();
app.use(bodyParser.json());
const ADMIN = {
    email: 'admin',
    password: 'herbsecure',
};
const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
    authenticate: (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        if (email === ADMIN.email && password === ADMIN.password) {
            return ADMIN;
        }
        return null;
    }),
    cookieName: 'adminjs',
    cookiePassword: 'sessionsecret',
});
app.use(adminJs.options.rootPath, router);
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`AdminJS is under http://localhost:${port}${adminJs.options.rootPath}`);
});
