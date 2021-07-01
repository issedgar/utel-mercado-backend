import Server from './server';
import color from 'colors/safe';
import * as dotenv from 'dotenv';

dotenv.config();

const port: number = +process.env.PORT!;
const server = Server.init( port );

server.start( () => {
    console.log(`Server ${ color.green('online') } in port ${ color.bold( port.toString() ) }`);
});

