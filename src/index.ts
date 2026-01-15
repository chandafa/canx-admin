#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';

const program = new Command();

program
  .name('canx-admin')
  .description('CanxJS Admin Panel Generator')
  .version('0.0.1');

program
  .command('make:admin')
  .description('Generate Admin CRUD for a model with optional fields')
  .argument('<model>', 'Name of the model (e.g., User)')
  .argument('[fields...]', 'Fields for the table (format: name:type e.g. title:string is_active:boolean)')
  .action(async (modelName, fieldArgs) => {
    // 0. Parse Fields
    const fields = (fieldArgs || []).map((arg: string) => {
        const [name, type] = arg.split(':');
        return { name, type: type || 'string' };
    });

    // 1. Setup paths
    const cwd = process.cwd();
    const controllerPath = path.join(cwd, 'src', 'app', 'controllers', 'Admin', `${modelName}Controller.ts`);
    const viewDir = path.join(cwd, 'src', 'resources', 'views', 'admin', `${modelName.toLowerCase()}s`);
    const viewPath = path.join(viewDir, 'index.tsx');

    console.log(chalk.blue(`🚀 Generating Admin Panel for: ${modelName}`));
    if (fields.length > 0) {
        console.log(chalk.gray(`   Detected fields: ${fields.map((f: any) => f.name).join(', ')}`));
    }

    // 2. Import Templates
    const { controllerTemplate } = require('./templates/controller');
    const { viewTemplate } = require('./templates/view');

    // 3. Create Controller
    try {
        await fs.ensureDir(path.dirname(controllerPath));
        if (await fs.pathExists(controllerPath)) {
            console.log(chalk.yellow(`   ⚠️  Controller already exists: ${controllerPath}`));
        } else {
            await fs.writeFile(controllerPath, controllerTemplate(modelName));
            console.log(chalk.green(`   ✅ Created Controller: src/app/controllers/Admin/${modelName}Controller.ts`));
        }
    } catch (error) {
        console.error(chalk.red("   ❌ Error creating controller:"), error);
    }

    // 4. Create View
    try {
        await fs.ensureDir(viewDir);
        if (await fs.pathExists(viewPath)) {
            console.log(chalk.yellow(`   ⚠️  View already exists: ${viewPath}`));
        } else {
            await fs.writeFile(viewPath, viewTemplate(modelName, fields));
            console.log(chalk.green(`   ✅ Created View: src/resources/views/admin/${modelName.toLowerCase()}s/index.tsx`));
        }
    } catch (error) {
        console.error(chalk.red("   ❌ Error creating view:"), error);
    }

    console.log(chalk.blue("\n✨ Admin Panel Generation Complete!"));
    console.log(chalk.gray("   Don't forget to register your routes in routes/web.ts!"));
  });

// 5. Dashboard Command
  program
    .command('make:dashboard')
    .description('Generate a Dashboard view using Canx UI')
    .action(async () => {
      const cwd = process.cwd();
      const dashPath = path.join(cwd, 'src', 'resources', 'views', 'admin', 'dashboard.tsx');
      const { dashboardTemplate } = require('./templates/dashboard');

      console.log(chalk.blue(`🚀 Generating Admin Dashboard...`));
      
      try {
          await fs.ensureDir(path.dirname(dashPath));
          if (await fs.pathExists(dashPath)) {
              console.log(chalk.yellow(`   ⚠️  Dashboard already exists: ${dashPath}`));
          } else {
              await fs.writeFile(dashPath, dashboardTemplate());
              console.log(chalk.green(`   ✅ Created Dashboard: src/resources/views/admin/dashboard.tsx`));
          }
      } catch (error) {
          console.error(chalk.red("   ❌ Error creating dashboard:"), error);
      }
    });

// 6. Install Command - Scaffolds full auth system
program
  .command('install')
  .description('Install full auth scaffolding (Login, Register, Dashboard) into your CanxJS project')
  .action(async () => {
    const cwd = process.cwd();
    
    console.log(chalk.blue('\n🚀 Installing CanxJS Admin Scaffolding...\n'));
    
    // Define all files to create
    const files = [
      { path: path.join(cwd, 'src', 'views', 'auth', 'Login.tsx'), name: 'Login View', content: getLoginView() },
      { path: path.join(cwd, 'src', 'views', 'auth', 'Register.tsx'), name: 'Register View', content: getRegisterView() },
      { path: path.join(cwd, 'src', 'views', 'Dashboard.tsx'), name: 'Dashboard View', content: getDashboardView() },
      { path: path.join(cwd, 'src', 'controllers', 'AuthController.ts'), name: 'Auth Controller', content: getAuthController() },
      { path: path.join(cwd, 'src', 'controllers', 'DashboardController.ts'), name: 'Dashboard Controller', content: getDashboardController() },
    ];

    let created = 0, skipped = 0;

    for (const file of files) {
      try {
        await fs.ensureDir(path.dirname(file.path));
        if (await fs.pathExists(file.path)) {
          console.log(chalk.yellow(`   ⚠️  ${file.name} already exists, skipping...`));
          skipped++;
        } else {
          await fs.writeFile(file.path, file.content);
          console.log(chalk.green(`   ✅ Created ${file.name}`));
          created++;
        }
      } catch (error) {
        console.error(chalk.red(`   ❌ Error creating ${file.name}:`), error);
      }
    }

    console.log(chalk.blue('\n✨ Installation Complete!'));
    console.log(chalk.gray(`   Created: ${created} files | Skipped: ${skipped} files\n`));
    console.log(chalk.cyan('   Next steps:'));
    console.log(chalk.gray('   1. Add routes to your routes.ts file'));
    console.log(chalk.gray('   2. Run: bun run dev\n'));
  });

