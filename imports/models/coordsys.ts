// import { SimpleSchema } from 'simple-schema';
console.log('1');
export const CoordsysModel = new SimpleSchema({
    srid: {
        type: String
    },
    extent: {
        type: String
    }
});
