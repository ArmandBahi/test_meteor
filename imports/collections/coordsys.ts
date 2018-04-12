import { Mongo } from 'meteor/mongo';
import { CoordsysModel } from '../models/coordsys';

const Coordsys = new Mongo.Collection('coordsys');
Coordsys.attachSchema(CoordsysModel);

export Coordsys;
