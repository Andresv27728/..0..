const fs = require("fs");
const path = require("path");
const matchCommand = require("../lib/matchCommand");

module.exports = async (sock, msg) => {
  const from = msg.key.remoteJid;
  const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;

  if (!matchCommand(text, "menu")) return;

  try {
    const hrs = new Date().getHours();
    const time = new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" });

    let wish = "*ʜᴇʏ ᴜsᴇʀ*";
    if (hrs < 12) wish = "*ɢᴏᴏᴅ ᴍᴏʀɴɪɴɢ ⛅*";
    else if (hrs < 17) wish = "*ɢᴏᴏᴅ ᴀғᴛᴇʀɴᴏᴏɴ 🌞*";
    else if (hrs < 20) wish = "*ɢᴏᴏᴅ ᴇᴠᴇɴɪɴɢ 🌥*";
    else wish = "*ɢᴏᴏᴅ ɴɪɢʜᴛ 🌙*";

    const imagePath = path.join(__dirname, "../media/menu.jpg");
    const image = fs.existsSync(imagePath)
      ? fs.readFileSync(imagePath)
      : { url: "https://telegra.ph/file/f32f089e7d7e8bc7e7e31.jpg" }; // fallback

    const caption = `╭──────────────────╮
   𝙕𝘼𝙍𝘼 𝘽𝙊𝙏
╭──────────────────╯
│
│ ${wish}
│         *⌚ ${time} IST*
│
│ ▢ *ᴏᴡɴᴇʀ:* You
│ ▢ *ᴠᴇʀsɪᴏɴ:* 2.1
│ ▢ *ᴍᴏᴅᴇ:* ᴘᴜʙʟɪᴄ
│ ▢ *ᴘʀᴇғɪx:* *# / . ; !*
│
│      ▎▍▌▌▉▏▎▌▉▐▏▌▎
│      ▎▍▌▌▉▏▎▌▉▐▏▌▎
│       ©2025 ZaraMD
│
╰──────────────────╮
│ ◩ ᴍᴇɴᴜ ◪
╭──────────────────╯
│
│[ ᴍᴇᴅɪᴀ ]
│ ▢ .sᴏɴɢ .ᴠɪᴅᴇᴏ .ɪɴsᴛᴀ .ʏᴛ
│
│[ ᴄᴏɴᴠᴇʀᴛ ]
│ ▢ .ɢɪғ .ᴍᴘ3 .ᴛᴛs .ɪᴍɢ .sᴛɪᴄᴋᴇʀ
│ ▢ .ᴀᴛᴛᴘ .ᴛᴛᴘ .ᴘʜᴏᴛᴏ .2ɪᴍɢ
│
│[ ᴍᴀᴋᴇʀ ]
│ ▢ .ᴍᴏʀᴇᴛxᴛ .2ᴍᴏʀᴇᴛxᴛ .xᴍᴇᴅɪᴀ .ᴍᴍᴘᴀᴄᴋ
│
│[ ғᴜɴ ]
│ ▢ .ᴊᴏᴋᴇ .ᴍᴇᴍᴇ .ǫʀ .ᴄʜᴀɴɢᴇsᴀʏ .ᴛʀᴜᴍᴘsᴀʏ
│ ▢ .ᴄᴏᴍᴘʟɪᴍᴇɴᴛ
│
│[ sᴇᴀʀᴄʜ ]
│ ▢ .ᴡɪᴋɪ .ʟʏʀɪᴄ .sʜᴏᴡ .ᴍᴏᴠɪᴇ .ᴡᴇᴀᴛʜᴇʀ
│
│[ ᴛᴀɢ ]
│ ▢ .ᴛᴀɢᴀʟʟ .ᴛᴀɢᴀᴅᴍɪɴ
│
│[ ᴏᴛʜᴇʀ ]
│ ▢ .ᴀɴɪᴍᴇ .ᴡᴀʟʟᴘᴀᴘᴇʀ .ss .ᴅɪᴄᴛ .sʜᴏʀᴛ .ᴛʀᴛ .ʀᴇᴍᴏᴠᴇʙɢ
│
│[ ᴏᴡɴᴇʀ ]
│ ▢ .ғᴜʟʟᴇᴠᴀ .ᴀᴜᴛᴏʙɪᴏ .ʙᴀɴ .ᴀᴅᴅ
│ ▢ .ᴘʀᴏᴍᴏᴛᴇ .ᴅᴇᴍᴏᴛᴇ .ᴍᴜᴛᴇ .ᴜɴᴍᴜᴛᴇ .ɪɴᴠɪᴛᴇ
│
│   ❏ 𝘤𝘰𝘥𝘦𝘥 𝘣𝘺 𝘈𝘣𝘩𝘪𝘭𝘮𝘹𝘻 ❏
╰──────────────────╯`;

    await sock.sendMessage(from, {
      image,
      caption,
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Menu plugin error:", err);
    await sock.sendMessage(from, { text: "❌ Failed to load menu." }, { quoted: msg });
  }
};
