import { MongoObservable } from 'meteor-rxjs';

import { CoordsysModel } from '../models/coordsysModel';

console.log('rxjs_coordsys collection');

export const Coordsys = new MongoObservable.Collection<CoordsysModel>('coordsys');
