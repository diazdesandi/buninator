import type { IContainer, IGCSService, IGithubService } from "@interfaces";
import { GCSService, GithubService } from "@services";

class Container implements IContainer {
	private static instance: Container;

	private readonly githubService: IGithubService;
	private readonly gcsService: IGCSService;

	private constructor() {
		this.githubService = new GithubService();
		this.gcsService = new GCSService();
	}

	static getInstance(): Container {
		if (!Container.instance) {
			Container.instance = new Container();
		}
		return Container.instance;
	}

	getGithubService(): IGithubService {
		if (!this.githubService) {
			throw new Error("GithubService not registered in container");
		}
		return this.githubService;
	}

	getGCSService(): IGCSService {
		if (!this.gcsService) {
			throw new Error("GithubService not registered in container");
		}
		return this.gcsService;
	}
}

export const container = Container.getInstance();
