const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const matchCommand = require("../lib/matchCommand");

module.exports = async (sock, msg) => {
  const from = msg.key.remoteJid;
  const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

  if (!matchCommand(text, "sticker")) return;

  if (!quoted) {
    return sock.sendMessage(from, {
      text: "⚠️ *Hola Contesta A Una Imagen O Video Corto De (≤10s) Para Crear Tu Sticker.*",
    }, { quoted: msg });
  }

  const type = Object.keys(quoted)[0];
  if (!["imageMessage", "videoMessage"].includes(type)) {
    return sock.sendMessage(from, {
      text: "❌ *Solo Imágenes O Vídeos Cortos.*",
    }, { quoted: msg });
  }

  try {
    const media = quoted[type];
    const stream = await downloadContentFromMessage(media, type === "imageMessage" ? "image" : "video");

    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

    const sticker = new Sticker(buffer, {
      pack: "Zero Bot",
      author: "The Devil",
      type: StickerTypes.FULL,
    });

    const stickerBuffer = await sticker.toBuffer();

    await sock.sendMessage(from, { sticker: stickerBuffer }, { quoted: msg });

  } catch (err) {
    console.error("❌ Sticker error:", err);
    await sock.sendMessage(from, {
      text: "❌ Fallo Al Crear Tu Sticker.",
    }, { quoted: msg });
  }
};
