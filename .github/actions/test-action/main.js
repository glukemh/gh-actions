import core from "@actions/core";
import github from "@actions/github";

async function run() {
	try {
		const source = core.getInput("SOURCE_BRANCH");
		const pattern = `heads/${core.getInput("TARGET_BRANCH_STARTS_WITH")}`;
		const token = core.getInput("GITHUB_TOKEN");
		console.log("github", github);
		console.log("source", source);
		console.log("pattern", pattern);
		const {
			context: {
				sha,
				payload: {
					repository: {
						name: repoName,
						owner: { login },
					},
				},
			},
			GitHub,
		} = github;

		const octokit = new GitHub(token);

		const { data: targets } = await octokit.git.listMatchingRefs({
			owner: login,
			repo: repoName,
			ref: pattern,
		});

		targets.forEach(async ({ ref }) => {
			const targetBranch = ref.replace(/^refs\/heads\//, "");
			console.log("targetBranch", targetBranch);
			console.log("sha", sha);
			// await octokit.repos.merge({
			//   owner: login,
			//   repo: repoName,
			//   base: targetBranch,
			//   head: source,
			// });
		});
	} catch (error) {
		core.setFailed(error.message);
	}
}

run();
