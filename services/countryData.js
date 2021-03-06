// ALl country data : https://pomber.github.io/covid19/timeseries.json
var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
    // redirect to live URL
    location.href = "http://www.theworkboxsolutions.com/covid";

    $scope.headerText = "India";
    $scope.indiaData = {};
    $scope.indainStateData = [];
    $scope.isCountrySelected = true;
    $scope.isApiCallInProgress = false;
    $scope.isApiFailed = false;
    $scope.showFacts = false;
    $scope.showMyths = false;
    $scope.showNews = false;
    $scope.showEmergencyContact = false;
    $scope.emergencyContactList = stateEmergency;
    $scope.reload = false;

    $scope.indiaTotalCases = 0;
    $scope.indiaTotalDeaths = 0;


    $scope.newsList = [{
        urlToImage: "",
        title: "",
        description: "",
        url: "",
        publishedAt: "",
        source: {
            name: ""
        }
    }]
    $scope.countryWise = [{
        country: "",
        cases: 0,
        deaths: 0,
    }];

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

    getIndianStateData("https://v1.api.covindia.com/district-values");
    let historyUrl = "https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_particular_country.php?country=";

    $scope.showCountryList = () => {
        $scope.isCountrySelected = !$scope.isCountrySelected;
    }

    $scope.changeArea = (countryData) => {
        $scope.headerText = countryData.country;
        $scope.showMyths = false;
        $scope.showNews = false;
        $scope.isCountrySelected = false;
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

    function getIndianStateData(url) {
        $http({
            method: "GET",
            url
        }).then(function mySuccess(response) {
            let updatedObject = updateResponseObject(response.data);

            $scope.indainStateData = [];
            Object.keys(updatedObject).forEach((stateData) => {
                $scope.indainStateData.push({
                    key: stateData,
                    value: updatedObject[stateData]
                })
            });

            assignMapData(updatedObject);
            getWorldData("https://corona.lmao.ninja/countries");

        }, function myError(response) {
            $scope.myWelcome = response.statusText;
        });
    }

    function assignMapData(responseData) {
        Object.keys(simplemaps_countrymap_mapdata.state_specific).forEach((stateObj) => {
            let stateName = simplemaps_countrymap_mapdata.state_specific[stateObj].name;
            if (responseData[stateName]) {
                simplemaps_countrymap_mapdata.state_specific[stateObj].description = 'Total:' + responseData[stateName].cases + '</br>' +
                    '<span class="text-danger">Deaths:' + responseData[stateName].deaths + '</span></br>';
                if (responseData[stateName].cases > 0) {
                    simplemaps_countrymap_mapdata.state_specific[stateObj].color = '#FFD0C2';
                }
                if (responseData[stateName].cases > 10) {
                    simplemaps_countrymap_mapdata.state_specific[stateObj].color = '#FF8A83';
                }
                if (responseData[stateName].cases > 50) {
                    simplemaps_countrymap_mapdata.state_specific[stateObj].color = '#D65F59';
                }
                if (responseData[stateName].cases > 100) {
                    simplemaps_countrymap_mapdata.state_specific[stateObj].color = '#C23210';
                }
                if (responseData[stateName].cases > 500) {
                    simplemaps_countrymap_mapdata.state_specific[stateObj].color = '#991101';
                }
            }
        });
        if (window.innerWidth < 700) {
            simplemaps_countrymap_mapdata.main_settings.width = (window.innerWidth - 50).toString();
        }
        simplemaps_countrymap.load();
    }

    function updateResponseObject(response) {
        let updatedObject = {};
        Object.keys(response).forEach((city) => {
            $scope.indiaTotalCases = $scope.indiaTotalCases + response[city].infected;
            $scope.indiaTotalDeaths = $scope.indiaTotalDeaths + response[city].dead;

            if (updatedObject[response[city].state] === undefined) {
                updatedObject[response[city].state] = {
                    cases: response[city].infected,
                    deaths: response[city].dead,
                    city: [{
                        name: city,
                        cases: response[city].infected,
                        deaths: response[city].dead
                    }]
                }
            } else {
                updatedObject[response[city].state].cases = updatedObject[response[city].state].cases + response[city].infected,
                    updatedObject[response[city].state].deaths = updatedObject[response[city].state].deaths + response[city].dead,
                    updatedObject[response[city].state].city.push({
                        name: city,
                        cases: response[city].infected,
                        deaths: response[city].dead
                    })
            }
        })

        return updatedObject;
    }

    function updateAllData(countryData) {
        if (countryData.country === 'India') {
            countryData.cases = $scope.indiaTotalCases;
            countryData.deaths = $scope.indiaTotalDeaths;
        }

        $scope.category[0].value = countryData.cases;
        $scope.category[1].value = countryData.deaths;
        $scope.category[2].value = countryData.recovered;
        $scope.category[3].value = countryData.todayCases;

        $scope.category[1].percentage = getPercentage(countryData.deaths, countryData.cases);
        $scope.category[2].percentage = getPercentage(countryData.recovered, countryData.cases);
        $scope.category[3].percentage = getPercentage(countryData.todayCases, countryData.cases);

        getHistoryData();
        window.scrollTo(0, 0);
    }

    function getHistoryData() {
        $http({
            method: "GET",
            url: historyUrl + $scope.headerText,
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
            createAreaChart($scope.graphData);
        }, function myError() {
            $scope.isApiFailed = true;
        });
    }

    $scope.getStyle = (percentage) => {
        return {
            width: percentage + '%'
        }
    }

    function getWorldData(url) {
        $scope.isApiCallInProgress = true;
        $http({
            method: "GET",
            url
        }).then(function mySuccess(response) {
            $scope.isApiCallInProgress = false;
            $scope.countryWise = response.data;
            response.data.forEach(countryData => {
                if (countryData.country === 'India' && $scope.headerText === 'India') {
                    $scope.indiaData = countryData;
                    $scope.changeArea($scope.indiaData);
                }
                else if ($scope.headerText === countryData.country && $scope.reload) {
                    $scope.changeArea(countryData);
                    $scope.reload = false;
                }
                $scope.worldData = {
                    cases: $scope.worldData.cases + countryData.cases,
                    deaths: $scope.worldData.deaths + countryData.deaths,
                    recovered: $scope.worldData.recovered + countryData.recovered,
                    new: $scope.worldData.new + countryData.todayCases,
                }
            })
            createBarChart($scope.countryWise, 'cases');
        }, function myError(response) {
            $scope.isApiFailed = true;
        });
    }

    function getNews(url) {
        $scope.isApiCallInProgress = true;
        $http({
            method: "GET",
            url
        }).then(function mySuccess(response) {
            $scope.isApiCallInProgress = false;
            $scope.newsList = response.data.articles;
        }, function myError(response) {

        });
    }

    $scope.showOnlyMyths = (isOverlayOpen) => {
        if (isOverlayOpen) {
            $scope.isApiCallInProgress = false;
        }
        recetAll();
        $scope.showMyths = true;
        $scope.headerText = "Myths";
    }

    $scope.showOnlyNews = () => {
        getNews("https://newsapi.org/v2/top-headlines?country=in&q=corona&apiKey=f6a1d6ea77354f8b96a6b6938ce8618a");
        recetAll();
        $scope.showNews = true;
        $scope.headerText = "News";
    }

    function recetAll() {
        $scope.headerText = "";
        $scope.showMyths = false;
        $scope.isCountrySelected = true;
        $scope.showNews = false;
    }

    $scope.clearText = () => {
        $scope.searchText = '';
    }

    $scope.scrollTop = () => {
        window.scrollTo(-10, 0);
    }

    $scope.refreshPage = () => {
        window.location.reload();
    }

    $scope.openModal = (modalData) => {
        $scope.selectedStateData = modalData;
    }

    $scope.closeModal = () => {
        $scope.selectedStateData = undefined;
    }

    $scope.closeEmergencyContact = () => {
        $scope.showEmergencyContact = false;
    }

    $scope.updateBarChart = (category) => {
        createBarChart($scope.countryWise, category)
    }

    $scope.refreshPage = () => {
        $("#rotate").addClass("rotate");
        setTimeout(() => {
            $("#rotate").removeClass("rotate")
            reloadData();
        }, 1000)
    }

    function reloadData() {
        $scope.indiaTotalCases = 0;
        $scope.indiaTotalDeaths = 0;
        $scope.reload = true;

        $scope.worldData = {
            cases: 0,
            deaths: 0,
            recovered: 0,
            new: 0,
        }
        
        getIndianStateData("https://v1.api.covindia.com/district-values");
    }

});


