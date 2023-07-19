require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const {
    modalBuild
} = require('./helper/embed.js');
const { ClaimRole } = require('./helper/claimRole.js');
const { checkmessage } = require('./msg/MessageCreate.js')
const {
    Client,
    GatewayIntentBits,
    Partials,
    Events,
    Collection } = require('discord.js');
const { compoundAll } = require('./compound/Compound');
const { updatePriceActivity } = require('./coingecko/Price');
const { EventsListener } = require('./events/Events');
const { getRandomGif } = require('./helper/Helper');

const { antiSpam } = require('./moderation/antiSpam.js')

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Channel, Partials.Message, Partials.Reaction, Partials.User],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.once('ready', async () => {
    console.log('The Kid on Fire');

    //Loop
    updatePriceActivity('for-loot-and-glory', client)
    compoundAll()

    //Listener
    EventsListener(client)
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId === 'ShowModal') {
        console.log('Show Modal : ', interaction.user.id)
        await interaction.showModal(modalBuild)
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === 'ClaimRole') {
        const polygonAddress = interaction.fields.getTextInputValue('ethereumAddressIput')
        const signMessage = interaction.fields.getTextInputValue('messageSignInput')
        const userId = interaction.user.id
        const result = await ClaimRole(polygonAddress, signMessage, userId, client)
        console.log(`${result.user} Your Role ${result.userRole} has been successfully assigned`)
        await interaction.reply({ content: `${result.user} Your Role ${result.userRole} has been successfully assigned`, ephemeral: true },
        );
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.on(Events.MessageCreate, async (msg) => {
    await checkmessage(msg);
    antiSpam.message(msg);
}
);

client.on(Events.GuildMemberRemove, async (member) => {
    antiSpam.userleave(member);
});


// add Role
client.on(Events.MessageReactionAdd, async (reaction, user) => {
    console.log('messageReactionAdd');
    // When a reaction is received, check if the structure is partial
    if (reaction.partial) {
        // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Something went wrong when fetching the message:', error);
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }

    const { name } = reaction.emoji
    const member = reaction.message.guild.members.cache.get(user.id)
    //ID du message où il faut réagir
    if (reaction.message.id === '910490479332839464') {
        switch (name) {
            case '✅':
                //Lubberland
                member.roles.add('1094612796030865428')
                break;
        }
    }
});

// Remove role
client.on(Events.MessageReactionRemove, async (reaction, user) => {
    console.log('messageReactionRemove');
    // When a reaction is received, check if the structure is partial
    if (reaction.partial) {
        // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Something went wrong when fetching the message:', error);
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }
    const { name } = reaction.emoji
    const member = reaction.message.guild.members.cache.get(user.id)
    //ID du message où il faut réagir
    if (reaction.message.id === '910490479332839464') {
        switch (name) {
            case '✅':
                //Lubberland
                member.roles.remove('1094612796030865428')
                break;
        }
    }
});

client.login(process.env.TOKEN);