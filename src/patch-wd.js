/**
 * Add some methods to the `wd` webdriver library that make it easier to
 * interact with the `WebDriverAgent` that we use.
 *
 * @flow
 */

import callbacks from "wd/lib/callbacks";

import type WebDriverLib from "wd";

export default (wd: WebDriverLib) => {
    wd.addAsyncMethod("dismissAlert", function() {
        const cb = wd.findCallback(arguments);
        this._jsonWireCall({
            method: "POST",
            relPath: "/dismiss_alert",
            cb: callbacks.callbackWithData(cb, this),
        });
    });

    wd.addAsyncMethod("scroll", function(element, direction) {
        const cb = wd.findCallback(arguments);
        this._jsonWireCall({
            method: "POST",
            relPath: "/uiaElement/" + element + "/scroll",
            data: { direction },
            cb: callbacks.callbackWithData(cb, this),
        });
    });

    wd.addAsyncMethod("setValue", function(element, value) {
        const cb = wd.findCallback(arguments);
        this._jsonWireCall({
            method: "POST",
            relPath: "/element/" + element + "/set-value",
            data: { value: value },
            cb: callbacks.callbackWithData(cb, this),
        });
    });

    wd.addAsyncMethod("elementByA11y", function(name) {
        const cb = wd.findCallback(arguments);
        this.elementByLinkText("name=" + name, cb);
    });

    wd.addAsyncMethod("waitForElementByA11y", function(name, timeout) {
        const cb = wd.findCallback(arguments);
        this.waitForElementByLinkText("name=" + name, timeout, cb);
    });

    wd.addAsyncMethod("elementByClassNameWhenReady", function(name, timeout) {
        const cb = wd.findCallback(arguments);
        this.waitForElementByClassName(name, timeout, () => {
            this.elementByClassName(name, cb);
        });
    });

    wd.addAsyncMethod("elementByA11yWhenReady", function(name, timeout) {
        const cb = wd.findCallback(arguments);
        this.waitForElementByA11y(name, timeout, () => {
            this.elementByA11y(name, cb);
        });
    });
};

