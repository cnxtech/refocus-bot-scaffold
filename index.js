/**
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * ./index.js
 *
 * This code handles will listen to refocus and handle any activity
 * that requires the bot server attention.
 */

require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const { env } = require('./config.js');
const PORT = require('./config.js').port;
const config = require('./config.js')[env];
const { socketToken } = config;
const packageJSON = require('./package.json');
const bdk = require('@salesforce/refocus-bdk')(config);

// Installs / Updates the Bot
bdk.installOrUpdateBot(packageJSON);

/**
 * When a refocus.events is dispatch it is handled here.
 *
 * @param {Event} event - The most recent event object
 */
function handleEvents(event){
  bdk.log.debug('Event', event);
}

/**
 * When a refocus.room.settings is dispatch it is handled here.
 *
 * @param {Room} room - Room object that was dispatched
 */
function handleSettings(room){
  bdk.log.debug('Settings Change', room);
}

/**
 * When a refocus.bot.data is dispatch it is handled here.
 *
 * @param {BotData} data - Bot Data object that was dispatched
 */
function handleData(data){
  bdk.log.realtime('Bot Data', data);
}

/**
 * When a refocus.bot.actions is dispatch it is handled here.
 *
 * @param {BotAction} action - Bot Action object that was dispatched
 */
function handleActions(action){
  bdk.log.realtime('Bot Action', action);
}

// Event Handling
bdk.refocusConnect(app, socketToken, packageJSON.name);
app.on('refocus.events', handleEvents);
app.on('refocus.bot.actions', handleActions);
app.on('refocus.bot.data', handleData);
app.on('refocus.room.settings', handleSettings);
app.use(express.static('web/dist'));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'dist', 'index.html'));
});

http.Server(app).listen(PORT, () => {
  bdk.log.info('listening on: ', PORT);
});
