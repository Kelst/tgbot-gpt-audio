import { Telegraf ,session} from "telegraf";
import config from "config"
import {message}from "telegraf/filters"
import {ogg} from "./ogg.js" 
import {openai} from "./openai.js" 
import {code} from "telegraf/format"
const bot= new Telegraf('6046426792:AAGUOMpzorNfm-83DjDuR46DW8-qrm8tLGA')
const INITIAL_SESSION={messages:[]}
bot.use(session())
bot.command("new",async (ctx)=>{
    await ctx.reply("Очікую вашого голосового запиту")
    ctx.session=INITIAL_SESSION
})
bot.command("start",async (ctx)=>{
    await ctx.reply("Очікую вашого голосового запиту")
    ctx.session=INITIAL_SESSION
})
bot.on(message("voice"),async (ctx)=>{
    try {
        ctx.session ??=INITIAL_SESSION
        await ctx.reply(code("аудіо повідомлення прийняв очікую відповідь сервера..."))
        const link=await ctx.telegram.getFileLink(ctx.message.voice.file_id)
        const userId=String(ctx.message.from.id)
        const oggPath= await ogg.create(link.href,userId)
        const oggMP3=await ogg.toMP3(oggPath,userId)
        const text=await openai.transcription(oggMP3)

        ctx.session.messages.push({role:openai.roles.USER,content:text})
        const response=await openai.chatText(ctx.session.messages)

        await ctx.reply(code(`Ваш запит: ${text}`))
        
        ctx.session.messages.push({role:openai.roles.ASSISTANT,content:response.content})
        await ctx.reply(code("Відповідь сервера:"+ response.content))
    } catch (error) { 
        console.log(error);
    }
    
})


bot.launch(config.get("TELEGRAM_TOKEN"))
process.once("SIGINT",()=>bot.stop("SIGINT"))
process.once("SIGTERM",()=>bot.stop("SIGTERM"))