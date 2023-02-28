$(document).ready(function() {
        
    
    $('form').on('submit', function(event) {
        event.preventDefault();
        $('#submit-button').prop('disabled', true);
        //$('#result').hide(); -- average
        $('.answer').hide();
        $('.spinner-border').show();
        $.ajax({
            data: { text: $('#text').val() },

            type: 'POST',
            url: '/calculate'
        }).done(function(data) {
            setTimeout(function() {
                $('#submit-button').prop('disabled', false);
              }, 1000);
            //console.log(data);
            
            $('.spinner-border').hide();
            //$('#result').show(); -- average
            $('.answer').show();
            // $('.answer').css('display', 'block');
            $('#avgPP').html(data.avgPP.toFixed(2));
            $('#burstiness').html(data.burstiness.toFixed(2));
            $('#maxPPL_line').html(data.maxPPL_line);
            $('#maxPPL').html(data.maxPPL);
            //$('#lines').html(data.lines);
            $('#verdict').empty();
            //console.log(data.avgPP < data.burstiness);
            
            if (data.avgPP > 80 || (data.avgPP >= data.burstiness)) {
                var verdict = $("<h4>Your text is most likely written entirely by a human.<h4>");
                $('#verdict').append(verdict);
            } else if (data.avgPP > 50 && data.avgPP < 80) {
                var verdict = $("<h4 class='verdict'>Your text may include parts written by an AI<h4>");
                $('#verdict').append(verdict);
            } else if (data.avgPP <= data.burstiness) {
                var verdict = $("<h4 class='verdict'>Your text may include parts written by an AI<h4>");
                $('#verdict').append(verdict);
            } else {
                var verdict = $("<h4>Your text is most likely written entirely by an AI<h4>");
                $('#verdict').append(verdict);
            }

            var list = $("<ul class='ul-style'></ul>");
            $.each(data.allInfo, function(i, object) {
                if (data.avgPP > 50 && data.avgPP < 80) { // TO HIGHLIGHT IF PART AI
      
            
                    if (object.ppl < data.avgPP + 0.5 * data.burstiness && object.length > 15) {
                        var line = $("<li class='li-style-highlight'></li>").text(object.line);
                         list.append(line);
                     } else if (object.ppl < data.avgPP - 0.5 * data.burstiness && object.length < 15) {
                        var line = $("<li class='li-style-highlight'></li>").text(object.line);
                         list.append(line);
                     } else {
                        var line = $("<li class='li-style'></li>").text(object.line);
                        list.append(line);
                    }
                } else {
                    var line = $("<li class='li-style'></li>").text(object.line);
                    list.append(line);
                }
            
            })
            $('#sentences').empty();
            $('#sentences').append(list);
           
             $('#myChart').remove();
             $('#myChart2').remove();
            $('#chart-container1').append('<canvas id="myChart" responsive="true"></canvas>');
            $('#chart-container2').append('<canvas id="myChart2" responsive="true"></canvas>');
            const ctx = document.getElementById('myChart');
            const ctx2 = document.getElementById('myChart2');
            

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.allInfo.map(function(object) {
                        return object.line;
                      }),
                    datasets: [{
                        label: 'PPL',
                        data: data.allInfo.map(function(object) {
                            return object.ppl;
                          }),
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            
                        },
                        x: {
                            ticks: {
                                callback: function(label) {
                                  if (label.length > 10) { 
                                    //console.log(label.length);
                                    return label.substring(0, 10) + '...';
                                  } else {
                                    return label;
                                  }
                                }
                            }
                        }
                    }
                }
            })

            new Chart(ctx2, {
                type: 'line',
                data: {
                    labels: data.allInfo.map(function(object) {
                        return object.line;
                      }),
                    datasets: [{
                        label: 'Sentence Length',
                        data: data.allInfo.map(function(object) {
                            return object.length;
                          }),
                        borderWidth: 1,
                        borderColor: 'rgb(255, 0, 0)',
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            
                        },
                        x: {
                            ticks: {
                                callback: function(label) {
                                  if (label.length > 10) { 
                                    return label.substring(0, 10) + '...';
                                  } else {
                                    return label;
                                  }
                                }
                            }
                        }
                    }
                }
            })

           
            
        })

        
    })


});