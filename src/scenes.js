const { start } = require('./scenes/start');
const { endScene } = require('./scenes/end-scene');
const { getAddress } = require('./scenes/get-address');
const { getDescription } = require('./scenes/get-description');
const { getPhoto } = require('./scenes/get-photo');
const { getLocation } = require('./scenes/get-location');
const { stepHandler } = require('./scenes/step-handler');

module.exports = {
    start,
    stepHandler,
    endScene,
    getAddress,
    getDescription,
    getPhoto,
    getLocation 
}