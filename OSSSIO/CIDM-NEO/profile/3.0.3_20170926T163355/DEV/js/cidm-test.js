function changeMobile() {
    checkUser_mobile();
}

function checkUser_mobile()
{
    var params = {
        'email': $.qgcidm.profile.email,
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

    console.log('In checkUser_mobile');
    console.log(params);
    console.log(checkUserSettings);

    $.ajax(checkUserSettings).done(function(response) {
        if(response != "true")
        {
            console.log(response);
            sendCode_mobile();
        }
    }).fail(function(error) {
        alert( error.responseText );
    });
}

function sendCode_mobile()
{
    var delivery = 'sms';

    // Send confirmation code viaSMS
    if (delivery === 'sms') {

        var params = {
            'phone': $.qgcidm.profile.phone,
            'client': $.qgcidm.config.clientID
        };
        // send code
        var sendCodeSettings =
            {
                "async": true,
                "crossDomain": true,
                "url": 'https://' + $.qgcidm.config.webtaskHome + '/ChangeMobile/sendsmscode',
                "method": "POST",
                "headers":
                    {
                        "content-type": "application/json",
                    },
                "data": JSON.stringify(params)
            };

        console.log('In sendCode_mobile via sms');
        console.log(params);
        console.log(sendCodeSettings);

        $.ajax(sendCodeSettings).done(function(response) {
            console.log("response.ref")
            console.log(response.ref);
            $('#reference_mobile').val(response.ref);
            $("#codeDiv_mobile").show();

            alert('Code Sent');
        }).fail(function(error) {
            alert( error.responseText );
            $("#codeDiv_mobile").hide();
        });


    } else {

        // Send confirmation code via email
        var params = {
            'mailTo': $.qgcidm.profile.email,
            'client': $.qgcidm.config.clientID,
            'template': 'changeMobileEmail'
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

        console.log('In sendCode_mobile via email');
        console.log(params);
        console.log(sendCodeSettings);

        $.ajax(sendCodeSettings).done(function(response) {
            $('#reference_mobile').val(response.ref);
            $("#codeDiv_mobile").show();

            alert('Code Sent');
        }).fail(function(error) {
            alert( error.responseText );
            $("#codeDiv_mobile").hide();
        });

    }
}

function verifyCode_mobile()
{
    var params = {
        "ref": $('#reference_mobile').val(),
        "code": $('#Code_mobile').val()
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

    console.log('In verifyCode_mobile');
    console.log(params);
    console.log(verifyCodeSettings);

    $.ajax(verifyCodeSettings).done(function(response) {
        if(response.success === true || response.success === "true")
        {
            updateMobile();
        }
        else {
            alert("invalid code");
        }
    }).fail(function(error) {
        alert( error.responseText );
    });
}

function updateMobile() {
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
                if (response.success === "Mobile number updated") {

                    sendMobileChangedEmail();

                    $.qgcidm.updateProfile(function() {
                        alert('Phone number changed to '+$.qgcidm.profile.app_metadata.phone);
                        window.location.reload();
                    });
                }
            });
        }
    });
}

function sendMobileChangedEmail()
{
    var params = {
        'mailTo': $.qgcidm.profile.email,
        'client': $.qgcidm.config.clientID,
        'template': 'changeMobileNotificationEmail'
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

    console.log(params);
    console.log(sendCodeSettings);

    $.ajax(sendCodeSettings).done(function(response) {
        config.logger.debug();
        alert('A notification email has been sent to your email address.');
    }).fail(function(error) {
        config.logger.error(error.responseText);
        alert( error.responseText );
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
        $('#reference').val(response.ref);
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
        if(response.success === true || response.success === "true")
        {
            authenticate($('#pwd').val());
        }
        else {
            alert("Invalid code");
        }
    }).fail(function(error) {
        var errorObj = JSON.parse(error.responseText);
        alert(errorObj.message);
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
                    alert(response.result);
                    $("#emailDiv").show();
                    $("#codeDiv").hide();
                    $("#emailAddr").val("");
                    $("#pwd").val("");

                    // Log user out after successful email change
                    $.qgcidm.logout();

                }).fail(function(error) {
                    alert( error.responseText );
                });

            } else {
                alert('Wrong password.');
            }
        });
    });
}
