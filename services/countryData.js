var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
    $scope.selectedArea = "World";

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

    $http({
        method: "GET",
        url: "https://coronavirus-monitor.p.rapidapi.com/coronavirus/worldstat.php",
        headers: {
            "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
            "x-rapidapi-key": "1c6e772606msh3c10d4d01ae157bp1dee68jsne1d22692e58a"
        }
    }).then(function mySuccess(response) {
        $scope.worldData = response.data;
        $scope.category[0].value = response.data.total_cases;
        $scope.category[1].value = response.data.total_deaths;
        $scope.category[2].value = response.data.total_recovered;
        $scope.category[3].value = response.data.new_cases;

        $scope.category[1].percentage = getPercentage(response.data.total_deaths, response.data.total_cases);
        $scope.category[2].percentage = getPercentage(response.data.total_recovered, response.data.total_cases);
        $scope.category[3].percentage = getPercentage(response.data.new_cases, response.data.total_cases);

        createPieChart();
        createAreaChart();

    }, function myError(response) {
        $scope.worldData = {};
    });

    function getPercentage(category, total) {
        return 100 * (parseInt((category).replace(',', '')) / parseInt((total).replace(',', ''))).toFixed(4)
    }

    $http({
        method: "GET",
        url: "https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php",
        headers: {
            "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
            "x-rapidapi-key": "1c6e772606msh3c10d4d01ae157bp1dee68jsne1d22692e58a"
        }
    }).then(function mySuccess(response) {
        $scope.countryWise = response.data.countries_stat;

    }, function myError(response) {
        $scope.myWelcome = response.statusText;
    });


    $scope.changeArea = (country) => {
        $scope.selectedArea = country.country_name;
        updateAllData(country);
    }

    function updateAllData(countryData) {
        $scope.category[0].value = countryData.cases;
        $scope.category[1].value = countryData.deaths;
        $scope.category[2].value = countryData.total_recovered;
        $scope.category[3].value = countryData.new_cases;

        $scope.category[1].percentage = getPercentage(countryData.deaths, countryData.cases);
        $scope.category[2].percentage = getPercentage(countryData.total_recovered, countryData.cases);
        $scope.category[3].percentage = getPercentage(countryData.new_cases, countryData.cases);

        createPieChart();
    }

    function createPieChart() {
        var ctx = document.getElementById("myPieChart");
        totalPercentage = 100 - $scope.category[1].percentage - $scope.category[2].percentage - $scope.category[3].percentage
        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [$scope.category[0].label, $scope.category[1].label, $scope.category[2].label, $scope.category[3].label],
                datasets: [{
                    data: [totalPercentage, $scope.category[1].percentage, $scope.category[2].percentage, $scope.category[3].percentage],
                    backgroundColor: ['#abcabc', '#4e73df', '#1cc88a', '#ff3333'],
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

        getHistoryData();

        // Area Chart Example
        var ctx = document.getElementById("myAreaChart");
        var myLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
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
                    data: [0, 10, 100, 200],
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
                            display: true,
                            drawBorder: false
                        },
                        ticks: {
                            maxTicksLimit: 7
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            maxTicksLimit: 10,
                            padding: 10,
                            // Include a dollar sign in the ticks
                            callback: function (value, index, values) {
                                return number_format(value);
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
                            return datasetLabel + ': $' + number_format(tooltipItem.yLabel);
                        }
                    }
                }
            }

        });
    }

    function number_format(number, decimals, dec_point, thousands_sep) {
        // *     example: number_format(1234.56, 2, ',', ' ');
        // *     return: '1 234,56'
        number = (number + '').replace(',', '').replace(' ', '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
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

            response.data.stat_by_country.forEach(data => {
                $scope.graphData.push({
                    data
                })
            })
        }, function myError(response) {
            $scope.myWelcome = response.statusText;
        });
    }


});