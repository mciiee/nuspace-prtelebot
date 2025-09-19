import { Bot } from "grammyjs"

function botSetup() {
    const token = Deno.env.get("TELEGRAM_BOT_TOKEN");  
    if (token === undefined) {
        console.error("BOT_TOKEN not specified. Try to export it as an environment variable");
        Deno.exit(1);
    }

    const bot = new Bot(token);
    bot.command("start", (ctx) => ctx.reply("I am alive"));

    bot.start();
}

function main() {

    Deno.serve(async (req: Request) => {
        console.log(await req.json());
        return new Response("", {status: 200});
    });
    

    // botSetup();
}

main();
