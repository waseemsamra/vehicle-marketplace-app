import VehicleBot from './bot.js';
import readline from 'readline';

const bot = new VehicleBot();

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'interactive') {
    await runInteractive();
    return;
  }

  await bot.init();

  switch (command) {
    case 'list': {
      const make = args[1] || null;
      const result = await bot.listVehicles({ make, limit: 20 });
      printVehicles(result);
      break;
    }
    case 'search': {
      const query = args[1] || '';
      const result = await bot.searchVehicles(query);
      printVehicles(result);
      break;
    }
    case 'get': {
      const id = args[1];
      if (!id) {
        console.error('Usage: bot get <vehicleId>');
        process.exit(1);
      }
      const vehicle = await bot.getVehicle(id);
      console.log(JSON.stringify(vehicle, null, 2));
      break;
    }
    case 'makes': {
      const makes = await bot.getMakes();
      console.log(JSON.stringify(makes, null, 2));
      break;
    }
    case 'models': {
      const make = args[1] || null;
      const models = await bot.getModels(make);
      console.log(JSON.stringify(models, null, 2));
      break;
    }
    case 'add': {
      const data = JSON.parse(args[1] || '{}');
      const token = args[2] || null;
      const result = await bot.addVehicle(data, token);
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    case 'update': {
      const id = args[1];
      const data = JSON.parse(args[2] || '{}');
      const token = args[3] || null;
      const result = await bot.editVehicle(id, data, token);
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    case 'delete': {
      const id = args[1];
      const token = args[2] || null;
      const result = await bot.removeVehicle(id, token);
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    case 'aggregate': {
      const pipeline = JSON.parse(args[1] || '[]');
      const result = await bot.aggregate(pipeline);
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    default:
      console.error(`Unknown command: ${command}`);
      printUsage();
      process.exit(1);
  }
}

async function runInteractive() {
  await bot.init();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log('Vehicle Marketplace Bot');
  console.log('Type "help" for commands, "exit" to quit.\n');

  const ask = () => {
    rl.question('bot> ', async (input) => {
      const trimmed = input.trim();
      if (!trimmed) { ask(); return; }
      if (trimmed === 'exit') { rl.close(); return; }
      if (trimmed === 'help') {
        printUsage();
        ask();
        return;
      }
      try {
        const tokens = parseInput(trimmed);
        const cmd = tokens[0];
        switch (cmd) {
          case 'list': {
            const params = {};
            for (let i = 1; i < tokens.length; i++) {
              const [key, val] = tokens[i].split('=');
              params[key] = val;
            }
            const result = await bot.listVehicles(params);
            printVehicles(result);
            break;
          }
          case 'search': {
            const query = tokens.slice(1).join(' ');
            const result = await bot.searchVehicles(query);
            printVehicles(result);
            break;
          }
          case 'get': {
            if (tokens.length < 2) { console.log('Usage: get <id>'); break; }
            const vehicle = await bot.getVehicle(tokens[1]);
            console.log(JSON.stringify(vehicle, null, 2));
            break;
          }
          case 'makes': {
            const makes = await bot.getMakes();
            console.log(JSON.stringify(makes, null, 2));
            break;
          }
          case 'models': {
            const make = tokens[1] || null;
            const models = await bot.getModels(make);
            console.log(JSON.stringify(models, null, 2));
            break;
          }
          case 'add': {
            const data = JSON.parse(tokens.slice(1).join(' '));
            const result = await bot.addVehicle(data);
            console.log(JSON.stringify(result, null, 2));
            break;
          }
          case 'update': {
            if (tokens.length < 3) { console.log('Usage: update <id> <json>'); break; }
            const data = JSON.parse(tokens.slice(2).join(' '));
            const result = await bot.editVehicle(tokens[1], data);
            console.log(JSON.stringify(result, null, 2));
            break;
          }
          case 'delete': {
            if (tokens.length < 2) { console.log('Usage: delete <id>'); break; }
            const result = await bot.removeVehicle(tokens[1]);
            console.log(JSON.stringify(result, null, 2));
            break;
          }
          default:
            console.log(`Unknown command: ${cmd}. Type "help" for available commands.`);
        }
      } catch (err) {
        console.error(`Error: ${err.message}`);
      }
      ask();
    });
  };

  ask();
}

function parseInput(input) {
  const tokens = [];
  let current = '';
  let inQuotes = false;
  for (const char of input) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ' ' && !inQuotes) {
      if (current) tokens.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  if (current) tokens.push(current);
  return tokens;
}

function printVehicles(result) {
  const items = result.vehicles || result.items || result;
  if (!items || items.length === 0) {
    console.log('No vehicles found.');
    return;
  }
  console.log(`\nFound ${result.totalCount || items.length} vehicle(s):\n`);
  items.forEach((v) => {
    console.log(`  ${v.year} ${v.make} ${v.model}  |  $${v.priceNum?.toLocaleString() || v.price}  |  ${v.mileage?.toLocaleString()} mi  |  ${v.status || 'available'}`);
  });
  console.log('');
}

function printUsage() {
  console.log(`
Commands:
  list [make=<make>]              List vehicles (optionally filter by make)
  search <query>                  Search vehicles by keyword
  get <id>                        Get a single vehicle by ID
  makes                           List all available makes
  models [make]                   List models, optionally filtered by make
  add '<json>' [token]            Add a new vehicle (admin token required)
  update <id> '<json>' [token]    Update a vehicle (admin token required)
  delete <id> [token]             Delete a vehicle (admin token required)
  aggregate '<pipeline>'          Run a MongoDB aggregation pipeline
  interactive                     Start interactive mode (default)
  exit                            Quit the bot
`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});