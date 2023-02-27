$(document).ready(function() {
    //console.log("dgsdg")    
    
    $('form').on('submit', function(event) {
        event.preventDefault();
    
        //$('#result').hide(); -- average
        $('.answer').hide();
        $('.spinner-border').show();
        $.ajax({
            data: { text: $('#text').val() },

            type: 'POST',
            url: '/calculate'
        }).done(function(data) {
            console.log(data);
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
            console.log(data.avgPP < data.burstiness);
            
            if (data.avgPP > 80 && (data.avgPP >= data.burstiness)) {
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
      
                    if (object.ppl < 35 && object.length > data.avgLength + data.lengthVariation) {
                        var line = $("<li class='li-style-highlight'></li>").text(object.line);
                        list.append(line);
                     } else if (object.ppl < 20 && object.length < data.avgLength - data.lengthVariation) {
                         var line = $("<li class='li-style-highlight'></li>").text(object.line);
                         list.append(line);
                     } else if (data.avgPP - object.ppl < 2 * object.burstiness) {
                            var line = $("<li class='li-style-highlight'></li>").text(object.line);
                         list.append(line);
                     } else if (object.ppl < 50 && object.length > 15) {
                        var line = $("<li class='li-style-highlight'></li>").text(object.line);
                         list.append(line);
                     } else if (object.ppl < 35 && object.length < 15) {
                        var line = $("<li class='li-style-highlight'></li>").text(object.line);
                         list.append(line);
                     }
                    else {
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

            
            
        })

        
    })


});