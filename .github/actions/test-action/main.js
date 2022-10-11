import core from "@actions/core";
import github from "@actions/github";

async function run() {
	try {
		const source = core.getInput("SOURCE_BRANCH");
		const pattern = core.getInput("TARGET_BRANCH_PATTERN");
		const token = core.getInput("GITHUB_TOKEN");
		console.log("github", github);
		console.log("source", source);
		console.log("pattern", pattern);
		const {
			context: {
				payload: { repository },
			},
		} = github;

		const octokit = github.getOctokit(token);
	} catch (error) {
		core.setFailed(error.message);
	}
}

run();
