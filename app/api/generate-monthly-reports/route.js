// app/api/generate-monthly-reports/route.js

import { generateMonthlyReportsLogic } from "@/lib/inngest/function";

export async function GET() {
  try {
    await generateMonthlyReportsLogic({
      step: {
        run: async (name, fn) => {
          console.log(`▶️ Running step: ${name}`);
          return await fn();
        },
      },
    });

    return new Response("✅ Monthly reports generated and emails sent.", {
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error generating reports:", error);
    return new Response(`❌ Error: ${error.message}`, {
      status: 500,
    });
  }
}
