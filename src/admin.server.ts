// @ts-ignore
const AdminJS = require('adminjs');
// @ts-ignore
const AdminJSExpress = require('@adminjs/express');
import express from 'express';
import { PrismaClient } from '@prisma/client';
// @ts-ignore
const AdminJSPrisma = require('@adminjs/prisma');
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
  authenticate: async (email: string, password: string) => {
    if (email === ADMIN.email && password === ADMIN.password) {
      return ADMIN;
    }
    return null;
  },
  cookieName: 'adminjs',
  cookiePassword: 'sessionsecret',
});

app.use(adminJs.options.rootPath, router);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`AdminJS is under http://localhost:${port}${adminJs.options.rootPath}`);
}); 