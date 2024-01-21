require('dotenv').config()
const axios = require('axios');
const {SlashCommandBuilder} = require('discord.js');

var properties = ['symbol', 'total_supply', 'quote'];
var quoteProperties = ['price', 'volume_24h','percent_change_7d'];
var currency = 'USD';
module.exports = {
    data : new SlashCommandBuilder()
    .setName('cryptoprice')
    .setDescription('Provides updated crypto prices!')
    .addStringOption(option => 
        option
            .setName('ticker')
            .setDescription('The symbol to lookup')
            .setRequired(true)),
    async execute(interaction){
        const ticker = interaction.options.getString('ticker');

        response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${ticker}`, {
            headers: {
                'X-CMC_PRO_API_KEY': process.env.CMCKEY,
            },
        });

        let resp = ``;
        var data = response.data.data;
        Object.keys(data).forEach((ticker) => {
            resp = resp.concat(`${ticker}:\n`);
            Object.keys(data[ticker]).forEach((prop) => {
                if(properties.includes(prop))
                {
                    if(prop == 'quote')
                    {
                        resp = resp.concat(`\t${prop}:\n`);
                        Object.keys(data[ticker][prop][currency]).forEach((priceProp) => {
                            if(quoteProperties.includes(priceProp))
                            resp = resp.concat(`\t\t${priceProp}: ${data[ticker][prop][currency][priceProp]}\n`);
                        })
                    }
                    else
                    {
                        resp = resp.concat(`\t${prop}: ${data[ticker][prop]}\n`);
                    }
                }
            })
            resp = resp.concat(`\n`);
        });
        
        await interaction.reply(resp);
    }
}