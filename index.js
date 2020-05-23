
const express = require("express");
const app = express();
app.get("/", (req, res) => res.status(200).send("Website up and running!"));
const listener = app.listen(process.env.PORT, function () {
  console.log("Website is listening on port " + listener.address().port);
});

const Discord = require("discord.js");


const client = new Discord.Client();

const config = require("./config.json");


client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
 
  client.user.setActivity(`Made by Alex_The_Gamer#6472`);
});

client.on("guildCreate", guild => {

  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Made by Alex_The_Gamer#6472`);
});

client.on("guildDelete", guild => {
  
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Made by Alex_The_Gamer#6472`);
});


client.on("message", async message => {

  if(message.author.bot) return;
  

  if(message.content.indexOf(config.prefix) !== 0) return;
  

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  
  if(command === "ping") {
   
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  if(command === "say") {

    const sayMessage = args.join(" ");
 
    message.delete().catch(O_o=>{}); 
    
      message.channel.send(sayMessage);
      
      let loggingEmbed = new Discord.RichEmbed()
      .setTitle("A wild `say` command appears!")
      .setColor("RANDOM")
      .addField("Used by:", message.author.tag)
      .addField("Channel:", message.channel)

      let logChannel = message.guild.channels.find(c => c.name === "logs")
      
      if(!logChannel) return;


      logChannel.send(loggingEmbed);
  }
    var commandsList = fs.readFileSync('commands.txt', 'utf8');
    var emoji = fs.readFileSync('emoji.txt', 'utf8');
    var rulesList = fs.readFileSync('rules.txt', 'utf8');

    if (command === "help") {
        message.channel.send(commandsList)
        message.delete().catch(O_o => { });
    }
    
    if (command === "commands") {
        message.channel.send(commandsList)
        message.delete().catch(O_o => { });
    }

    if (command === "cmds") {
        message.channel.send(commandsList)
        message.delete().catch(O_o => { });
    }
  
    if (command === "правила") {
        message.channel.send(rulesList)
        message.delete().catch(O_o => { });
    }

  if (command === "tempmute"){

    let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!tomute) return message.reply("Couldn't find user.");
    if(tomute.hasPermissions("MANAGE_MESSAGES")) return message.reply("Can't mute them!")
    let muterole = message.guild.roles.find(`name`, "Muted By BBB")
    if(!muterole){
      try{
        muterole = await message.guild.createRole({
          name: "Muted By BBB",
          color: "#000000",
          permissions: []
        })
        message.guild.channels.forEach(async (channel, id) => {
          await channel.overwritePermissions(muterole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false

        });  
      });
    }catch(e){
      console.log(e.stack);
    }
  }
  let mutetime = args[1];
  if(!mutetime) return message.reply("You didn't specify a time!")

   await(tomute.addRole(muterole.id));
   message.reply(`<@${tomute.id}> has been muted for ${ms(mutetime)}.`)

  setTimeout(function(){
   tomute.removeRole(muterole.id);
   message.channel.send(`<@${tomute.id} has been unmuted!`)
  }, ms(mutetime));

  }
       
  if(command === "kick") {

    if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
 
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }
  
  if(command === "ban") {

    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }



  if(command === "report"){

    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]))
    if(!rUser) return message.channel.send("Couldn't find user.")
    let reason = args.join(" ").slice(22);

    let reportEmbed = new Discord.RichEmbed()
    .setDescription("Reports")
    .setColor("#15f153")
    .addField("Reported user", `${rUser} with ID: ${rUser.id}`)
    .addField("Channel", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", reason)
    .addField("Reported By", `${message.author} with id: ${message.author.id}`);

    let reportschannel = message.guild.channels.find(`name`, "logs")
    if(!reportschannel) return message.channel.send("Couldn't find reports channel.");

    message.delete().catch(O_o=>{})
    reportschannel.send(reportEmbed);
    
    return;
  }
  if(command === "purge") {

    const deleteCount = parseInt(args[0], 10);
    
    
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
});
  
var fs = require('fs');

client.login(config.token);
client.on