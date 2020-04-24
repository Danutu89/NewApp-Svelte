<script>
/*import Chart from 'chart.js';
import { onMount } from 'svelte';

export let json;

var lineChartData = {
    labels: json.views['days'],
    datasets: [{
            label: "Visits",
            backgroundColor: "rgba(48, 164, 255, 0.2)",
            fill: true,
            strokeColor: "#007bff",
            borderColor: "#007bff",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "#007bff",
            data: Object.values(json.views['new'])
        },
        {
            label: "Visits Old",
            backgroundColor: "rgba(220,220,220,0.2)",
            fill: true,
            strokeColor: "rgba(220,220,220,1)",
            borderColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: Object.values(json.views['old'])
        }
    ]
};
var doughnutData = {
    labels: ["Mobiles", "Computers"],
    datasets: [{
        label: "Devices",
        backgroundColor: ["#fff", "#007bff"],
        data: Object.values(json.main_data['devices']['new'])
    }]
}
var label_old = Object.keys(json.views['old']),
    label_new = Object.keys(json.views['new']);

onMount(async function () {
    var line = document.getElementById('line-chart').getContext('2d');
    window.myLine = new Chart(line, {
        data: lineChartData,
        type: 'line',
        options: {
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false
                    }
                }],
                yAxes: [{
                    gridLines: {
                        display: false
                    }
                }]
            },
            responsive: true,                                   
            maintainAspectRatio: true,
            tooltips: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    title: function (tooltipItem, data) {

                        return label_new[tooltipItem[0]['index']] + ' vs ' + label_old[tooltipItem[0]['index']];
                    },
                    label: function (tooltipItem, data) {
                        if (tooltipItem['datasetIndex'] == 0) {
                            var percent = Math.round(((data['datasets'][0]['data'][tooltipItem['index']] - data['datasets'][1]['data'][tooltipItem['index']]) / data['datasets'][1]['data'][tooltipItem['index']]) * 100)
                            return data['datasets'][tooltipItem['datasetIndex']]['data'][tooltipItem['index']] + ' (' + percent + '%)';
                        } else {
                            return data['datasets'][tooltipItem['datasetIndex']]['data'][tooltipItem['index']];
                        }
                    }
                },
                scales: {
                    yAxes: [{
                        id: "y-axis-1",
                        position: "left"
                    }, {
                        id: "y-axis-2",
                        position: "right"
                    }]
                }
            }
        }
    });
    var devices = document.getElementById("doughnut-chart").getContext("2d");
    window.myDoughnut = new Chart(devices, {
        type: 'doughnut',
        data: doughnutData,
        options: {
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            responsive: true,
            maintainAspectRatio: true,
            legend: {
                display: false
            },
            tooltips: {
                callbacks: {
                    title: function (tooltipItem, data) {
                        return data['labels'][tooltipItem[0]['index']];
                    },
                    label: function (tooltipItem, data) {
                        var dataset = data['datasets'][0];
                        var percent = Math.round((dataset['data'][tooltipItem['index']] / (json.main_data['devices']['new']['computer'] + json.main_data['devices']['new']['mobile'])) * 100);
                        return data['datasets'][0]['data'][tooltipItem['index']] + ' (' + percent + '%)';
                    },
                    afterLabel: function (tooltipItem, data) {
                        return '';
                    }
                }
            }
        }
    });
})
*/
</script>
<!--
<div class="dashboard">
    <div>
        <div class="main-data">
            <div class="row">
                <div class="card">
                    <div class="main">
                        <div class="data">
                            <span style="font-size: 1.4rem;">Users</span>
                            <span style="font-size: 1.8rem;">{json.main_data['users']['new']}</span>
                            <span style="    font-size: 0.7rem;margin-top: 0.5rem;height: 1.6rem;">{json.main_data['users']['perc']}</span>
                        </div>
                        <div class="icon">
                            <i class="na-user-friends"></i>
                        </div>
                    </div>
                    <div class="footer">
                        <div class="bar">
                            <div class="progress" style="width: {json.main_data['users']['p_perc']}%;"></div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="main">
                        <div class="data">
                            <span style="font-size: 1.4rem;">Posts</span>
                            <span style="font-size: 1.8rem;">{json.main_data['posts']['new']}</span>
                            <span style="font-size: 0.7rem;margin-top: 0.5rem;height: 1.6rem;">{json.main_data['posts']['perc']}</span>
                        </div>
                        <div class="icon">
                            <i class="na-pen-square"></i>
                        </div>
                    </div>
                    <div class="footer">
                        <div class="bar">
                            <div class="progress" style="width: {json.main_data['posts']['p_perc']}%;"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="card">
                    <div class="main">
                        <div class="data">
                            <span style="font-size: 1.4rem;">Replies</span>
                            <span style="font-size: 1.8rem;">{json.main_data['replies']['new']}</span>
                            <span style="    font-size: 0.7rem;margin-top: 0.5rem;height: 1.6rem;">{json.main_data['replies']['perc']}</span>
                        </div>
                        <div class="icon">
                            <i class="na-comments"></i>
                        </div>
                    </div>
                    <div class="footer">
                        <div class="bar">
                            <div class="progress" style="width: {json.main_data['replies']['p_perc']}%;"></div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="main">
                        <div class="data">
                            <span style="font-size: 1.4rem;">Views</span>
                            <span style="font-size: 1.8rem;">{json.main_data['views']['new']}</span>
                            <span style="    font-size: 0.7rem;margin-top: 0.5rem;height: 1.6rem;">{json.main_data['views']['perc']}</span>
                        </div>
                        <div class="icon">
                            <i class="na-rocket"></i>
                        </div>
                    </div>
                    <div class="footer">
                        <div class="bar">
                            <div class="progress" style="width: {json.main_data['views']['p_perc']}%;"></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div class="charts">
            <div class="line-chart" style="max-height: 300px;">
                <div class="title">
                    Page views
                </div>
                <canvas id="line-chart" style="width:100%"></canvas>
            </div>
            <div class="doughtnut-chart">
                <div class="title">
                    Devices views
                </div>
                <div style="margin-left:2rem;margin-right:2rem;margin-top: 2rem;">
                    <canvas id="doughnut-chart" width="300" height="300"></canvas>
                </div>
            </div>
        </div>
    </div>
</div>
-->