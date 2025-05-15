// app/api/check-budget-alerts/route.js

import { checkBudgetAlertsLogic } from "@/lib/inngest/function";

export async function GET() {
  try {
    await checkBudgetAlertsLogic({
      step: {
        run: async (name, fn) => {
          console.log(`▶️ Running step: ${name}`);
          return await fn();
        },
      },
    });

    return new Response("✅ Budget alert check triggered manually.", {
      status: 200,
    });
  } catch (error) {
    console.error("❌ Manual trigger failed:", error);
    return new Response(`❌ Error: ${error.message}`, {
      status: 500,
    });
  }
}
