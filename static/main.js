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
            $('#avgPP').html(data.avgPP);
            $('#burstiness').html(data.burstiness);
        })

        
    })


});