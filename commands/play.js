/*
THIS IS JUST THE COMMAND IT SELF, IF YOU USE THIS EXACTLY THEN YOU WILL NEED A WAY TO LOAD THE FILE LIKE THE FOLLOWING HERE:
https://solaris.codes/erelajs/guides/moreCommands.html#before-you-start

YOU ALSO NEED TO INITIATE THE MANAGER AS SHOWN HERE:
https://solaris.codes/erelajs/guides/basics.html#first-start

Or copy the code inside the run function as its simply the message and arguments.
*/
const { Attachment, Message, MessageEmbed } = require("discord.js");
module.exports = {
  name: 'play',
  aliases: 'p',
  run: async (message, args) => {
    const { channel } = message.member.voice;
	//delete trigger message
	message.delete();
    if (!channel) return message.reply('Где ты? Я тебя не слышу!')
		.then(message => {
						message.delete({timeout: 5000});
					});
    if (!args.length) return message.reply('Что мне искать?')
		.then(message => {
						message.delete({timeout: 5000});
					});

    const player = message.client.manager.create({
      guild: message.guild.id,
      voiceChannel: channel.id,
      textChannel: message.channel.id,
    });

    if (player.state !== "CONNECTED") player.connect();

    const search = args.join(' '); 
    let res;

    try {
      res = await player.search(search, message.author);
      if (res.loadType === 'LOAD_FAILED') {
        if (!player.queue.current) player.destroy();
        throw res.exception;
      }
    } catch (err) {
      return message.reply(`there was an error while searching: ${err.message}`);
    }

    switch (res.loadType) {
      case 'NO_MATCHES':
        if (!player.queue.current) player.destroy();
        return message.reply('Я не смогла ничего найти')
			.then(message => {
						message.delete({timeout: 5000});
					});
      case 'TRACK_LOADED':
        player.queue.add(res.tracks[0]);
		if (!res.tracks[0].uri) message.client.channels.cache.get(process.env.MUSIC_ARC_ID).send('Спела ' + search + ' для ' + '**' + message.author.username + '**');
	    else
		message.client.channels.cache.get(process.env.MUSIC_ARC_ID).send('Спела ' + res.tracks[0].uri + ' для ' + '**' + message.author.username + '**');

        if (!player.playing && !player.paused && !player.queue.size) player.play();
        return //message.reply(`enqueuing \`${res.tracks[0].title}\`.`);
      case 'PLAYLIST_LOADED':
        player.queue.add(res.tracks);

        if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
        return message.reply(`Устроила мини концерт \`${res.playlist.name}\` с ${res.tracks.length} песнями.`);
      case 'SEARCH_RESULT':
        let max = 10, collected, filter = (m) => m.author.id === message.author.id && /^(\d+|c)$/i.test(m.content);
        if (res.tracks.length < max) max = res.tracks.length;

        let results = res.tracks
            .slice(0, max)
            .map((track, index) => `${++index} - **${track.title}** by  \`${track.author}\``)
            .join('\n');
		results += "\n **c - Отменить выбор**";
        //message.channel.send(results);
		
		const embed = new MessageEmbed()
			.setTitle("Что спеть для тебя?")
			.setDescription(results)
			.setColor("GREEN");
		
		const embedMsg = await message.channel.send(embed);
        try {
          collected = await message.channel.awaitMessages(filter, { max: 1, time: 30e3, errors: ['time'] });
		  message.channel.messages.fetch(embedMsg.id).then(message => message.delete());
        } catch (e) {
          if (!player.queue.current) player.destroy();
          return message.reply("Я устала тебя ждать(")
			  .then(message => {
					message.delete({timeout: 5000});
				});
        }
		//delete trigger message
		message.channel.lastMessage.delete();
		
        const first = collected.first().content;

        if (first.toLowerCase() === 'c') {
          if (!player.queue.current) player.destroy();
          return message.channel.send('Прости, что не смогла найти то, что ты хотел(')
			  .then(message => {
				message.delete({timeout: 5000});
			});
        }

        const index = Number(first) - 1;
        if (index < 0 || index > max - 1) return message.reply(`Я не понимаю что ты хочешь(`)
			.then(message => {
				message.delete({timeout: 5000});
			});

        const track = res.tracks[index];
        player.queue.add(track);
		//music archive channel
		message.client.channels.cache.get('873976127352352898').send('Спела ' + track.uri + ' для ' + '**' + message.author.username + '**');
		
        if (!player.playing && !player.paused && !player.queue.size) player.play();
        return //message.reply(`enqueuing \`${track.title}\`.`);
    }
  },
};