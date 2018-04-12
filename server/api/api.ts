import { Meteor } from 'meteor/meteor';
import { Coordsys } from '../../imports/collections/coordsys';

// const Matrix = require('./print_xyz/matrix');
// const oMatrix = new Matrix({});


console.log('API Loaded');



if (Meteor.isServer) {

    // Global API configuration
    var Api = new Restivus({
      useDefaultAuth: true,
      prettyJson: true
    });

    Api.addCollection(Coordsys);
    // Api.addCollection(Items);
}
