// Plain JavaScript version of the admin server for local admin panel
const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const AdminJSPrisma = require('@adminjs/prisma');
const bodyParser = require('body-parser');

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