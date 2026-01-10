# Discord Bot Creation

To create the Discord bot, you'll need to create a new application and invite the bot to your server.

1. Go to https://discord.com/developers/applications/ and create a new application.

   <img width="400" alt="image" src="https://github.com/user-attachments/assets/1233d60c-558a-42f6-901f-9c5005d4538a" />


2. On the left side, click "Installation".
   * Uncheck the "User Install" box.
   * Scroll to "Guild Install" and add the "bot" scope, then add the Administrator permission.
   * Click Save Changes.
   * Copy/paste the bot's invite link in your browser, and add the bot to your server.
  
     
     <img width="852" alt="image" src="https://github.com/user-attachments/assets/4b185196-b2cc-4453-b2f5-65fe45c954e0" />


   * Choose your server from the list and authorize the bot.
   
     <img width="400" alt="image" src="https://github.com/user-attachments/assets/dd0f39d3-6288-48e5-bc86-360aa9cac019" />

     <img width="400" alt="image" src="https://github.com/user-attachments/assets/8d4de73d-4a75-42e5-a3ce-c59cdc040338" />


3. Back in Discord applications, click "Bot" on the left side and click "Reset Token".  Fill in your 2FA info, then click "Copy".

   <img width="852" alt="image" src="https://github.com/user-attachments/assets/faf4d9af-a133-40b1-acb1-a5ab4965b287" />


   * Paste this key in your `.env` file after `DISCORD_TOKEN=`.
     
     **__THIS IS YOUR BOT PASSWORD - DO NOT SHARE IT WITH ANYONE!__**
     
     ```
     DISCORD_TOKEN=MTQ......
     ```

4. Lastly, turn on "Message Content Intent" under "Privileged Gateway Intents" and click Save Changes.  Adding this bot to over 100 servers will require verification to keep this active.
   * If you miss this step, the bot will fail to start with a "Missing intents" error.
     
     <img width="852" alt="image" src="https://github.com/user-attachments/assets/ac40b776-af6b-4e55-881f-f1e8c6eb6842" />

   
6. In your server settings, make sure the bot's role is the highest in the list, above the owner role.  If there are any locked roles above *your* highest role, you'll need to ask the server owner to move the bot's role to the highest position.

---

Once you start up the server, you should see the bot's name appear in the console.  This means the chat bridge has connected to the Discord Gateway and is ready to read & send messages!
