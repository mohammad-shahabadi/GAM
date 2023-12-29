const withNextIntl = require('next-intl/plugin')();
const removeImports = require('next-remove-imports')();

module.exports = removeImports(withNextIntl({
    env: {
        REACT_APP_HOST: process.env.REACT_APP_HOST,
        REACT_APP_TEST_HOST: process.env.REACT_APP_TEST_HOST
    }
}));
