'use strict';

const parserOpts = require('./parser-opts');
const readPkgUp = require('read-pkg-up');

const {
  packageJson: { noMajorBump },
} = readPkgUp.sync();

module.exports = {
  parserOpts,

  whatBump: commits => {
    let level = 2;
    let breakings = 0;
    let features = 0;

    commits.forEach(commit => {
      if (commit.notes.length > 0) {
        breakings += commit.notes.length;

        if (Array.isArray(noMajorBump) && noMajorBump.includes(commit.scope)) {
          level = 1;
        } else {
          level = 0;
        }
      } else if (commit.type === 'feat') {
        features += 1;
        if (level === 2) {
          level = 1;
        }
      }
    });

    return {
      level: level,
      reason:
        breakings === 1
          ? `There is ${breakings} BREAKING CHANGE and ${features} features`
          : `There are ${breakings} BREAKING CHANGES and ${features} features`,
    };
  },
};
