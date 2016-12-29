/*

Disk spin planner simulator
Copyright (C) 2016  Janar Juusu

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

$( document ).ready(function() {
    drawTable();
});

function largerNumbers(value) {
    return function(element, index, array) {
        return (element >= value);
    };
}

function smallerNumbers(value) {
    return function(element, index, array) {
        return (element < value);
    };
}

function sortNumbers(a,b) {
    return a - b;
}

function NOOP(data) { // aka First Come First Serve
    var distance = 0;
    var output = [10];
    var currentPos = 10;

    $.each(data, function(index, target) {
        output.push(target);
        distance += Math.abs(currentPos-target);
        currentPos = target;
    });

    $('div.dist_noop').text(distance);
    return output;
}

function SSTF(data) { // Shortest Seek Time First
    var distance = 0;
    var output = [10];
    var currentPos = 10;

    while (data.length > 0) {
        var closest = data.reduce(function (prev, curr) {
            return (Math.abs(curr - currentPos) < Math.abs(prev - currentPos) ? curr : prev);
        });
        data = data.filter(function(e) { return e !== closest; });
        output.push(closest);
        distance += Math.abs(currentPos-closest);
        currentPos = closest;
    }

    $('div.dist_sstf').text(distance);
    return output;
}

function LOOK(data) { //
    var distance = 0;
    var output = [10];
    var currentPos = 10;

    $('div.dist_look').text(distance);
    return output;
}

function CSCAN(data) { // Circular SCAN
    var distance = 0;
    var output = [[10],-1];
    var currentPos = 10;

    var smaller = data.filter(smallerNumbers(10)).sort(sortNumbers);
    var larger  = data.filter(largerNumbers(10)).sort(sortNumbers);

    $.each(larger, function(index, target) {
        output[0].push(target);
        distance += Math.abs(currentPos-target);
        currentPos = target;
    });
    // {y: 50, marker: {enabled: true, lineWidth: 10}}
    output[0].push(50,null,0);
    output[1] = larger.length;
    distance += 50-currentPos;
    currentPos = 0;

    $.each(smaller, function(index, target) {
        output[0].push(target);
        distance += Math.abs(currentPos-target);
        currentPos = target;
    });

    $('div.dist_cscan').text(distance);
    return output;
}

function drawTable() {
    var categories = [
        'Step 0',
        'Step 1',
        'Step 2',
        'Step 3',
        'Step 4',
        'Step 5',
        'Step 6',
        'Step 7',
        'Step 8',
        'Step 9',
        'Step 10',
        'Step 11'
    ];

    var choice = $('input[name=choice]:checked', '#form').val();
    switch (choice) {
    case 'default1':
        var data = '1,10,44,2,12,3,13,20';
        break;
    case 'default2':
        var data = '2,5,13,29,7,1,18,40,49,4';
        break;
    case 'default3':
        var data = '45,6,16,9,33,28,11,37,49,25';
        break;
    default:
        var data = $('#custom').val();
    }

    var finalData = data.split(',').map(function (x) {
        return parseInt(x, 10);
    });
    var xAxis       = categories.slice(0, finalData.length+2);
    var dataNOOP    = NOOP(finalData);
    var dataSSTF    = SSTF(finalData);
    var dataLOOK    = LOOK(finalData);
    var dataCSCAN   = CSCAN(finalData);

    //$('#container').empty();

    $(function () {
        Highcharts.chart('container', {
            chart: {
                type: 'area',
                inverted: true
            },
            title: {
                text: null
            },
            subtitle: {
                style: {
                    position: 'absolute',
                    right: '0px',
                    bottom: '10px'
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -150,
                y: 100,
                floating: true,
                borderWidth: 1,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            xAxis: {
                categories: xAxis,
                labels:
                {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    text: 'Sectors'
                },
                labels: {
                    formatter: function () {
                        return this.value;
                    }
                },
                min: 0,
                max: 50,
                tickInterval: 1
            },
            plotOptions: {
                area: {
                    fillOpacity: 0.0
                }
            },
            series: [{
                name: 'NOOP/FCFS',
                data: dataNOOP
            }, {
                name: 'SSTF',
                data: dataSSTF
            }, {
                name: 'LOOK',
                data: dataLOOK
            }, {
                name: 'CSCAN',
                data: dataCSCAN[0],
                /*zones: [{
                    value: dataCSCAN[1],
                    dashStyle: 'solid'
                },{
                    value: dataCSCAN[1]+1,
                    dashStyle: 'dot'
                },{
                    value: dataCSCAN[1]+2,
                    dashStyle: 'solid'
                }]*/
            }]
        });
    });
}
