# FM-DX Webserver Discord Chat Bridge

This is an independent server bridging chat between the FM-DX Webserver and Discord.  I created this application with two goals in mind: easily send chat messages between the FM-DX Webserver and Discord, and maintain a chat log that was easily searchable and non-volatile.

Once installed, the server requires no further input from the operator unless a configuration change is needed.

---

## Installation

Before installing, you should have **a Discord account in good standing** and an [**FM-DX Webserver**](https://github.com/NoobishSVK/fm-dx-webserver/) accessible from the computer you'll run the chat bridge on.

1. Install the latest versions of Node.js and `npm`.  These should already be installed if you're running the chat bridge on your webserver computer.
2. Download the latest release of the server from the [Releases page.](https://github.com/simsnet/FM-DX-Webserver-Discord-Chat-Bridge/releases)
3. Extract the downloaded zip file to the same location as your webserver folder (not inside it).
4. Open a terminal and install the dependencies.
   
   ```
   cd path/to/the/server/folder
   npm install
   ```
5. Once installed, configure the `.env` variables file:
   * To configure `DISCORD_TOKEN`, you'll need to create a Discord bot.  Click [here](https://github.com/simsnet/FM-DX-Webserver-Discord-Chat-Bridge/blob/main/discord.md) for instructions on how to create your own.
   * The websocket URL is how the bridge connects to your FM-DX Webserver.
     * If your server is HTTP, use `ws://`.  If it's HTTPS, use `wss://`.
     * Next, enter your server domain or IP address, along with the port number.
     * Lastly, add `/chat` at the end.
     Add this to the `WS_URL` variable, like `WS_URL=ws://localhost:8080/chat`

    Save and close the file.

6. Start the server in your terminal.

   ```
   node index.js
   - OR -
   npm run bridge
   ```

7. If set up correctly, your messages will now sync between Discord and your FM-DX Webserver!

---

## Requirements

Because this integrates into another application, an up-to-date version of NoobishSVK's [FM-DX Webserver](https://github.com/NoobishSVK/fm-dx-webserver) is required.

Additionally, a text editor with syntax highlighting/formatting (Notepad++, Visual Studio Code, Panic Nova) is highly recommended.

---

## Contribute

If you wish to contribute to the source code, simply open a pull request.  Any and all contributions are welcome!
