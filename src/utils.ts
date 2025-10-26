interface SharedData {
    chatId: number,
    owner: string,
    repo: string,
    githubToken: string
}

function getEnv(envVar: string) : string {
    const env = Deno.env.get(envVar);
    if (env === undefined) {
        console.error(`${envVar} not specified. Try to export it as an environment variable`);
        Deno.exit(1);
    }
    return env;
}

export function initSharedData(): SharedData {
    return {
        chatId: Number.parseInt(getEnv("TELEGRAM_CHAT_ID")),
        owner: getEnv("GITHUB_REPO_OWNER"),
        repo: getEnv("GITHUB_REPO_NAME"),
        githubToken: getEnv("GITHUB_TOKEN")
    }
}


