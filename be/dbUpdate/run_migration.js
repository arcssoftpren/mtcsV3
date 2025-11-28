require("dotenv").config({
  path: require("path").join(__dirname, "..", ".env"),
});
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

async function runMigration() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
  });

  try {
    console.log("Connected to database:", process.env.DB_NAME);
    console.log("Scanning for migration files...");

    // Get all .sql files in the current directory
    const currentDir = __dirname;
    const files = fs.readdirSync(currentDir);
    const sqlFiles = files
      .filter(
        (file) => file.endsWith(".sql") && file !== "run_migration.sql" // exclude self if exists
      )
      .sort(); // sort alphabetically for consistent order

    if (sqlFiles.length === 0) {
      console.log("No SQL migration files found.");
      return;
    }

    console.log(`Found ${sqlFiles.length} migration file(s):`);
    sqlFiles.forEach((file) => console.log(`  - ${file}`));

    // Run each migration file
    for (const sqlFile of sqlFiles) {
      const filePath = path.join(currentDir, sqlFile);
      const sql = fs.readFileSync(filePath, "utf8");

      console.log(`\nRunning migration: ${sqlFile}`);

      try {
        await connection.query(sql);
        console.log(`✓ ${sqlFile} completed successfully!`);
      } catch (error) {
        console.error(`✗ ${sqlFile} failed:`, error.message);
        // Continue with other files instead of stopping
        continue;
      }
    }

    console.log("\n✓ All migrations processed!");
  } catch (error) {
    console.error("Migration failed:", error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

module.exports = { runMigration };

// Only run directly if this file is executed directly (not required from another file)
if (require.main === module) {
  runMigration()
    .then(() => {
      console.log("\nDone!");
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
