//rabbit={{ rabbit | jsonify }}

var rabbit= named_ctx.rabbit

ex.load_js('https://cdn.bootcss.com/stomp.js/2.3.2/stomp.min.js',function(){
    // Stomp.js boilerplate
    var client = Stomp.client('ws://' + rabbit.url + ':15674/ws');
//        client.debug = pipe('#second');

//        var print_first = pipe('#first', function(data) {
//            client.send('/topic/test', {"content-type":"text/plain"}, data);
//        });
    var on_connect = function(x) {
//          id = client.subscribe("/topic/test", function(d) {
//               print_first(d.body);
//          });

        id = client.subscribe("/exchange/zhaoxiang_weilan_warning", function(d) {
            layer.alert(d.body)

            console.log(d.body)
        });

    };
    var on_error =  function() {
        console.log('error');

        setTimeout(function(){
            client = Stomp.client('ws://' + rabbit.url + ':15674/ws');
            client.connect(rabbit.user, rabbit.pswd, on_connect, on_error, '/');
        },10000)

    };
    client.connect(rabbit.user, rabbit.pswd, on_connect, on_error, '/');
})
