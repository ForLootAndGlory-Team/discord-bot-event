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
const { compoundAll, totalCompound } = require('./compound/Compound');
const { updatePriceActivity } = require('./coingecko/Price');
const { EventsListener } = require('./events/Events');
const { getRandomGif } = require('./helper/Helper');

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel],
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
    totalCompound(client)
    compoundAll(client)

    //Listener
    EventsListener(client)
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId === 'ShowModal') {
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
        interaction.reply({ content: `${result.user} Your Role ${result.userRole} has been successfully assigned`, ephemeral: true },
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

client.on("messageCreate", async (msg) => {
    await checkmessage(msg);
}
);

// add Role
client.on('messageReactionAdd', (reaction, user) => {
    console.log('messageReactionAdd');
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
client.on('messageReactionRemove', (reaction, user) => {
    console.log('messageReactionRemove');
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