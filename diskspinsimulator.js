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

function NOOP(data) { // aka First Come First Serve
    var distance = 0;
    $('div.dist_noop').text(distance);
    return data;
}

function SSTF(data) { // Shortest Seek Time First
    var distance = 0;
    $('div.dist_sstf').text(distance);
    return data;
}

function LOOK(data) { //
    var distance = 0;
    $('div.dist_look').text(distance);
    return data;
}

function CSCAN(data) { // Circular SCAN
    var distance = 0;
    $('div.dist_cscan').html(distance);
    return data;
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
        'Step 10'
    ]

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

    var finalData   = data.split(',');
    var xData       = categories.slice(0, finalData.length+1);
    var dataNOOP    = NOOP(finalData);
    var dataSSTF    = SSTF(finalData);
    var dataLOOK    = LOOK(finalData);
    var dataCSCAN   = CSCAN(finalData);

    $('#container').empty();

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
                categories: xData
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
                    fillOpacity: 0.5
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
                data: dataCSCAN
            }]
        });
    });

}

/*

function drawTable() {
    var choice = document.getElementById('form').choice.value;
    var data = form.custom.value;
    switch (choice) {
    case "default1":
        data = "1,10,44,2,12,3,13,20";
        break;
    case "default2":
        data = "2,5,13,29,7,1,18,40,49,4";
        break;
    case "default3":
        data = "45,6,16,9,33,28,11,37,49,25";
        break;
    }

    var finalData = data.split(",");

    var e = document.getElementById('method');
    var method = e.options[e.selectedIndex].value;
    switch(method) {
    case "CSCAN":
        var graphData = CSCAN(finalData);
        break;
    case "SSTF":
        var graphData = SSTF(finalData);
        break;
    case "LOOK":
        var graphData = LOOK(finalData);
        break;
    default:
        var graphData = NOOP(finalData);
    }

    document.getElementById('table').innerHTML = '';
}
*/
