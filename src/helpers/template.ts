import type { PullRequestWrapper, TemplateType } from "@interfaces";

const getTemplate = (type: TemplateType, data: PullRequestWrapper): string => {
	switch (type) {
		case "artifact":
			return `# 📦 Artifact Generated

**Timestamp:** ${data.timestamp}
**PR:** #${data.pr.number} - ${data.pr.title}
**Author:** @${data.pr.user.login}
**Workflow:** [Run ${data.runId}](${data.runUrl})
`;

		case "deployment":
			return `# 🚀 Deployment Successful

**Timestamp:** \`${data.timestamp}\`
**Requester:** @${data.pr.user.login}
**Workflow:** [Run ${data.runId}](${data.runUrl})`;
	}
};

export { getTemplate };
