var OAuth2 = require("oauth").OAuth2;
var cred = require("./cred.js");
var Boom = require("boom");

var moneybird_auth_object = new OAuth2(
        cred.ClientID, 
        cred.Clientsecret, 
        "https://moneybird.com/",
        "oauth/authorize",
        "oauth/token",
        null);

function getAuthToken (code, callback) {
}

function authed (request, reply) {
    if (request.query.code) {
        moneybird_auth_object.getOAuthAccessToken(
            request.query.code,
            {
                "grant_type": "authorization_code", 
                "redirect_uri": "http://localhost/authed"
            },
            function (e, access_token, refresh_token, results) {
                if (e) {
                    reply(Boom.create(400, 'Error', e.data));
                }
                request.yar.set("moneybird_token", {
                    access_token: access_token,
                    refresh_token: refresh_token
                });

                reply.redirect("/");
            }
        )
    }
}

function getAuthUrl () {
    return moneybird_auth_object.getAuthorizeUrl({
        redirect_uri: "http://localhost/authed",
        response_type: "code",
        scope: "sales_invoices documents"
    })
}

exports.authed = authed;
exports.getAuthUrl = getAuthUrl;