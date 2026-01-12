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

program.parse();
