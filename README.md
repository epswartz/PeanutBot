# PeanutBot
A bot which has a couple functions for the Peanut Gallery WoW Guild discord server:

1. Allows users to assign themselves the "DPS", "Heals", or "Tank" role.
2. Allows moderators and admins to call `!purge` and kicks all server members that don't have one of the `memberRoles` specified in the config.

Create a config.json:
```
{
  "token": "xxx",
  "server": "xxx",
  "dpsRoleId": "xxx",
  "healsRoleId": "xxx",
  "tanksRoleId": "xxx",
  "guildMemberRoleId": "xxx",
  "visitorRoleId": "xxx"
}
```

Install dependencies and Start the bot:
```
npm install
npm start
```
