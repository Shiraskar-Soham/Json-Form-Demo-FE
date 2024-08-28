/**
 * Component Generator
 */

/* eslint strict: ["off"] */

"use strict";

const componentExists = require("../utils/componentExists");

module.exports = {
  description: "Add an unconnected component",
  prompts: [
    {
      type: "input",
      name: "name",
      message: "What should it be called?",
      default: "Button",
      validate: (value) => {
        if (/.+/.test(value)) {
          return componentExists(value)
            ? "A component or container with this name already exists"
            : true;
        }

        return "The name is required";
      },
    },
  ],
  actions: (data) => {
    const actions = [
      {
        type: "add",
        path: "../src/{{properCase name}}/App.js",
        templateFile: "./component/App.js.hbs",
        abortOnFail: true,
      },
      {
        type: "add",
        path: "../src/{{properCase name}}/App.css",
        templateFile: "./component/App.css.hbs",
        abortOnFail: true,
      },
    ];

    return actions;
  },
};
