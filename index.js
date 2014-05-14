var Formula = require('fparser'),
    inquander = require('inquander'),
    _ = require('lodash'),
    program = require('commander');

program
    .version('0.0.1')
    .command('* <formula> [values]')
    .description('Parses a mathematical formula from a string')
    .action(function(formula, values) {
        var values = getValuesObject(values),
            result = Formula.calc(formula, values);
        console.log('Formula:', formula);
        console.log('Values:', values);
        console.log('Result:', result);
    });

inquander.parse(program, process.argv, {
    defaultCommand: '*'
});

function getValuesObject(values) {
    var result = [], obj = {};
    values = values.split(',');
    _.each(values, function(value) {
        var split = value.split('='),
            name = split[0].trim();
        value = parseInt(split[1]);
        if (obj[name]) {
            result.push(obj);
            obj = {};
        }
        obj[name] = value;
    });
    result.push(obj);
    return result;
}
