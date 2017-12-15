module.exports = {
    'globals': {'Promise': true},
    'extends': 'airbnb-base/legacy',
    'plugins': [
        'import'
    ],
    'rules': {
      'no-underscore-dangle': 0,
      'func-names': 0,
      'quote-props': 0,
      'max-len': [2, 130, 2, {
      'ignoreUrls': true,
      'ignoreComments': false
    }],
  }
};