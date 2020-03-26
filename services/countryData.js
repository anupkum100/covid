// ALl country data : https://pomber.github.io/covid19/timeseries.json
var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
    $scope.headerText = "World";
    $scope.indiaData = {};
    $scope.indainStateData = {};
    $scope.isCountrySelected = false;
    $scope.isApiCallInProgress = true;
    $scope.showFacts = false;
    $scope.showMyths = false;

    $scope.worldData = {
        cases: 0,
        deaths: 0,
        recovered: 0,
        new: 0,
    }

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

    getData("https://corona.lmao.ninja/countries");

    function getPercentage(category, total) {
        let number = 100 * category / total
        return number.toFixed(2)
    }

    $scope.showCountryList = () => {
        $scope.isCountrySelected = !$scope.isCountrySelected;
        // $scope.showMyths = false;
    }

    $scope.changeArea = (countryData) => {
        $scope.headerText = countryData.country;
        $scope.showMyths = false;
        $scope.showCountryList();
        if (countryData === 'World') {
            $scope.headerText = countryData;
            $scope.category[0].value = $scope.worldData.cases;
            $scope.category[1].value = $scope.worldData.deaths;
            $scope.category[2].value = $scope.worldData.recovered;
            $scope.category[3].value = $scope.worldData.new;

            $scope.category[1].percentage = getPercentage($scope.category[1].value, $scope.category[0].value);
            $scope.category[2].percentage = getPercentage($scope.category[2].value, $scope.category[0].value);
            $scope.category[3].percentage = getPercentage($scope.category[3].value, $scope.category[0].value);

        } else {
            updateAllData(countryData);
        }
    }

    function getIndianStateData() {
        $http({
            method: "GET",
            url: "https://ameerthehacker.github.io/corona-india-status/covid19-indian-states.json"
        }).then(function mySuccess(response) {
            $scope.indainStateData = Object.keys(response.data.data).map((stateData) => {
                if (!stateData.match('#') === null) {
                    return
                } else {
                    return {
                        key: stateData,
                        value: response.data.data[stateData]
                    }
                }
            });
        }, function myError(response) {
            $scope.myWelcome = response.statusText;
        });
    }

    function updateAllData(countryData) {
        $scope.selectedLocationImportantData = {
            deaths: countryData.deaths,
            total: countryData.cases
        };
        $scope.category[0].value = countryData.cases;
        $scope.category[1].value = countryData.deaths;
        $scope.category[2].value = countryData.recovered;
        $scope.category[3].value = countryData.todayCases;

        $scope.category[1].percentage = getPercentage(countryData.deaths, countryData.cases);
        $scope.category[2].percentage = getPercentage(countryData.todayCases, countryData.cases);
        $scope.category[3].percentage = getPercentage(countryData.todayCases, countryData.cases);

        getHistoryData();
        window.scrollTo(0, 0);
    }

    function createAreaChart() {

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
                    lineTension: 0.7,
                    backgroundColor: "rgba(78, 115, 223, 0.05)",
                    borderColor: "rgba(78, 115, 223, 1)",
                    pointRadius: 2,
                    pointBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointBorderColor: "rgba(78, 115, 223, 1)",
                    pointHoverRadius: 2,
                    pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                    pointHitRadius: 2,
                    pointBorderWidth: 1,
                    data
                },
                {
                    label: "Deaths",
                    lineTension: 0.7,
                    backgroundColor: "rgba(78, 115, 223, 0.05)",
                    borderColor: "#e74a3b",
                    pointRadius: 2,
                    pointBackgroundColor: "#e74a3b",
                    pointBorderColor: "#e74a3b",
                    pointHoverRadius: 2,
                    pointHoverBackgroundColor: "#e74a3b",
                    pointHoverBorderColor: "#e74a3b",
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: deaths
                },
                {
                    label: "Recovered",
                    lineTension: 0.7,
                    backgroundColor: "rgba(78, 115, 223, 0.05)",
                    borderColor: "#1cc88a",
                    pointRadius: 2,
                    pointBackgroundColor: "#1cc88a",
                    pointBorderColor: "#1cc88a",
                    pointHoverRadius: 2,
                    pointHoverBackgroundColor: "#1cc88a",
                    pointHoverBorderColor: "#1cc88a",
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: recovered
                }
                ],
            },
            options: {
                maintainAspectRatio: true,
                scales: {
                    xAxes: [{
                        gridLines: {
                            display: true,
                            drawBorder: false
                        },
                        ticks: {
                            minTicksLimit: 10
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            maxTicksLimit: 20,
                            callback: function (value, index, values) {
                                return value;
                            }
                        }
                    }],
                },
                legend: {
                    display: false
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
            url: "https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_particular_country.php?country=" + $scope.headerText,
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
        }, function myError(response) {
            $scope.myWelcome = response.statusText;
        });
    }

    $scope.getStyle = (percentage) => {
        return {
            width: percentage + '%'
        }
    }

    function getData(url) {
        $scope.isApiCallInProgress = true;
        $http({
            method: "GET",
            url
        }).then(function mySuccess(response) {
            $scope.isApiCallInProgress = false;
            $scope.countryWise = response.data;
            response.data.forEach(countryData => {
                if (countryData.country === 'India') {
                    $scope.indiaData = countryData
                    $scope.changeArea($scope.indiaData);
                }
                $scope.worldData = {
                    cases: $scope.worldData.cases + countryData.cases,
                    deaths: $scope.worldData.deaths + countryData.deaths,
                    recovered: $scope.worldData.recovered + countryData.recovered,
                    new: $scope.worldData.new + countryData.todayCases,
                }
            })
        }, function myError(response) {
        });
    }

    $scope.showOnlyMyths = () => {
        $scope.showMyths = true;
        $scope.isCountrySelected = true;
        $scope.headerText = "Myths";
    }

    $scope.clearText = () => {
        $scope.searchText = '';
    }


});