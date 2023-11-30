# mich-gpt

![screenshot](https://media.discordapp.net/attachments/1083974159203307670/1162977036617404536/Screenshot_13.png)

A small module for quick implemntation of OpenAI's Chat-GPT into Discord.JS. This is the first public version of the library. For bug reports or feature requests visit https://github.com/m1chtv/mich-gpt

This module requires an OpenAI API key. You can get one [here](https://platform.openai.com/account/api-keys)

---

**Installing**

```ssh
npm i mich-gpt
```

## Example Usage

```js
const { MichClient } = require('mich-gpt');

const chatgpt = new MichClient(
  "YOUR_OPENAI_API_KEY"
);

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.id === "CHANNEL_ID") {
    return await chatgpt.chatMessage(message);
  }
});
```