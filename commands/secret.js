/*
THIS IS JUST THE COMMAND IT SELF, IF YOU USE THIS EXACTLY THEN YOU WILL NEED A WAY TO LOAD THE FILE LIKE THE FOLLOWING HERE:
https://solaris.codes/erelajs/guides/moreCommands.html#before-you-start

YOU ALSO NEED TO INITIATE THE MANAGER AS SHOWN HERE:
https://solaris.codes/erelajs/guides/basics.html#first-start

Or copy the code inside the run function as its simply the message and arguments.
*/

module.exports = {
    name: "secret",
    run: async(message) => { 
	  message.delete();
	  const userId = message.author.id;
	  const mesAut = message.member;
	  const secretChannel = message.client.channels.cache.get('758324301199310890')
	  const voiceLimit = secretChannel.userLimit;
	  let voiceCur = secretChannel.members.size;

	  //console.log(secretChannel.userLimit);
	  //console.log(secretChannel.members.size);
	  if (voiceLimit > voiceCur) {
		mesAut.voice.setChannel(secretChannel);
	  }
	  else {
		message.reply("Уже занято :eyes:")
			 .then(message => {
						message.delete({timeout: 5000});
					});
	  }
      return //message.reply(`${title} was skipped.`)
    }
  }