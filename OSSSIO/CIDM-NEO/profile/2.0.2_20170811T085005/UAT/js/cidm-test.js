function changeMobile() {
    $.qgcidm.getStorage('id_token', function(id_token) {
        //alert(id_token);
        if ($.qgcidm.profile.identities[0].provider != "auth0") {
            alert('must be a QGA account');
            return;
        }
        var mobile = $('#mobile').val();
        if ( $.qgcidm.isMobilePatternValid(mobile.trim()) ) {
            alert('Please enter a valid number 10-digit number.');
        } else {
            var settings = {
                'async': true,
                'crossDomain': true,
                'url': 'https://' + $.qgcidm.config.webtaskHome + '/ChangeMobile',
                'method': 'POST',
                'headers': {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                'data': {
                    'mobile': mobile,
                    'token': id_token
                }
            }

            $.ajax(settings).done(function(response) {
                alert('Phone number changed.');
            });
        }
    });
}

function deleteUser() {
    $.qgcidm.getStorage('id_token', function(id_token) {
        var settings = {
            'async': true,
            'crossDomain': true,
            'url': 'https://' + $.qgcidm.config.webtaskHome + '/DeleteUser',
            'method': 'POST',
            'headers': {
                'content-type': 'application/x-www-form-urlencoded'
            },
            'data': {
                'email': $('#deleteUser').val(),
                'token': id_token
            }
        }

        $.ajax(settings).done(function(response) {
            alert('User Deleted.');
        }).fail(function(error) {
            alert( error.responseText );
        });
    });
}

function changeEmail() {
    if( validateEmail( $('#emailAddr').val() ) )
        authenticate($('#pwd').val());
    else
        alert("Please enter valid email address.");
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

// AUTHENTICATE USERS
function authenticate(password) {
    $.qgcidm.getStorage('id_token', function(id_token) {
        var newEmail = $('#emailAddr').val();
        var auth0 = new Auth0({
            domain: $.qgcidm.config.domain,
            clientID: $.qgcidm.config.clientID,
            responseType: 'token'
        });

        auth0.login({
            connection: 'CIDM-REST',
            username: $.qgcidm.profile.email,
            password: password,
        },function(error, result) {
            if (result) {
                var settings = {
                    'async': true,
                    'crossDomain': true,
                    'url': 'https://' + $.qgcidm.config.webtaskHome + '/ChangeEmail',
                    'method': 'POST',
                    'headers': {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    'data': {
                        'newEmail': newEmail,
                        'password': password,
                        'token': id_token
                    }
                }

                $.ajax(settings).done(function(response) {
                    alert('Email changed.');
                }).fail(function(error) {
                    alert( error.responseText );
                });

            } else {
                alert('Wrong password.');
            }
        });
    });
}
