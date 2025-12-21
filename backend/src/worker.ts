import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import IORedis from "ioredis";
import { scrapeWebsite } from "./scrape";
import { db } from "./db/client";
import { eq } from "drizzle-orm";
import { tasks } from "./db/schema";
import axios from "axios";

const connection = new IORedis(process.env.REDIS_URL!, {
  tls: {},
  maxRetriesPerRequest: null,
});
new Worker(
  "tasks",
  async (job) => {
    const { taskId, url, question } = job.data;

    try {
      await db
        .update(tasks)
        .set({ status: "processing" })
        .where(eq(tasks.id, taskId));

      const content = await scrapeWebsite(url);

      const aiResponse = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.1-8b-instant",
          temperature: 0.2,
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant. Answer the question using only the provided website content.",
            },
            {
              role: "user",
              content: `
Website content:
${content}

Question:
${question}
        `,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          },
        }
      );

      const answer = aiResponse.data.choices[0].message.content;

      await db
        .update(tasks)
        .set({ status: "done", answer })
        .where(eq(tasks.id, taskId));
    } catch (error: any) {
      console.error("Groq error:", error.response?.data || error.message);

      await db
        .update(tasks)
        .set({ status: "failed" })
        .where(eq(tasks.id, taskId));
    }
  },
  { connection }
);
