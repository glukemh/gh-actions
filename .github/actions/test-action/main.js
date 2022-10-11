import core from "@actions/core";
import github from "@actions/github";

async function run() {
	try {
		const source = core.getInput("SOURCE_BRANCH");
		const pattern = `heads/${core.getInput("TARGET_BRANCH_STARTS_WITH")}`;
		const token = core.getInput("GITHUB_TOKEN");
		const {
			context: {
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

		console.log("Searching by ref", pattern);
		const { data: targets } = await octokit.git.listMatchingRefs({
			owner: login,
			repo: repoName,
			ref: pattern,
		});

		if (targets.length === 0) {
			console.log("No matching branches found");
		} else {
			console.log(`Merging to ${targets.length} branches`);
		}

		await Promise.all(
			targets.map(async ({ ref }) => {
				const targetBranch = ref.replace(/^refs\/heads\//, "");
				console.log("Merging to", targetBranch);
				return await octokit.repos.merge({
					owner: login,
					repo: repoName,
					base: targetBranch,
					head: source,
				});
			})
		);

		console.log("Done");
	} catch (error) {
		core.setFailed(error.message);
	}
}

run();
