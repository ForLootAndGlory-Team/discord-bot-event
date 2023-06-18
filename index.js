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
    totalCompound()
    compoundAll()

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
        if (result.bool === true) {
            const channel = client.channels.cache.get('916655352827744326');
            channel.send("<@" + result.user + "> Your Role " + result.userRole + " has been successfully assigned")
            await getRandomGif('pirate', channel)
        }
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

client.login(process.env.TOKEN);