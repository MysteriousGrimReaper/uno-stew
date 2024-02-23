/* eslint-disable no-case-declarations */
const { Events } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
module.exports = {
	name: Events.MessageCreate,
	async execute(message) {},
};
