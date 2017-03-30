var bell = require("bell");
var MyAuth = require("./auth.js");
var Boom = require("boom");
var Request = require("request");

function sync (request, reply) {
    // check for exist auth (auth token)
    var tokens = request.yar.get("moneybird_token")
    if (!tokens || !tokens.access_token) {

        // if not return unauthed response to client
        return reply(Boom.unauthorized('requires login', 'OAuth', { url: MyAuth.getAuthUrl()}));
    }

    // us auth token to request payment invoice
    Request("https://moneybird.com/api/v2/185265167304492902/documents/purchase_invoices", 
    {
        auth: {
            bearer: tokens.access_token
        }
    }, 
    function (error, response ,body) {
        if (error) {
            reply(Boom.badRequest(error));
        }
        else {
            var invoices = JSON.parse(body);

            var invoice_count = invoices.length;

            var stored_count = request.yar.get("invoice_count");

            if (stored_count && stored_count > 0) {
                var diff = invoice_count - stored_count;
                request.yar.set("invoice_count", invoice_count);
                return reply(diff);
            }
            else {
                request.yar.set("invoice_count", invoice_count);
                return reply(invoice_count);
            }


            reply(invoices.count)
        }
    })
    // reply invoice object to client
    //reply("test sync");
}

exports.sync = sync;