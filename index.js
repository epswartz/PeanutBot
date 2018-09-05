var config = require('./config.json')
const Discord = require('discord.js');
var https = require('https');
var fs = require('fs');
const client = new Discord.Client();

var bunyan = require('bunyan');
var log = bunyan.createLogger({name: "DiscordWoWRoleBot"});

// Toggles the given role on the given user.
// First arg is a GuildMember
// Second arg is roleId
function toggle(member, roleId){
  if(!member.roles.get(roleId)){ // if doesn't have
    member.addRole(roleId)
  } else { // else has
    member.removeRole(roleId)
  }
}

function kickMembers(list){
  var ret = "**Kicked non-Peanuts:**\n"
  list.forEach((member) => {
    ret += "\t`" + member.displayName + "`\n"
    member.kick()
  })
  return ret
}

// Checks admin status of a GuildMember based on the adminRoles given in config
function isAdmin(m){
  var ret = false
  config.adminRoles.forEach((adminRole) => {
    if (m.roles.has(adminRole)){
      ret = true
    }
  })
  return ret
}

// Checks WoW guild membership status of a GuildMember based on the memberRoles given in config
function isGuildMember(m){
  var ret = false
  config.memberRoles.forEach((memberRole) => {
    if (m.roles.has(memberRole)){
      ret = true
    }
  })
  return ret
}

client.on('ready', () => {
  log.info({user: client.user.tag}, 'Logged in');
});

client.on('message', msg => {

  if (msg.guild && msg.guild.id && msg.guild.id === config.server && isGuildMember(msg.member)) {
    if (msg.content === '!r dps') {
      log.info({role: 'DPS', user: msg.author.tag, id: msg.author.id}, 'Toggling role')
      toggle(msg.guild.members.get(msg.author.id), config.dpsRoleId)
    } else if (msg.content === '!r heals') {
      log.info({role: 'Heals', user: msg.author.tag, id: msg.author.id}, 'Toggling role')
      toggle(msg.guild.members.get(msg.author.id), config.healsRoleId)
    } else if (msg.content === '!r tanks') {
      log.info({role: 'Tanks', user: msg.author.tag, id: msg.author.id}, 'Toggling role')
      toggle(msg.guild.members.get(msg.author.id), config.tanksRoleId)
    } else if (msg.content === '!r version') {
      msg.channel.send('**Version:** `1.1.0`\n**Publish Date:** `09/05/2018`\n**Maintainer:** `@Exnur#0001`')

    } else if (msg.content.startsWith('!r ')) {
      msg.channel.send('**Usage:**\n`!r <dps/heals/tanks>` - Toggle the given role on/off for yourself\n`!r version` - Print Bot Version Info')

    } else if (msg.content === '!purge') {
      if(isAdmin(msg.member)){ // only admins can purge
        var kickList = []
        msg.guild.members.forEach((member) => {
          if(!isGuildMember(member)){
            kickList.push(member)
          }
        })
        msg.channel.send(kickMembers(kickList))
      } else {
        msg.channel.send("**Error**: You are not authorized to use this command")
      }
    }
  }
});

client.on('error', (errEvent) => {
    if(err){
      log.error({err: errEvent}, 'Caught Error event');
    }
});


client.login(config.token);
