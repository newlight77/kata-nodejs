import {DemoApplication} from './application';
import {ApplicationConfig} from '@loopback/core';

export {DemoApplication};

export async function main(options?: ApplicationConfig) {
  const app = new DemoApplication(options);

  try {
    await app.start();
  } catch (err) {
    console.error(`Unable to start application: ${err}`);
  }
  return app;
}
