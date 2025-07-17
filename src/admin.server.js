// Plain JavaScript version of the admin server for local admin panel
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
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
  authenticate: async (email, password) => {
    if (email === ADMIN.email && password === ADMIN.password) {
      return ADMIN;
    }
    return null;
  },
  cookieName: 'adminjs',
  cookiePassword: 'sessionsecret',
});

app.use(adminJs.options.rootPath, router);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`AdminJS is under http://localhost:${PORT}/admin`);
}); 