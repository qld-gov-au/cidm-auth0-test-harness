function changeMobile() {
    $.qgcidm.getStorage('id_token', function(id_token) {
        //alert(id_token);
        if ($.qgcidm.profile.identities[0].provider != "auth0") {
            alert('must be a QGA account');
            return;
        }
        var mobile = $('#mobile').val();
        if ( ! $.qgcidm.isMobilePatternValid(mobile.trim()) ) {
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
                $.qgcidm.updateProfile(function() {
                    alert('Phone number changed to '+$.qgcidm.profile.app_metadata.phone);
                    window.location.reload();
                });
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
    {
        checkUser();
    }
    else
    {
        alert("Please enter valid email address.");
    }
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}


function checkUser()
{
    var params = {
        'email': $('#emailAddr').val(),
        'client': $.qgcidm.config.clientID
    };
    // check user
    var checkUserSettings = {
        'async': true,
        'crossDomain': true,
        'url': 'https://' + $.qgcidm.config.webtaskHome + '/CheckUser',
        'method': 'POST',
        'headers': {
            'content-type': 'application/x-www-form-urlencoded'
        },
        'data': params
    };
    $.ajax(checkUserSettings).done(function(response) {
        if(response != "true")
        {
            sendCode();
        }
        else {
            alert("Email already exists. Please user another email address");
        }
    }).fail(function(error) {
        alert( error.responseText );
    });
}

function sendCode()
{
    var params = {
        'mailTo': $('#emailAddr').val(),
        'client': $.qgcidm.config.clientID,
        'template': 'changeUsername'
    };
    // send code
    var sendCodeSettings =
    {
        "async": true,
        "crossDomain": true,
        "url": 'https://' + $.qgcidm.config.webtaskHome + '/SendMail',
        "method": "POST",
        "headers":
        {
            "content-type": "application/json",
        },
        "data": JSON.stringify(params)
    };
    $.ajax(sendCodeSettings).done(function(response) {
        $('#reference').val(response);
        $("#emailDiv").hide();
        $("#codeDiv").show();

        alert('Code Sent');
    }).fail(function(error) {
        alert( error.responseText );
        $("#emailDiv").show();
        $("#codeDiv").hide();
    });
}

function verifyCode()
{
    var params = {
        "ref": $('#reference').val(),
        "code": $('#code').val()
    };
    var verifyCodeSettings =
    {
        "async": true,
        "crossDomain": true,
        "url": 'https://' + $.qgcidm.config.webtaskHome + '/SendMail/checkCode',
        "method": "POST",
        "headers":
        {
            "content-type": "application/json",
        },
        "data": JSON.stringify(params)
    };
    $.ajax(verifyCodeSettings).done(function(response) {
        if(response === "true")
        {
            authenticate($('#pwd').val());
        }
        else {
            alert("invalid code");
        }
    }).fail(function(error) {
        alert( error.responseText );
    });
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
                    $("#emailDiv").show();
                    $("#codeDiv").hide();
                    $("#emailAddr").val("");
                    $("#pwd").val("");
                }).fail(function(error) {
                    alert( error.responseText );
                });

            } else {
                alert('Wrong password.');
            }
        });
    });
}
