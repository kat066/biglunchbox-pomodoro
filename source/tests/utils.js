const fs = require('fs').promises;
const path = require('path');

/**
 *
 * Grab html fragments from files and create templates for them
 *
 * @param {Object[]} templates - Templates to be added
 * @param {string} templates[].id - Id of the template node
 * @param {string} templates[].relpath - Relative path to file containing html fragment
 * @param {string} cwd - Directory where relpath gets resolved from
 */
export async function addTemplates(templates, cwd = process.cwd) {
    // String of html fragments from templates

    // Promises to keep track of finished file reads
    const promises = [];

    templates.forEach((template) => {
        const filepath = path.resolve(cwd, template.relpath);
        promises.push(
            fs.readFile(filepath)
                .then((data) => `<template id="${template.id}">${data}</template>`)
                .catch((err) => { throw err; }),
        );
    });

    const str = await Promise.all(promises)
        .then((results) => results.reduce((acc, templateContent) => acc + templateContent))
        .catch((err) => { throw err; });

    return str;
}

/**
 * Dispatches a DOMContentLoaded event for a window
 *
 * @param {Object} window - Window object of the testing environment
 */
export function dispatchDOMLoadedEvent(window) {
    window.document.dispatchEvent(new Event('DOMContentLoaded', {
        bubbles: true,
        cancelable: true,
    }));
}
