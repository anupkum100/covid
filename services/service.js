simplemaps_countrymap_mapdata = {
    main_settings: {
        //General settings
        width: "responsive", //'700' or 'responsive'
        background_color: "#FFFFFF",
        background_transparent: "yes",
        border_color: "#ffffff",

        //State defaults
        state_description: "State description",
        state_color: "#88A4BC",
        state_hover_color: "#3B729F",
        border_size: 1.5,
        all_states_inactive: "no",
        all_states_zoomable: "no",

        //Location defaults
        location_description: "Location description",
        location_color: "#FF0067",
        location_opacity: 0.8,
        location_hover_opacity: 1,
        location_url: "",
        location_size: 25,
        location_type: "square",
        location_image_source: "frog.png",
        location_border_color: "#FFFFFF",
        location_border: 2,
        location_hover_border: 2.5,
        all_locations_inactive: "no",
        all_locations_hidden: "no",

        //Label defaults
        label_color: "#d5ddec",
        label_hover_color: "#d5ddec",
        label_size: 22,
        label_font: "Arial",
        hide_labels: "no",
        hide_eastern_labels: "no",

        //Zoom settings
        zoom: "no",
        back_image: "no",
        initial_back: "no",
        initial_zoom: "-1",
        initial_zoom_solo: "no",
        region_opacity: 1,
        region_hover_opacity: 0.6,
        zoom_out_incrementally: "no",
        zoom_percentage: 0.99,
        zoom_time: 0.5,

        //Popup settings
        popup_color: "white",
        popup_opacity: 0.9,
        popup_shadow: 1,
        popup_corners: 5,
        popup_font: "12px/1.5 Verdana, Arial, Helvetica, sans-serif",
        popup_nocss: "no",

        //Advanced settings
        div: "map",
        auto_load: "no",
        url_new_tab: "no",
        images_directory: "default",
        fade_time: 0.1,
        link_text: "Refresh",
        popups: "detect",
        state_image_url: "",
        state_image_position: "",
        location_image_url: "",
        manual_zoom: "no"
    },
    state_specific: {
        "1": {
            name: "Andaman and Nicobar",
            description: "0",
        },
        "2": {
            name: "Andhra Pradesh",
            description: "0"
        },
        "3": {
            name: "Arunachal Pradesh",
            description: "0"
        },
        "4": {
            name: "Assam",
            description: "0"
        },
        "5": {
            name: "Bihar",
            description: "0"
        },
        "6": {
            name: "Chandigarh",
            description: "0"
        },
        "7": {
            name: "Chhattisgarh",
            description: "0"
        },
        "8": {
            name: "Dadra and Nagar Haveli",
            description: "0"
        },
        "9": {
            name: "Daman and Diu",
            description: "0"
        },
        "10": {
            name: "Delhi",
            description: "0"
        },
        "11": {
            name: "Goa",
            description: "0"
        },
        "12": {
            name: "Gujarat",
            description: "0"
        },
        "13": {
            name: "Haryana",
            description: "0"
        },
        "14": {
            name: "Himachal Pradesh",
            description: "0"
        },
        "16": {
            name: "Jharkhand",
            description: "0"
        },
        "17": {
            name: "Karnataka",
            description: "0"
        },
        "18": {
            name: "Kerala",
            description: "0"
        },
        "19": {
            name: "Lakshadweep",
            description: "0"
        },
        "20": {
            name: "Madhya Pradesh",
            description: "0"
        },
        "21": {
            name: "Maharashtra",
            description: "0"
        },
        "22": {
            name: "Manipur",
            description: "0"
        },
        "23": {
            name: "Meghalaya",
            description: "0"
        },
        "24": {
            name: "Mizoram",
            description: "0"
        },
        "25": {
            name: "Nagaland",
            description: "0"
        },
        "26": {
            name: "Orissa",
            description: "0"
        },
        "27": {
            name: "Puducherry",
            description: "0"
        },
        "28": {
            name: "Punjab",
            description: "0"
        },
        "29": {
            name: "Rajasthan",
            description: "0"
        },
        "30": {
            name: "Sikkim",
            description: "0"
        },
        "31": {
            name: "Tamil Nadu",
            description: "0"
        },
        "32": {
            name: "Tripura",
            description: "0"
        },
        "33": {
            name: "Uttar Pradesh",
            description: "0"
        },
        "34": {
            name: "Uttarakhand",
            description: "0"
        },
        "35": {
            name: "West Bengal",
            description: "0"
        },
        "36": {
            name: "Jammu and Kashmir",
            description: "0"
        },
        "37": {
            name: "Telangana",
            description: "0"
        }
    },
    // locations: {
    //     "0": {
    //         lat: 18.987807,
    //         lng: 72.836447,
    //         name: "Mumbai",
    //         state_description: "Mumbai"
    //     }
    // },
    labels: {},
    regions: {}
};

$.get("https://ameerthehacker.github.io/corona-india-status/covid19-indian-states.json", (response) => {
    Object.keys(simplemaps_countrymap_mapdata.state_specific).forEach((stateData, index) => {
        if (response.data[simplemaps_countrymap_mapdata.state_specific[stateData].name]) {
            simplemaps_countrymap_mapdata.state_specific[stateData].description = 'Total:' + response.data[simplemaps_countrymap_mapdata.state_specific[stateData].name].totalIndianCases + '</br>' +
                '<span class="text-danger">Deaths:' + response.data[simplemaps_countrymap_mapdata.state_specific[stateData].name].totalDeaths + '</span></br>' +
                '<span class="text-info">Recovered:' + response.data[simplemaps_countrymap_mapdata.state_specific[stateData].name].totalRecovered + '</span>';
            if (response.data[simplemaps_countrymap_mapdata.state_specific[stateData].name].totalIndianCases > 0) {
                simplemaps_countrymap_mapdata.state_specific[stateData].color = '#FFD0C2';
            }
            if (response.data[simplemaps_countrymap_mapdata.state_specific[stateData].name].totalIndianCases > 5) {
                simplemaps_countrymap_mapdata.state_specific[stateData].color = '#FF8A83';
            }
            if (response.data[simplemaps_countrymap_mapdata.state_specific[stateData].name].totalIndianCases > 20) {
                simplemaps_countrymap_mapdata.state_specific[stateData].color = '#D65F59';
            }
            if (response.data[simplemaps_countrymap_mapdata.state_specific[stateData].name].totalIndianCases > 50) {
                simplemaps_countrymap_mapdata.state_specific[stateData].color = '#C23210';
            }
            if (response.data[simplemaps_countrymap_mapdata.state_specific[stateData].name].totalIndianCases > 100) {
                simplemaps_countrymap_mapdata.state_specific[stateData].color = '#991101';
            }
            simplemaps_countrymap.load();
        }
    })

})