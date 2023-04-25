import { Configuration,OpenAIApi } from "openai"
import config from "config"
import {createReadStream} from "fs"
import { log } from "console"
class OpenAI{
    roles={
        ASSISTANT:"assistant",
        USER:"user",
        SYSTEM:"system"
    }
    constructor(apiKey){
        const configuration=new Configuration({
            apiKey:apiKey,
        })
        this.openai=new OpenAIApi(configuration)
    }
   async transcription(filePath){
try {
  const response=  await this.openai.createTranscription (
        createReadStream(filePath),
        'whisper-1'
    )
    console.log(response.data.text);
    return response.data.text
} catch (error) {
    console.log("Error while transcription",error);
}
    } 

 async   chatText(messages){

try {
const response= await this.openai.createChatCompletion({
    model:"gpt-3.5-turbo",
    messages
})
 return response.data.choices[0].message   
} catch (error) {
    console.log("Error gpt response",error);
}

    }
}

export const openai=new OpenAI(config.get("OPENAI_API_KEY"))