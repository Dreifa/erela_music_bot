/*
THIS IS JUST THE COMMAND IT SELF, IF YOU USE THIS EXACTLY THEN YOU WILL NEED A WAY TO LOAD THE FILE LIKE THE FOLLOWING HERE:
https://solaris.codes/erelajs/guides/moreCommands.html#before-you-start

YOU ALSO NEED TO INITIATE THE MANAGER AS SHOWN HERE:
https://solaris.codes/erelajs/guides/basics.html#first-start

Or copy the code inside the run function as its simply the message and arguments.
*/

module.exports = {
    name: "skip",
    run: (message) => { 
      const player = message.client.manager.get(message.guild.id);
	  //delete trigger message
	  message.delete();
      if (!player) return message.reply("Ты ещё не попросил меня спеть что-нибудь, я думаю самое время для этого.")
			  .then(message => {
				message.delete({timeout: 5000});
			});
  
      const { channel } = message.member.voice;
      if (!channel) return message.reply("Где ты? Я тебя не слышу!")
		  .then(message => {
			message.delete({timeout: 5000});
		});
      if (channel.id !== player.voiceChannel) return message.reply("Я сейчас занята.")
			  .then(message => {
				message.delete({timeout: 5000});
			});

      if (!player.queue.current) return message.reply("Ты ещё не попросил меня спеть что-нибудь, я думаю самое время для этого.")
			  .then(message => {
				message.delete({timeout: 5000});
			});

      const { title } = player.queue.current;

      player.stop();
      return //message.reply(`${title} was skipped.`)
    }
  }