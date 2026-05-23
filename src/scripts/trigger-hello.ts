import "dotenv/config";
import { helloWorldTask } from "../trigger/example";

async function main() {
  // Trigger the helloWorldTask (no payload needed)
  const result = await helloWorldTask.trigger({});
  console.log("Task result:", result);
}

main().catch((err) => {
  console.error("Error triggering task:", err);
  process.exit(1);
});