// utility functions 
function getPercentage(category, total) {
    let number = 100 * category / total
    return number.toFixed(2)
}


scrollFunction();

function scrollFunction() {
    window.onscroll = function () { scrollFunction() };
    mybutton = document.getElementById("scrollBtn");
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

function createAreaChart(graphData) {

    $("#myAreaChart").remove();
    $("#chart-area").append("<canvas id='myAreaChart'></canvas>");

    var ctx = document.getElementById("myAreaChart");

    let labels = new Array();
    labels = graphData.map(historyData => historyData.data.record_date.split(' ')[0]);
    let data = new Array();
    data = graphData.map(historyData => historyData.data.total_cases.replace(',', ''));
    let deaths = graphData.map(historyData => historyData.data.total_deaths.replace(',', ''));
    let recovered = graphData.map(historyData => historyData.data.total_recovered.replace(',', ''));

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

function createBarChart(worldData, category) {

    $("#myBarChart").remove();
    $("#bar-chart").append("<canvas id='myBarChart'></canvas>");

    worldData.sort((a, b) => {
        return b[category] - a[category]
    })

    let caseData = [];
    let deathData = [];
    let labelData = [];
    worldData.forEach((countryData, index) => {
        if (index < 5) {
            caseData.push(countryData.cases);
            deathData.push(countryData.deaths);
            labelData.push(countryData.country)
        }

    })

    let dataSet1 = {
        label: category.substr(0, 1).toUpperCase().concat(category.substring(1)),
        data: category === 'cases' ? caseData : deathData,
        backgroundColor: category === 'cases' ? 'rgba(54, 162, 235, 0.2)' : 'rgba(255, 99, 132, 0.2)',
        borderColor: category === 'cases' ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 99, 132, 1)',
        borderWidth: 1
    }

    let dataSet2 = {
        label: category === 'cases' ? 'Deaths' : 'Cases',
        data: category !== 'cases' ? caseData : deathData,
        backgroundColor: category !== 'cases' ? 'rgba(54, 162, 235, 0.2)' : 'rgba(255, 99, 132, 0.2)',
        borderColor: category !== 'cases' ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 99, 132, 1)',
        borderWidth: 1
    }

    new Chart(document.getElementById('myBarChart'), {
        type: 'bar',
        data: {
            labels: labelData,
            datasets: [dataSet1, dataSet2]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}