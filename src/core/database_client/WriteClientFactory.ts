/*
  File: WriteClientFactory.ts
  Version: 1.0.0
  Type: Typescript module
  Author: Andrea Trevisin
  Email: andre.trevisin@gmail.com
  Date: 30/03/2019
  Desc: Module containing the definition of the factory class
        used to instantiate WriteClient subclasses
  Changelog:
    Andrea Trevisin, 02/04/19, deleted WriteClientCreator
    Andrea Trevisin, 01/04/19, added WriteClientCreator (experimental)
    Andrea Trevisin, 31/04/19, implemented ConcreteWriteClientFactory
    Andrea Trevisin, 30/04/19, created file and implemented interface WriteClient
*/

import {
  InfluxDB,
} from "influx";
import InfluxWriteClient from "./InfluxWriteClient";
import WriteClient from "./WriteClient";

export interface WriteClientFactory {
  makeInfluxWriteClient(host: string, port: string, defaultDB: string, credentials?: [string, string]): WriteClient;
}

export class ConcreteWriteClientFactory implements WriteClientFactory {
  /**
   * @param host The network address of the server to which the client must connect.
   * @param port  The port through the server is listening for requests from the client.
   * @param defaultDB  The name of the default database for the client to write to.
   * @param credentials OPTIONAL: The credentials needed to connect to the server.
   * @returns A fully configured InfluxWriteClient.
   */
  public makeInfluxWriteClient(host: string, port: string, defaultDB: string, credentials?: [string, string])
    : InfluxWriteClient {
    const address: string = host + ":" + port;
    const login: string = credentials ?
      credentials[0] + ":" + credentials[1] + "@" :
      "";
    const dsn = "http://" + login + address;
    const influx: InfluxDB = new InfluxDB(dsn + "/" + defaultDB);
    try {
      influx.getDatabaseNames()
        .then((names) => {
          if (!names.includes(defaultDB)) {
            return influx.createDatabase(defaultDB);
          }
        });
    } catch (err) {
      console.log("Creating default database at: " + dsn + " has encountered the following error: " + err);
    }
    return new InfluxWriteClient(dsn, defaultDB, influx);
  }
}
