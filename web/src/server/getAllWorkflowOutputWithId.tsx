"use server";

import { db } from "@/db/db";
import {
  workflowTable,
  workflowVersionTable,
  workflowRunsTable,
  workflowRunOutputs,
} from "@/db/schema";
import { count, desc, eq, sql, inArray } from "drizzle-orm";
import { replaceCDNUrl } from "@/server/replaceCDNUrl";

export async function getWorkflowRunOutputsByWorkflowId( 
	workflowId: string,
	page: number = 1,
	itemsPerPage: number = 10
  ) {
	
	const offset = (page - 1) * itemsPerPage;

  // Step 1: 获取 workflow_version_id
  const workflowVersions = await db
    .select()
    .from(workflowVersionTable)
    .where(eq(workflowVersionTable.workflow_id, workflowId));

  const workflowVersionIds = workflowVersions.map((version) => version.id);

  if (workflowVersionIds.length === 0) {
    return { data: [], total: 0 };
  }

  // Step 2: 获取 run_id
  const workflowRuns = await db
    .select()
    .from(workflowRunsTable)
    .where(inArray(workflowRunsTable.workflow_version_id, workflowVersionIds));

  const runIds = workflowRuns.map((run) => run.id);

  if (runIds.length === 0) {
    return { data: [], total: 0 };
  }

  // Step 3: 获取 workflow_run_outputs 并分页
  const runOutputs = await db.query.workflowRunOutputs.findMany({
    where: inArray(workflowRunOutputs.run_id, runIds),
    orderBy: desc(workflowRunOutputs.created_at),
    offset: offset,
    limit: itemsPerPage,
    extras: {
      total: sql<number>`count(*) over ()`.as("total"),
    },
  });

  const total = runOutputs.length > 0 ? runOutputs[0].total : 0;

  // 预处理数据，提取出图片和 GIF URL
const processedData = runOutputs.flatMap((output) => {
  const images = output.data.images ? output.data.images.map((image: any) => ({
    id: image.filename,
    url: replaceCDNUrl(
      `${process.env.SPACES_ENDPOINT}/${process.env.SPACES_BUCKET}/outputs/runs/${output.run_id}/${image.filename}`
    ),
  })) : [];

  const gifs = output.data.gifs ? output.data.gifs.map((gif: any) => ({
    id: gif.filename,
    url: replaceCDNUrl(
      `${process.env.SPACES_ENDPOINT}/${process.env.SPACES_BUCKET}/outputs/runs/${output.run_id}/${gif.filename}`
    ),
  })) : [];

  return [...images, ...gifs];
});

  return { data: processedData, total };
}