var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.config');

var bodyParser = require('body-parser');
var fetch = require('isomorphic-fetch');

var app = new require('express')();
app.use(bodyParser.json());

var port = 3000;

var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));
app.use(webpackHotMiddleware(compiler));

app.get("/", function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var parseBoard = function(text) {
  var rows = text.split('\n').slice(1);
  var cells = rows.reduce(function(acc, row) {
    var pos = row.split(' ');
    if(pos.length === 2) {
      var value = pos[1].replace('\r', '');
      acc[pos[0]] = acc[pos[0]] ? acc[pos[0]].concat(value) : [value];
      return acc;
    }
    return acc;
  }, {});
  return cells;
};

app.get("/board/:name", function(req, res) {
  fetch("http://www.conwaylife.com/patterns/" + req.params.name + "_106.lif")
    .then(function(response) {
      return response.text();
    })
    .then(parseBoard)
    .then(function(data) {
      res.json(data);
    })
    .catch(function(err) {
      console.error(err);
    })
});

app.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info(
      "==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.",
      port, port);
  }
});
