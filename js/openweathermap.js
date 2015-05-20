
    var ViewModel = function() {
        this.location = ko.observable("Loading...");
        this.temperature = ko.observable("Loading...");
        this.time = ko.observable("Loading...");
        this.weatherstatus = ko.observable("Loading...");
        this.foreCasts = ko.observableArray();
    };
    
    var viewModel = new ViewModel();
    
    var reloadWeatherData = function() {
      var openWeathermapUrl = "http://api.openweathermap.org/data/2.5/weather?lat=59.338046&lon=14.942071";
      $.getJSON(openWeathermapUrl, function(data) { 
        viewModel.location(data.name);
        viewModel.temperature((data.main.temp - 273.15).toFixed(1));
        viewModel.time(moment().format('dddd HH:mm'));
        viewModel.weatherstatus(data.weather[0].description);
      });  
    };
    
    var reloadForecast = function() {
        var openWeathermapUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=59.338046&lon=14.942071";
        $.getJSON(openWeathermapUrl, function(data) { 
          
          data.list.forEach(function(element) {
            viewModel.foreCasts.push(element);   
          });
          
          var labels = [];
          var dataPoints = [];
          data.list.slice(0, 10).forEach(function(element){
            labels.push(moment(element.dt_txt).format('YYYY-MM-DD HH:mm'));
            dataPoints.push((element.main.temp - 273.15).toFixed(1));
          });
          
          var chartData = {
              labels: labels,
              datasets: [
                  {
                      label: "My First dataset",
                      fillColor: "rgba(220,220,220,0.2)",
                      strokeColor: "rgba(220,220,220,1)",
                      pointColor: "rgba(220,220,220,1)",
                      pointStrokeColor: "#fff",
                      pointHighlightFill: "#fff",
                      pointHighlightStroke: "rgba(220,220,220,1)",
                      data: dataPoints
                  }
              ]
          };
              
          var ctx = $("#myChart").get(0).getContext("2d");
          var myNewChart = new Chart(ctx).Line(chartData, {
            scaleBeginAtZero: true,
            animationEasing: "easeOutQuart",
          });
    
        });
     };
    
   
    
    $(document).ready(function() {
        reloadWeatherData();
        reloadForecast();
        ko.applyBindings(viewModel);
        setInterval(reloadWeatherData, 5000);
    });
    
    