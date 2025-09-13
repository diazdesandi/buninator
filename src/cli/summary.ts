import { consola } from "consola";

const getRepoSummary = async (gitHubEvent: any) => {
	console.log({ gitHubEvent });

	try {
		const { number, title, user } = gitHubEvent.pull_request;
		const summary = `# PR JSON Artifact Summary
**Timestamp:** $(date -Iseconds)
**PR:** #${number}
**Title:** ${title}
**Author:** ${user.login}
**Files:**
${gitHubEvent.files.map((f: string) => `- \`${f}\``).join("\n")}
`;
        return summary;
	} catch (error) {
		consola.error("Error fetching repository summary:", error);
		throw error;
	}
};
export { getRepoSummary };
