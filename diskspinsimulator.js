/*

Disk spin planner simulator
Copyright (C) 2017  Janar Juusu

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
    drawGraph();
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

function sortNumbersAsc(a,b) {
    return a - b;
}

function sortNumbersDesc(a,b) {
    return b-a;
}

function NOOP(data) { // aka First Come First Serve
    var distance = 0;
    var output = [10];
    var currentPos = 10;

    for (var i = 0, len = data.length; i < len; i++) {
        output.push(data[i]);
        distance += Math.abs(currentPos-data[i]);
        currentPos = data[i];
    }

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

    var smaller = data.filter(smallerNumbers(10)).sort(sortNumbersDesc);
    var larger  = data.filter(largerNumbers(10)).sort(sortNumbersAsc);

    for (var i = 0, len1 = larger.length; i < len1; i++) {
        output.push(larger[i]);
        distance += Math.abs(currentPos-larger[i]);
        currentPos = larger[i];
    }

    for (var a = 0, len2 = smaller.length; a < len2; a++) {
        output.push(smaller[a]);
        distance += Math.abs(currentPos-smaller[a]);
        currentPos = smaller[a];
    }

    $('div.dist_look').text(distance);
    return output;
}

function CSCAN(data) { // Circular SCAN
    var distance = 0;
    var output = [[10],0,0,0];
    var currentPos = 10;

    var smaller = data.filter(smallerNumbers(10)).sort(sortNumbersAsc);
    var larger  = data.filter(largerNumbers(10)).sort(sortNumbersAsc);

    for (var i = 0, len1 = larger.length; i < len1; i++) {
        output[0].push(larger[i]);
        distance += Math.abs(currentPos-larger[i]);
        currentPos = larger[i];
    }

    if(currentPos === 49) {
        output[0].push({x: len1, y: 0});
        output[1] = len1-0.05;
        output[2] = len1+0.05;
        output[3] = len1+0.08;
    } else {
        output[0].push({x: len1+1, y: 49});
        output[0].push({x: len1+1, y: 0});
        output[1] = len1+0.95;
        output[2] = len1+1.03;
        output[3] = len1+1.05;
        distance += 49-currentPos;
    }
    distance += 49;
    currentPos = 0;

    for (var a = 0, len2 = smaller.length; a < len2; a++) {
        output[0].push({x: len1+2+a, y: smaller[a]});
        distance += Math.abs(currentPos-smaller[a]);
        currentPos = smaller[a];
    }

    $('div.dist_cscan').text(distance);
    return output;
}

function collectData() {
    var choice = $('input[name=choice]:checked', '#form').val();

    var cases = {
        example1: function() { return '1,10,44,2,12,3,13,20'; },
        example2: function() { return '2,5,13,29,7,1,18,40,49,4'; },
        example3: function() { return '45,6,16,9,33,28,11,37,49,25'; },
        _default: function() { return $('#custom').val(); }
    };
    var data = cases[choice] ? cases[choice]() : cases._default();
    var finalData = data.split(',').map(function (x) { return parseInt(x, 10); });

    var processed = {
        NOOP:   NOOP(finalData),
        SSTF:   SSTF(finalData),
        LOOK:   LOOK(finalData),
        CSCAN:  CSCAN(finalData)
    };
    return processed;
}

function drawGraph() {
    var graphData = collectData();

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
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.series.name +'</b><br/>Step '+
                        this.x +': Sector '+ this.y;
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -150,
                y: 100,
                title: {
                    text: 'Legend'
                },
                floating: true,
                draggable: true,
                borderWidth: 1,
                backgroundColor: '#FFFFFF'
            },
            xAxis: {
                labels: {
                    enabled: true
                },
                tickInterval: 1
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
                max: 49,
                tickInterval: 1
            },
            plotOptions: {
                area: {
                    fillOpacity: 0.0
                }
            },
            series: [{
                name: 'NOOP/FCFS',
                data: graphData.NOOP
            }, {
                name: 'SSTF',
                data: graphData.SSTF
            }, {
                name: 'LOOK',
                data: graphData.LOOK
            }, {
                name: 'CSCAN',
                data: graphData.CSCAN[0],
                symbol: 'circle',
                zoneAxis: 'x',
                zones: [{
                    value: graphData.CSCAN[1] }, {
                    dashStyle: 'dot' }, {
                    value: graphData.CSCAN[2] }, {
                    dashStyle: 'solid' }, {
                    value: graphData.CSCAN[3] }, {
                    dashStyle: 'dot'
                }]
            }]
        });
    });
}
