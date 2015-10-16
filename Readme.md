# Robot Army
A library for automated iOS testing

It wrangles `simctl`, `WebDriverAgent`, `Simulator.app` and `wd` to give you maximum ease in taking over the world.

Requires Xcode version 6 or 7.

## Typical Usage

```js
import {setup} from 'robot-army';

const main = async () => {
  const {driver} = await setup({
    app: {
      path: '/path/to/my/app',
      id: 'org.khanacademy.my.app',
    },
    device: {
      name: 'iPad 2',
      version: 'iOS 8.4',
    },
    port: 7434, // the port webdriver will use
    args: ['-SomeArg', 'SomeVal'], // process arguments for your app
  });

  await driver.elemenyByA11y('Search').click();

  // control your app!
};

main()
  .catch(err => console.error('Error:', err))
  .then(() => process.exit());
```

## Multiple Simulators
It is an army, after all.

In order to harness the power of multiple simulators, you'll need to create some devices. At the moment, RobotArmy doesn't do this for you -- you have to create them with `simctl`, like so:

```
xcrun simctl create ipad-0 com.apple.CoreSimulator.SimDeviceType.iPad-2 com.apple.CoreSimulator.SimRuntime.iOS-8-4
```

Those magic strings came from `xcrun simctl list`, and `ipad-0` is the name we are giving to the new device. Use `ipad-0` instead of `iPad 2` in the above code to use your new device.

Say you've created `ipad-` 0 - 10, now you can run `setup()` 10 times, giving each name in turn. You now have 10 simulators at your command!

Note that there are diminishing returns in there somewhere. On my MBP, the simulators start to slow down after about 5. On a Mac Mini, it maxes at about 3.

## Mocha?
Works great. Mocha supports async functions being passed to `it()` and friends, so you should be just fine.
