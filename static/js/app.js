
// CREATE CHARTS
function createPlot(id) {

    // Console.log data from json
    d3.json("static/data/samples.json").then((data)=> {
        console.log(data)
    
    // BAR CHART
        // Filter by sample id and console.log the samples
        var samples = data.samples.filter(s => s.id.toString() === id)[0];

        console.log(samples);

        // Get 10 highest sample values and reverse the order from high to low
        var sampleValues = samples.sample_values.slice(0, 10).reverse();

        // Get the IDs for those 10 samples
        var sampleIDs = (samples.otu_ids.slice(0, 10)).reverse();

        // Get the labels for those 10 samples
        var labels = samples.otu_labels.slice(0, 10);

        // Format OTU ids
        var idOTU = sampleIDs.map(d => "OTU " + d)

        // Log sample values, sample ids, and OTU IDs
        console.log(`Sample Values: ${sampleValues}`)
        console.log(`Sample IDs: ${sampleIDs}`)
        console.log(`OTU IDS: ${idOTU}`)

        // Create trace for plot
        var trace = { 
            x: sampleValues,
            y: idOTU, 
            text: labels,
            type: "bar",
            orientation: "h"
        };
        // var data variable = trace
        var data = [trace];

        //set layout
        var layout = {
            title: "Top 10 OTU in sample",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 150,
                r: 10,
                t: 30,
                b: 20
            }
        };

        // create bar plot
        Plotly.newPlot("bar", data, layout);
    
    //BUBBLE CHART
        // create trace for bubble
        var trace_bubble = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids,
                showscale: true
            },
            text: samples.otu_labels
        };
        //create layout for bubble
        var layout_bubble = {
            xaxis:{title: "OTU ID"},
            height: 700,
            width: 1200
        }; 
        // data = trace
        var data_bubble = [trace_bubble]; 
        // plot bubble
        Plotly.newPlot("bubble", data_bubble, layout_bubble);
    
    });

}

// GET METADATA
//function for getting metadata
function getMeta(id) {
    d3.json("static/data/samples.json").then((data)=> {
        var metadata = data.metadata;

        console.log("metadata", metadata)

        //get metadata for sample id
        var results = metadata.filter(meta => meta.id.toString() === id)[0];
        
        console.log(results)

        //grab the tag for the metadata panel in the index.html
        var demInfo = d3.select("#sample-metadata");

        console.log(demInfo)
        
        //append on entries for each sample
        Object.entries(results).forEach((entry) => { 
            demInfo.append("h5").text(entry[0].toUpperCase() + ": " + entry[1] + "\n");
        });
    });
}

// EVENT CHANGE
function optionChanged(id) {
    createPlot(id);
    getMeta(id);
}

// INIT DATA for dropdown
function init() {

    // select dropdown from the index.html
    var dropdown = d3.select("#selDataset");

    //get data
    d3.json("static/data/samples.json").then((data)=> {
        console.log(data)

        // get id data 
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call function to initialize
        createPlot(data.names[0]);
        getMeta(data.names[0]);
    });
}

init();