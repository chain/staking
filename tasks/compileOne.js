const {
  TASK_COMPILE_SOLIDITY_GET_COMPILATION_JOB_FOR_FILE,
  TASK_COMPILE_SOLIDITY_GET_DEPENDENCY_GRAPH,
  TASK_COMPILE_SOLIDITY_COMPILE_JOB
} = require("hardhat/builtin-tasks/task-names");

// import * as taskTypes from "hardhat/types/builtin-tasks";
// const { taskTypes } = require("hardhat/types/builtin-tasks");
require("hardhat/types/builtin-tasks");

task("set:compile:one", "Compiles a single contract in isolation")
  .addPositionalParam("contractName")
  .setAction(async function(args, env) {

  const sourceName = env.artifacts.readArtifactSync(args.contractName).sourceName;

  const dependencyGraph = await env.run(
    TASK_COMPILE_SOLIDITY_GET_DEPENDENCY_GRAPH,
    { sourceNames: [sourceName] }
  );

  const resolvedFiles = dependencyGraph
    .getResolvedFiles()
    .filter(resolvedFile => {
      return resolvedFile.sourceName === sourceName;
    });

  const compilationJob = await env.run(
    TASK_COMPILE_SOLIDITY_GET_COMPILATION_JOB_FOR_FILE,
    {
      dependencyGraph,
      file: resolvedFiles[0],
    }
  );

  await env.run(TASK_COMPILE_SOLIDITY_COMPILE_JOB, {
    compilationJob,
    compilationJobs: [compilationJob],
    compilationJobIndex: 0,
    emitsArtifacts: true,
    quiet: true,
  });

  // await env.run("typechain");
});
