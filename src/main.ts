import { Bot, CommandContext, Context } from "grammyjs"
import { GitHubWebHookIssueRequest, FormattedGitHubIssuePrototype, ApiGitHubIssuesResponse, ApiIssue } from "./types.ts"
import { initSharedData } from "./utils.ts";


const sharedData = initSharedData();



function botSetup() {
    const telegramToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    if (telegramToken === undefined) {
        console.error("TELEGRAM_BOT_TOKEN not specified. Try to export it as an environment variable");
        Deno.exit(1);
    }

    const bot = new Bot(telegramToken);
    bot.command("start", (ctx) => ctx.reply("I am alive"));
    bot.command("chatId", (ctx) => ctx.reply(`chat id: ${ctx.chatId}`));
    bot.command("issues", (ctx) => sendIssues(sharedData.owner, sharedData.repo, sharedData.githubToken)(ctx))

    bot.start();
    return bot;
}

function formatApiIssues(issuesResponse: ApiIssue[]) {
    
    const getProto = (issue: ApiIssue) => ({
        author: issue.user.login,
        state: issue.state,
        title: issue.title,
        body: issue.body,
        url: issue.url
    });

    let formatedMessage = "Issues:\n";
    try {
    for (const issue of issuesResponse) {
        for (const [key, value] of Object.entries(getProto(issue))) {
            formatedMessage += `${key}: ${value}\n`
        }
        formatedMessage += "\n";
    }
    }
    catch (e) {
        console.error(e);
        console.error("issuesResponse:", issuesResponse);
        formatedMessage = "[Error] failed to retrieve issues, response: \n";
        formatedMessage += JSON.stringify(issuesResponse as object, 2);
    }
    return formatedMessage;
}


function sendIssues(owner: string, repo: string, token: string) {
    return (ctx: CommandContext<Context>) => getIssues(owner, repo, token).then((e) => ctx.reply(formatApiIssues(e)));
}

function getIssues(owner: string, repo: string, token: string): Promise<ApiIssue[]> {
    const headers = {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28"
    };
    return fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {headers: headers}).then(resp => resp.json())
}


function formatWebhookIssue(request: GitHubWebHookIssueRequest) {
    const proto: FormattedGitHubIssuePrototype = {
        action: request.action,
        author: request.sender.login,
        body: request.issue.body,
        url: request.issue.url,
    };
    let formatedMessage = "";
    for (const [key, value] of Object.entries(proto)) {
        formatedMessage += `${key}: ${value}\n`
    }

    return formatedMessage;
}

function main() {
    const bot = botSetup();
    Deno.serve(async (req: Request) => {
        try {
            const githubReq = await req.json();
            // Deno.writeTextFileSync("json/request.json", JSON.stringify(githubReq));
            bot.api.sendMessage(517237799, `Github Webhook:\n${formatWebhookIssue(githubReq)}`);
            return new Response("", {status: 200});
        }
        catch (e) {
            console.error(e);
            return new Response("", {status: 500});
        }
    });
    

    // botSetup();
}

main();
