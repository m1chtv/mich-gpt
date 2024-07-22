const { EmbedBuilder, Message } = require("discord.js");

class MichClient {
  contextData = new Map();
  apiClient = null;
  options = {};

  /**
   * @param {string} openAIAPIKey
   * @param {{contextRemembering:boolean, responseType: 'embed' | 'string', maxLength:number, requestTimeout:number, errorMessage:string}} options
   */
  constructor(openAIAPIKey, options = {}) {
    if (!openAIAPIKey) {
      throw new TypeError("An OpenAI API key must be provided. Create an OpenAI account and get an API key at https://platform.openai.com/account/api-keys");
    }

    const optionDefaults = {
      contextRemembering: true,
      responseType: "embed",
      maxLength: 4096,
      requestTimeout: 60000,
      errorMessage: "Sorry, there was an error processing your request."
    };

    this.options = { ...optionDefaults, ...options };

    import("chatgpt").then(lib => {
      const { ChatGPTAPI } = lib;
      this.apiClient = new ChatGPTAPI({ apiKey: openAIAPIKey });
    }).catch(err => {
      console.error("Failed to import ChatGPT library:", err);
    });
  }

  /**
   * @param {string} message
   * @param {string} id
   * @returns {Promise<object>}
   */
  async send(message, id) {
    if (!this.apiClient) {
      throw new TypeError("ChatGPT client failed to initialize");
    }
    try {
      const fetchPromise = this.apiClient.sendMessage(message, { parentMessageId: id });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), this.options.requestTimeout)
      );
      
      const response = await Promise.race([fetchPromise, timeoutPromise]);
      return response;
    } catch (err) {
      throw err;
    }
  }

  /**
   * @param {string} userId
   */
  forgetContext(userId) {
    if (this.options.contextRemembering) {
      this.contextData.delete(userId);
    }
  }

  /**
   * @param {Message} message
   * @param {string} [str]
   */
  async chatMessage(message, str = '') {
    const context = this.contextData.get(message.author.id);
    const loadingEmbed = new EmbedBuilder()
      .setColor(0x9f1b5f)
      .setTitle("Processing...")
      .setDescription("Please wait...")
      .setAuthor({
        iconURL: "https://cdn.discordapp.com/attachments/1175429623161569280/1179843873451823174/apple-touch-icon.png",
        url: "https://bruh.ir",
        name: "Bruh-AI - Loading",
      });

    const response = await message.reply({ embeds: [loadingEmbed] });

    try {
      const reply = await this.send(str || message.content, this.options.contextRemembering ? context : undefined);

      await response.delete().catch(() => null);

      const embed = new EmbedBuilder()
        .setColor(0x9f1b5f)
        .setDescription(reply.text)
        .setFooter({ text: 'Thanks for using Bruh-AI!' })
        .setAuthor({
          iconURL: "https://cdn.discordapp.com/attachments/1175429623161569280/1179843873451823174/apple-touch-icon.png",
          url: "https://bruh.ir",
          name: "Generated by Bruh-AI",
        });

      if (this.options.responseType === "string") {
        await message.reply(reply.text);
      } else {
        await message.reply({ embeds: [embed] });
      }

      if (this.options.contextRemembering) {
        this.contextData.set(message.author.id, reply.id);
      }
    } catch (err) {
      console.error("Error handling chat message:", err);
      await response.edit({ content: this.options.errorMessage });
    }
  }
}

module.exports = {
  MichClient,
};
