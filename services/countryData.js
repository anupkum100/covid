// ALl country data : https://pomber.github.io/covid19/timeseries.json
var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
    $scope.selectedArea = "World";
    $scope.indiaData = {};
    $scope.indainStateData = {};
    $scope.isCountrySelected = false;
    $scope.isApiCallInProgress = true;

    $scope.category = [{
        label: 'Total Cases',
        value: 0,
        class: "primary"
    }, {
        label: 'Total Deaths',
        value: 0,
        class: "danger"
    }, {
        label: 'Total Recoveries',
        value: 0,
        class: "success"
    }, {
        label: 'New Cases',
        value: 0,
        class: "info"
    }]

    getIndianStateData();

    $http({
        method: "GET",
        url: "https://coronavirus-monitor.p.rapidapi.com/coronavirus/worldstat.php",
        headers: {
            "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
            "x-rapidapi-key": "1c6e772606msh3c10d4d01ae157bp1dee68jsne1d22692e58a"
        }
    }).then(function mySuccess(response) {
        $scope.isApiCallInProgress = false;
        $scope.worldData = response.data;
        if ($scope.selectedArea === 'World') {
            $scope.category[0].value = response.data.total_cases;
            $scope.category[1].value = response.data.total_deaths;
            $scope.category[2].value = response.data.total_recovered;
            $scope.category[3].value = response.data.new_cases;

            $scope.category[1].percentage = getPercentage(response.data.total_deaths, response.data.total_cases);
            $scope.category[2].percentage = getPercentage(response.data.total_recovered, response.data.total_cases);
            $scope.category[3].percentage = getPercentage(response.data.new_cases, response.data.total_cases);

            createPieChart();
        }
    }, function myError(response) {
        $scope.worldData = {};
    });

    function getPercentage(category, total) {
        let number = parseInt((category).replace(',', '')) / parseInt((total).replace(',', '')) * 100;
        return number.toFixed(2)
    }

    $scope.isApiCallInProgress = true;

    $http({
        method: "GET",
        url: "https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php",
        headers: {
            "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
            "x-rapidapi-key": "1c6e772606msh3c10d4d01ae157bp1dee68jsne1d22692e58a"
        }
    }).then(function mySuccess(response) {
        $scope.isApiCallInProgress = false;
        $scope.countryWise = response.data.countries_stat;

        response.data.countries_stat.forEach(countryData => {
            if (countryData.country_name === 'India') {
                $scope.indiaData = countryData
                $scope.changeArea($scope.indiaData);
            }
        })
    }, function myError(response) {
        $scope.myWelcome = response.statusText;
    });

    $scope.showCountryList = () => {
        $scope.isCountrySelected = !$scope.isCountrySelected;
    }

    $scope.changeArea = (country) => {
        $scope.selectedArea = country.country_name;
        $scope.showCountryList();
        if (country === 'World') {
            $scope.selectedArea = country;
            $scope.category[0].value = $scope.worldData.total_cases;
            $scope.category[1].value = $scope.worldData.total_deaths;
            $scope.category[2].value = $scope.worldData.total_recovered;
            $scope.category[3].value = $scope.worldData.new_cases;

            $scope.category[1].percentage = getPercentage($scope.worldData.total_deaths, $scope.worldData.total_cases);
            $scope.category[2].percentage = getPercentage($scope.worldData.total_recovered, $scope.worldData.total_cases);
            $scope.category[3].percentage = getPercentage($scope.worldData.new_cases, $scope.worldData.total_cases);

            createPieChart();

        } else {
            updateAllData(country);
        }

    }

    function getIndianStateData() {
        $http({
            method: "GET",
            url: "https://ameerthehacker.github.io/corona-india-status/covid19-indian-states.json"
        }).then(function mySuccess(response) {
            $scope.indainStateData = Object.keys(response.data.data).map((stateData) => {
                return {
                    key: stateData,
                    value: response.data.data[stateData]
                }

            });
        }, function myError(response) {
            $scope.myWelcome = response.statusText;
        });
    }

    function updateAllData(countryData) {
        $scope.category[0].value = countryData.cases;
        $scope.category[1].value = countryData.deaths;
        $scope.category[2].value = countryData.total_recovered;
        $scope.category[3].value = countryData.new_cases;

        $scope.category[1].percentage = getPercentage(countryData.deaths, countryData.cases);
        $scope.category[2].percentage = getPercentage(countryData.total_recovered, countryData.cases);
        $scope.category[3].percentage = getPercentage(countryData.new_cases, countryData.cases);

        getHistoryData();
        window.scrollTo(0, 0);
    }

    function createPieChart() {
        var ctx = document.getElementById("myPieChart");
        totalPercentage = 100 - $scope.category[1].percentage - $scope.category[2].percentage - $scope.category[3].percentage;

        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [$scope.category[0].label, $scope.category[1].label, $scope.category[2].label, $scope.category[3].label],
                datasets: [{
                    data: [totalPercentage, $scope.category[1].percentage, $scope.category[2].percentage, $scope.category[3].percentage],
                    backgroundColor: ['#abcabc', '#4e73df', '#1cc88a', '#e74a3b'],
                    hoverBackgroundColor: ['#000', '#000', '#000', '#000'],
                    hoverBorderColor: "rgba(234, 236, 244, 1)",
                }],
            },
            options: {
                maintainAspectRatio: true,
                tooltips: {
                    backgroundColor: "rgb(255,255,255)",
                    bodyFontColor: "#858796",
                    borderColor: '#dddfeb',
                    borderWidth: 1,
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: false,
                    caretPadding: 10,
                },
                legend: {
                    display: true
                },
                cutoutPercentage: 80,
            },
        });

    }

    function createAreaChart() {

        // Area Chart Example
        var ctx = document.getElementById("myAreaChart");

        let labels = $scope.graphData.map(historyData => historyData.data.record_date.split(' ')[0]);
        let data = $scope.graphData.map(historyData => historyData.data.total_cases.replace(',', ''));
        let deaths = $scope.graphData.map(historyData => historyData.data.total_deaths.replace(',', ''));
        let recovered = $scope.graphData.map(historyData => historyData.data.total_recovered.replace(',', ''));

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: "Infected",
                    lineTension: 0.3,
                    backgroundColor: "rgba(78, 115, 223, 0.05)",
                    borderColor: "rgba(78, 115, 223, 1)",
                    pointRadius: 3,
                    pointBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointBorderColor: "rgba(78, 115, 223, 1)",
                    pointHoverRadius: 3,
                    pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data
                },
                {
                    label: "Deaths",
                    lineTension: 0.3,
                    backgroundColor: "rgba(78, 115, 223, 0.05)",
                    borderColor: "#e74a3b",
                    pointRadius: 3,
                    pointBackgroundColor: "#e74a3b",
                    pointBorderColor: "#e74a3b",
                    pointHoverRadius: 3,
                    pointHoverBackgroundColor: "#e74a3b",
                    pointHoverBorderColor: "#e74a3b",
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: deaths
                },
                {
                    label: "Recovered",
                    lineTension: 0.3,
                    backgroundColor: "rgba(78, 115, 223, 0.05)",
                    borderColor: "#1cc88a",
                    pointRadius: 3,
                    pointBackgroundColor: "#1cc88a",
                    pointBorderColor: "#1cc88a",
                    pointHoverRadius: 3,
                    pointHoverBackgroundColor: "#1cc88a",
                    pointHoverBorderColor: "#1cc88a",
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: recovered
                }],
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 25,
                        top: 25,
                        bottom: 0
                    }
                },
                scales: {
                    xAxes: [{
                        time: {
                            unit: 'date'
                        },
                        gridLines: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            maxTicksLimit: 10
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            maxTicksLimit: 10,
                            padding: 10,
                            // Include a dollar sign in the ticks
                            callback: function (value, index, values) {
                                return value
                            }
                        },
                        gridLines: {
                            color: "rgb(234, 236, 244)",
                            zeroLineColor: "rgb(234, 236, 244)",
                            drawBorder: false,
                            borderDash: [2],
                            zeroLineBorderDash: [2]
                        }
                    }],
                },
                legend: {
                    display: true
                },
                tooltips: {
                    backgroundColor: "rgb(255,255,255)",
                    bodyFontColor: "#858796",
                    titleMarginBottom: 10,
                    titleFontColor: '#6e707e',
                    titleFontSize: 14,
                    borderColor: '#dddfeb',
                    borderWidth: 1,
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: false,
                    intersect: false,
                    mode: 'index',
                    caretPadding: 10,
                    callbacks: {
                        label: function (tooltipItem, chart) {
                            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                            return datasetLabel + ': ' + tooltipItem.yLabel
                        }
                    }
                }
            }

        });
    }

    function getHistoryData() {
        $http({
            method: "GET",
            url: "https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_particular_country.php?country=" + $scope.selectedArea,
            headers: {
                "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
                "x-rapidapi-key": "1c6e772606msh3c10d4d01ae157bp1dee68jsne1d22692e58a"
            }
        }).then(function mySuccess(response) {
            $scope.historyData = response.data.stat_by_country;
            $scope.labelList = [];
            $scope.graphData = [];

            response.data.stat_by_country.forEach((data, index) => {
                if (!$scope.labelList.includes(data.record_date.split(' ')[0])) {
                    $scope.graphData.push({
                        data
                    })
                    $scope.labelList.push(data.record_date.split(' ')[0]);

                }
            })
            createAreaChart();
            createPieChart();
        }, function myError(response) {
            $scope.myWelcome = response.statusText;
        });
    }

    $scope.getStyle = (percentage) => {
        return {
            width: percentage + '%'
        }
    }


});