// Template functions for install command
function getLoginView() {
  return `import { jsx } from 'canxjs';
export function Login({ error }: { error?: string }) {
  return (
    <div class="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white min-h-screen flex items-center justify-center">
      <div class="w-full max-w-md p-8">
        <div class="glass rounded-2xl p-8">
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-4">C</div>
            <h1 class="text-2xl font-bold text-gradient">Welcome Back</h1>
          </div>
          {error && <div class="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6">{error}</div>}
          <form method="POST" action="/login" class="space-y-6">
            <div><label class="block text-sm font-medium text-slate-300 mb-2">Email</label><input type="email" name="email" required class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white" /></div>
            <div><label class="block text-sm font-medium text-slate-300 mb-2">Password</label><input type="password" name="password" required class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white" /></div>
            <button type="submit" class="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl">Sign In</button>
          </form>
          <p class="text-center text-slate-400 mt-6">Don't have an account? <a href="/register" class="text-emerald-400">Register</a></p>
        </div>
      </div>
    </div>
  );
}`;
}

function getRegisterView() {
  return `import { jsx } from 'canxjs';
export function Register({ error }: { error?: string }) {
  return (
    <div class="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white min-h-screen flex items-center justify-center">
      <div class="w-full max-w-md p-8">
        <div class="glass rounded-2xl p-8">
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-4">C</div>
            <h1 class="text-2xl font-bold text-gradient">Create Account</h1>
          </div>
          {error && <div class="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6">{error}</div>}
          <form method="POST" action="/register" class="space-y-6">
            <div><label class="block text-sm font-medium text-slate-300 mb-2">Name</label><input type="text" name="name" required class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white" /></div>
            <div><label class="block text-sm font-medium text-slate-300 mb-2">Email</label><input type="email" name="email" required class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white" /></div>
            <div><label class="block text-sm font-medium text-slate-300 mb-2">Password</label><input type="password" name="password" required class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white" /></div>
            <button type="submit" class="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl">Create Account</button>
          </form>
          <p class="text-center text-slate-400 mt-6">Already have an account? <a href="/login" class="text-emerald-400">Sign In</a></p>
        </div>
      </div>
    </div>
  );
}`;
}

function getDashboardView() {
  return `import { jsx } from 'canxjs';
export function Dashboard({ user }: { user?: { name: string } }) {
  return (
    <div class="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white min-h-screen">
      <header class="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3"><div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center text-xl font-bold">C</div><span class="text-xl font-bold text-gradient">CanxJS</span></div>
          <nav class="flex items-center gap-4"><span class="text-slate-400">{user?.name || 'Guest'}</span><a href="/logout" class="text-slate-300 hover:text-white">Logout</a></nav>
        </div>
      </header>
      <main class="max-w-7xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-8">Dashboard</h1>
        <div class="grid gap-6 md:grid-cols-3">
          <div class="glass rounded-xl p-6"><h3 class="text-slate-400 mb-2">Total Users</h3><p class="text-3xl font-bold">1,234</p></div>
          <div class="glass rounded-xl p-6"><h3 class="text-slate-400 mb-2">Revenue</h3><p class="text-3xl font-bold">$45,678</p></div>
          <div class="glass rounded-xl p-6"><h3 class="text-slate-400 mb-2">Active Sessions</h3><p class="text-3xl font-bold">573</p></div>
        </div>
        <div class="glass rounded-xl p-6 mt-8"><h2 class="text-xl font-bold mb-4">Welcome!</h2><p class="text-slate-400">You're logged in. Start building with CanxJS.</p></div>
      </main>
    </div>
  );
}`;
}

function getAuthController() {
  return `import { BaseController, Controller, Get, Post, renderPage } from 'canxjs';
import type { CanxRequest, CanxResponse } from 'canxjs';
import { Login } from '../views/auth/Login';
import { Register } from '../views/auth/Register';

@Controller('/')
export class AuthController extends BaseController {
  @Get('/login')
  showLogin(req: CanxRequest, res: CanxResponse) { return res.html(renderPage(Login({}), { title: 'Login' })); }

  @Post('/login')
  async handleLogin(req: CanxRequest, res: CanxResponse) { return res.redirect('/dashboard'); }

  @Get('/register')
  showRegister(req: CanxRequest, res: CanxResponse) { return res.html(renderPage(Register({}), { title: 'Register' })); }

  @Post('/register')
  async handleRegister(req: CanxRequest, res: CanxResponse) { return res.redirect('/login'); }

  @Get('/logout')
  logout(req: CanxRequest, res: CanxResponse) { return res.redirect('/'); }
}`;
}

function getDashboardController() {
  return `import { BaseController, Controller, Get, renderPage } from 'canxjs';
import type { CanxRequest, CanxResponse } from 'canxjs';
import { Dashboard } from '../views/Dashboard';

@Controller('/')
export class DashboardController extends BaseController {
  @Get('/dashboard')
  index(req: CanxRequest, res: CanxResponse) {
    return res.html(renderPage(Dashboard({ user: { name: 'User' } }), { title: 'Dashboard' }));
  }
}`;
}

program.parse();

