const withNextIntl = require('next-intl/plugin')();

module.exports = withNextIntl({
    env: {
        REACT_APP_HOST: process.env.REACT_APP_HOST,
        REACT_APP_TEST_HOST: process.env.REACT_APP_TEST_HOST
    }
});
