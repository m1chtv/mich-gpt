# mich-gpt

![mich](https://github.com/user-attachments/assets/0a154e13-7c0d-4ba7-9429-d03853988be9)

A small module for quick implemntation of OpenAI's Chat-GPT into Discord.JS. This is the first public version of the library. For bug reports or feature requests visit https://github.com/m1chtv/mich-gpt

This module requires an OpenAI API key. You can get one [here](https://platform.openai.com/account/api-keys)

---

**Installing**

```ssh
npm i gpmich
```

## Example Usage

```js
const { MichClient } = require('gpmich');

const michClient = new MichClient('Your_API_Key');

client.on('messageCreate', async (message) => {
  console.log('Message received:', message.content);

  if (message.author.bot) return;

  try {
    if (message.channel.id === "ChannelID") {
    await michClient.chatMessage(message);
    console.log('Message processed by gpmich');
    }
  } catch (err) {
    console.error('Error processing message with gpmich:', err);
  }
});
```
