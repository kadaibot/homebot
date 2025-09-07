const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remind')
    .setDescription('指定した時間にメッセージを送るリマインダー')
    .addStringOption(option =>
      option.setName('time')
        .setDescription('時間 (HH:MM 形式, 24時間制)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('message')
        .setDescription('送信するリマインドメッセージ')
        .setRequired(true)),
  async execute(interaction) {
    const timeStr = interaction.options.getString('time');
    const message = interaction.options.getString('message');
    const [hourStr, minuteStr] = timeStr.split(':');
    const hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);

    if (isNaN(hour) || isNaN(minute)) {
      return interaction.reply({ content: '❌ 時間形式が正しくありません (HH:MM)', ephemeral: true });
    }

    const schedule = require('node-schedule');

    // 毎日指定時刻に通知（Asia/Tokyo）
    schedule.scheduleJob({ hour, minute, tz: 'Asia/Tokyo' }, () => {
      interaction.channel.send(`⏰ リマインダー: ${message}`);
    });

    await interaction.reply(`✅ 毎日 ${timeStr} にリマインドメッセージを送信します！`);
  }
};
