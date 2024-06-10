// Function to build the metadata panel
function buildMetadata(sample) {
    // Fetch data from the provided URL
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
      // Get the metadata field
      const metadata = data.metadata;
  
      // Filter the metadata for the object with the desired sample number
      const result = metadata.filter(sampleObj => sampleObj.id == sample)[0];
  
      // Use d3 to select the panel with id of `#sample-metadata`
      const PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Inside a loop, append new tags for each key-value in the filtered metadata
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    });
  }
  
  // Function to build both charts
  function buildCharts(sample) {
    // Fetch data from the provided URL
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
      // Get the samples field
      const samples = data.samples;
  
      // Filter the samples for the object with the desired sample number
      const result = samples.filter(sampleObj => sampleObj.id == sample)[0];
  
      // Get the otu_ids, otu_labels, and sample_values
      const otu_ids = result.otu_ids;
      const otu_labels = result.otu_labels;
      const sample_values = result.sample_values;
  
      // Build a Bubble Chart
      const bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        margin: { t: 0 },
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Number of Bacteria" }, // Add y-axis title
        margin: { t: 30 }
      };
      const bubbleData = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }];
      // Render the Bubble Chart
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
      // For the Bar Chart, map the otu_ids to a list of strings for your yticks
      const yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
  
      // Build a Bar Chart
      const barData = [{
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
      }];
      const barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: { t: 30, l: 150 },
        xaxis: {
            title: "Number of Bacteria" // Add x-axis title
          }
      };
      // Render the Bar Chart
      Plotly.newPlot("bar", barData, barLayout);
    });
  }
  
  // Function to run on page load
  function init() {
    // Fetch data from the provided URL
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
      // Get the names field
      const sampleNames = data.names;
  
      // Use d3 to select the dropdown with id of `#selDataset`
      const selector = d3.select("#selDataset");
  
      // Use the list of sample names to populate the select options
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Get the first sample from the list
      const firstSample = sampleNames[0];
  
      // Build charts and metadata panel with the first sample
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Function for event listener
  function optionChanged(newSample) {
    // Build charts and metadata panel each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();
