
/**
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * /web/index.js
 *
 * This code handles intial render of the bot and any rerenders triggered
 * from javascript events.
 */

var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./components/App.jsx');

const env = process.env.NODE_ENV || 'dev';
const config = require('../config.js')[env];
const bdk = require('@salesforce/refocus-bdk')(config);
const botName = require('../package.json').name;

//Room Details
const roomId = bdk.getRoomId();

/**
 * When a refocus.events is dispatch it is handled here.
 *
 * @param {Event} event - The most recent event object
 * @return null
 */
function handleEvents(event) {
  bdk.log.debug(botName + ' Event', event);
}

/**
 * When a refocus.room.settings is dispatch it is handled here.
 *
 * @param {Room} room - Room object that was dispatched
 * @return null
 */
function handleSettings(room) {
  bdk.log.debug(botName + ' Settings Change', event);
}

/**
 * When a refocus.bot.data is dispatch it is handled here.
 *
 * @param {BotData} data - Bot Data object that was dispatched
 * @return null
 */
function handleData(data) {
  bdk.log.realtime(botName + ' Bot Data', data);
}

/**
 * When a refocus.bot.actions is dispatch it is handled here.
 *
 * @param {BotAction} action - Bot Action object that was dispatched
 * @return null
 */
function handleActions(action) {
  bdk.log.realtime(botName + ' Bot Action', action);
}

/*
 * The actions to take place before load.
 */
function init() {
  renderUI();
}

/**
 * Render the react components with the data and templates needed
 */
function renderUI(){
  ReactDOM.render(
    <App />,
    document.getElementById(botName)
  );
}

//Event Handling
document.body.addEventListener('refocus.room.settings', handleSettings, false);
document.getElementById(botName)
  .addEventListener('refocus.bot.data', handleData, false);
document.getElementById(botName)
  .addEventListener('refocus.bot.actions', handleActions, false);
document.getElementById(botName)
  .addEventListener('refocus.events', handleEvents, false);

init();