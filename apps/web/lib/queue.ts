import "server-only";
// Re-export the producer-side queue from the worker package. Kept in a
// server-only module so bullmq/ioredis never leak into a client bundle.
export { enqueuePipeline } from "@demoforge/worker/queue";
