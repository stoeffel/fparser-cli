var Formula = require('fparser'),
    inquander = require('inquander'),
    inquirer = require('inquirer'),
    _ = require('lodash'),
    program = require('commander'),
    result, formula, variables;

program
    .version('0.0.1')
    .command('* <formula> [values]')
    .description('Parses a mathematical formula from a string')
    .action(function(expression, values) {
        formula = new Formula(expression);
        variables = formula.getVariables();
        if (values) {
            result = formula.evaluate(getValuesObject(values));
            console.log('Result:', result);
        } else {
            askForValues();
        }
    });

inquander.parse(program, process.argv, {
    defaultCommand: '*',
    hidden: ['values']
});

function askForValues() {
    inquirer.prompt(_.map(variables, function(variable) {
        return {
            type: 'input',
            name: variable,
            message: variable
        };
    }), function(answers) {
        result = formula.evaluate(answers);
        console.log('Result:', result);
        inquirer.prompt([{
            type: 'confirm',
            name: 'again',
            message: 'Would you like to calculate other values?'
        }], function(answer) {
            if (answer.again) {
                askForValues();
            }
        });
    });
}

function getValuesObject(values) {
    var result = [],
        obj = {};
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
