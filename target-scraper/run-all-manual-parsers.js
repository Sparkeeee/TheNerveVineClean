const { TargetManualHTMLParser } = require('./manual-html-parser');
const { VitacostManualHTMLParser } = require('./vitacost-manual-html-parser');
const { IHerbManualHTMLParser } = require('./iherb-manual-html-parser');
const readline = require('readline');

class MasterManualParser {
  constructor() {
    this.parsers = {
      'target': {
        name: 'Target.com',
        parser: TargetManualHTMLParser,
        description: 'Extract product URLs from Target.com search results'
      },
      'vitacost': {
        name: 'Vitacost',
        parser: VitacostManualHTMLParser,
        description: 'Extract product URLs from Vitacost search results'
      },
      'iherb': {
        name: 'iHerb',
        parser: IHerbManualHTMLParser,
        description: 'Extract product URLs from iHerb search results'
      }
    };
  }

  async showMenu() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    try {
      console.log("🎯 Master Manual HTML Parser");
      console.log("=" .repeat(40));
      console.log("Choose your target site:");
      console.log("");

      Object.entries(this.parsers).forEach(([key, site]) => {
        console.log(`  ${key.toUpperCase()}: ${site.name}`);
        console.log(`     ${site.description}`);
        console.log("");
      });

      console.log("  ALL: Run all three sites sequentially");
      console.log("  EXIT: Quit the program");
      console.log("");

      const choice = await this.question(rl, "Enter your choice (target/vitacost/iherb/all/exit): ").toLowerCase();

      if (choice === 'exit') {
        console.log("👋 Goodbye!");
        return;
      }

      if (choice === 'all') {
        await this.runAllParsers(rl);
      } else if (this.parsers[choice]) {
        await this.runSingleParser(choice, rl);
      } else {
        console.log("❌ Invalid choice. Please try again.");
        await this.showMenu();
      }

    } finally {
      rl.close();
    }
  }

  async runSingleParser(siteKey, rl) {
    const site = this.parsers[siteKey];
    console.log(`\n🎯 Running ${site.name} Parser...`);
    console.log("=" .repeat(40));

    const parser = new site.parser();
    await parser.interactiveMode();

    const continueChoice = await this.question(rl, "\nWould you like to run another parser? (y/n): ").toLowerCase();
    if (continueChoice === 'y' || continueChoice === 'yes') {
      await this.showMenu();
    } else {
      console.log("👋 Goodbye!");
    }
  }

  async runAllParsers(rl) {
    console.log("\n🚀 Running All Parsers Sequentially...");
    console.log("=" .repeat(40));

    for (const [siteKey, site] of Object.entries(this.parsers)) {
      console.log(`\n🎯 Processing ${site.name}...`);
      console.log("-".repeat(30));

      const parser = new site.parser();
      await parser.interactiveMode();

      if (siteKey !== Object.keys(this.parsers).slice(-1)[0]) {
        const continueChoice = await this.question(rl, "\nPress Enter to continue to the next site...");
      }
    }

    console.log("\n🎉 All parsers completed!");
    const continueChoice = await this.question(rl, "Would you like to run another parser? (y/n): ").toLowerCase();
    if (continueChoice === 'y' || continueChoice === 'yes') {
      await this.showMenu();
    } else {
      console.log("👋 Goodbye!");
    }
  }

  question(rl, question) {
    return new Promise((resolve) => {
      rl.question(question, resolve);
    });
  }
}

async function main() {
  const master = new MasterManualParser();
  await master.showMenu();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { MasterManualParser };


