import { Queue } from "bullmq";
import { QUEUE_NAME, type PipelineJobData } from "@demoforge/shared";
import { createRedis } from "./redis.js";

/** Singleton producer-side queue. The web app imports this to enqueue work. */
let _queue: Queue<PipelineJobData> | null = null;

export function getQueue(): Queue<PipelineJobData> {
  if (!_queue) {
    // bullmq v5's defaulted generics don't fully resolve at the construction
    // site (the `DataType = ExtractDataType<DataTypeOrJob, …>` default is left
    // un-instantiated), so pin the resolved Queue<PipelineJobData> type here.
    _queue = new Queue<PipelineJobData>(QUEUE_NAME, {
      connection: createRedis(),
      defaultJobOptions: {
        attempts: 2,
        backoff: { type: "exponential", delay: 5_000 },
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 200 },
      },
    }) as Queue<PipelineJobData>;
  }
  return _queue;
}

/** Enqueue a full pipeline run for a project's render job. */
export async function enqueuePipeline(data: PipelineJobData) {
  const queue = getQueue();
  return queue.add("pipeline", data, { jobId: `pipeline:${data.renderJobId}` });
}
