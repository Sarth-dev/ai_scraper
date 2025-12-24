import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { tasks } from "../db/schema";
import { taskQueue } from "../queue";

const router = Router();

router.post("/", async (req, res) => {
  const { url, question } = req.body;

  const result = await db
    .insert(tasks)
    .values({
      url,
      question,
      status: "pending",
    })
    .returning();

  const task = result[0];
  console.log("atsk",task)

  await taskQueue.add("scrape", {
    taskId: task.id,
    url,
    question,
  });

  res.json({ taskId: task.id });
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  const result = await db
    .select()
    .from(tasks)
    .where(eq(tasks.id, id))
    .limit(1);
console.log("result", result)
  if (result.length === 0) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(result[0]);
});


export default router;
