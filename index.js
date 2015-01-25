var fs = require('fs');

var input = process.argv[2];
var output = process.argv[3];
var offset = parseInt(process.argv[4], 10);


var subtitles = fs.readFileSync(input).toString();

function pad ( num, size ) {
  if (num.toString().length >= size) return num;
  return ( Math.pow( 10, size ) + Math.floor(num) ).toString().substring( 1 );
}

var shifted = subtitles.split('\n').map(function(sub) {
    return {
        time: sub.split(':').slice(0, 3),
        content: sub.split(':')[3]
    };
}).map(function(sub) {
    return {
        time: sub.time.reverse().map(function(part, index) { return parseInt(part, 10) * Math.pow(60, index); }).reduce(function(curr, prev) { return curr + prev; }),
        content: sub.content
    };
}).map(function(sub) {
    return {
        time: sub.time + offset,
        content: sub.content
    };
}).map(function(sub) {
    return (function(value) {
            var time = [ ];
            var part;

            value -= 3600 * (part = Math.floor(value / 3600));
            time.push(part);

            value -= 60 * (part = Math.floor(value / 60));
            time.push(part);

            time.push(value);

            return time.map(function(part) { return pad(part, 2); }).join(':');
        })(sub.time) + ':' + sub.content
}).join('\n');

fs.writeFileSync(output, shifted);
