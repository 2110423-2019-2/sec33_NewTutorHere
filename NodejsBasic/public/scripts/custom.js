function generateContract() {
    
    var n = 2, // number 0f contract
        i = 1;

    for (i = 1; i <= n; i++) {
        var data = {

            name: 'Seth Poophak'

        }
        var template = [
            '<form class="form" id="contract">',
            '<img class="nav-img-user" src="/img/user.png" style="height: 5em;" />',
            '<div class="c-box be-right">',
            '<div class="blockcontract">',
            '<span class="name-stucontract">',
            '<a>sends a contract to</a>',
            '<p>{{name}}</p>', // student name
            '</span>',
            '<br />',
            '<button class="view-button search-button be-right" >Cancel this contract</button>',
            '<button class="view-button search-button be-right" >Accept this contract</button>',
            '</div>',
            '</div>',
            '</form>'
        ].join("\n");
        var html = Mustache.render(template, data);
        $("#contract-form").append(html);
    }
}



module.exports = {
    signIn: function () {
        if ($.trim($('#username-signin').val()).length <= 0) {
            Modal_alert('Alert!', "Please Enter Username");
        } else if ($.trim($('#password-signin').val()).length <= 0) {
            Modal_alert('Alert!', "Please Enter Password");
        } 
    }

};