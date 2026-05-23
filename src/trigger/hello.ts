import { task } from "@trigger.dev/sdk/v3";

export const helloTask = task({
  id: "hello-task",
  run: async () => {
    console.log("👋 Hello from Trigger.dev!");
    return { message: "Hello world" };
  },
});
