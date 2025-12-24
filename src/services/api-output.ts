import { Mistral } from "@mistralai/mistralai";
import { PassableObj } from "../jobs/monthly digest/monthly-digest.ts";

// TODO: change type back to passableObj
export async function generateMonthlyDigest(financeData: any) {
  const outputSchema = {
    month_name: "",
    user_name: "",
    closing_balance: 0,
    income: {
      rows: [],
      primary_income_percent: 0,
      income_change_sign: "",
      income_change_percent: 0,
    },
    savings: { rows: [], goal_achievement_percent: 0, extra_needed: 0 },
    spending: { rows: [], alert_categories: [], under_budget_categories: [] },
    patterns: {
      top_spend_category: "",
      repeated_overshoot_category: "",
      low_spend_categories: [],
      top_spend_days: "",
      strong_saving_category: "",
      saving_pattern_summary: "",
      cut_from_categories: [],
    },
    highlights: {
      big_wins: [],
      needs_attention: [],
    },
    good_habbit: [],
    bad_habbit: [],
    tips: [],
    next_month_focus: {
      theme: "",
      goal: "",
      steps: [],
    },
  };

  const apiKey = "XgKklmyJW1MqjTEUzYHR2uAqki2KClTu";

  const client = new Mistral({ apiKey: apiKey });

  const res = await client.chat.complete({
    model: "mistral-medium-latest",
    messages: [
      {
        role: "system",
        content:
          "You are a precise financial analysis assistant. Output only valid JSON that matches the provided schema. No extra text.",
      },
      {
        role: "user",
        content:
          `I will give you my monthly finance data as JSON and a JSON schema for output.\n` +
          ` this data about a person's monthly income, savings, budgets, and expenses. \n` +
          `TASK: Analyse the data and fill every field in the schema.\n\n` +
          `Data:\n${JSON.stringify(financeData)}\n\n` +
          `Output schema:\n${JSON.stringify(outputSchema)}`,
      },
    ],
    temperature: 0.5,
    maxTokens: 6000,
    responseFormat: { "type": "json_object" },
  });

  const content = res.choices[0].message.content;

  // content should already be JSON (string or object depending on SDK)
  // const digestData =
  //   typeof content === "string" ? JSON.parse(content) : content;

  return content;
}
