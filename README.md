## Prerequisites

* node js
* yarn
* expo account
* exp cli
* S3 bucket set up as website [link](http://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html)
* s3cmd (cli)

## Set up

```
exp login
s3cmd --configure
```

## Installation

```
make install
```

## Deployment

### Mobile apps

This will deploy to your expo account

```
cd hedvig-app
yarn deploy
```

### Web

```
cd hedvig-web
HEDVIG_S3_BUCKET=<your_bucket_name> yarn deploy
```

## Client / Server communcation

### Initiate an insurance update by requesting a quote

Get a quote

`POST /insurance/quote`

#### Request body example:

```
{
  "insurance": {
    "fire": true,
    "theft": false,
    "waterleak": true
  }
}
```

#### Response body example

```
{
 "insurance": {
  "fire": {
    "state": "waiting_for_payment",
    "included_in_base_package": false,
  },
  "theft": {
    "state": "disabled",
    "included_in_base_package": false
  },
  "waterleak": {
    "state": "waiting_for_signing", // any of "disabled", "waiting_for_signing", "waiting_for_payment", "enabled"
    "included_in_base_package": true
  },
  "current_total_price": 0,
  "new_total_price": 500
  }
}
```

or in case the user is denied a quote

```
{
  "insurance": {
    "denied": true
  }
}
```

### My current insurance

Get my current insurance (also includes new price if user has requested a quote that differs from their current insurance)

`GET /insurance`

#### Response body example

```
{
  "insurance": {
    "fire": {
      "state": "waiting_for_payment",
      "included_in_base_package": false,
    },
    "theft": {
      "state": "disabled",
      "included_in_base_package": false
    },
    "waterleak": {
      "state": "waiting_for_signing", // any of "disabled", "waiting_for_signing", "waiting_for_payment", "enabled"
      "included_in_base_package": true
    },
    "assets": [
      {
        "id": "12312412",
        "image_urls": [...],
        "name": "Kamera"
        "state": "enabled", // any of "disabled", "waiting_for_signing", "waiting_for_payment", "enabled"
        "included_in_base_package": true
      },
      {
        "id": "1231241124122",
        "image_urls": [...],
        "name": "Laptop"
        "state": "waiting_for_signing", // any of "disabled", "waiting_for_signing", "waiting_for_payment", "enabled"
        "included_in_base_package": false
      }
    ]
    "current_total_price": 500
    "new_total_price": 600 // only set if the user has made quote request that differs from their current insurance
    }
  }
}
```

### Add / edit / delete an asset

`POST (for create) PUT (for edit) DELETE /asset/{id} (id if editing or deleting)

#### Request body example

```
{
  "image_urls": [...],
  "name": "Laptop"
  "included_in_base_package": false
}
```

#### Response code

2xx

### Claims

#### Initiate a general claim

`POST /claim`

Response code: 204

#### Initiate a claim for specific asset

`POST /claim/asset/{id}`

Reponse code: 204

#### Initiate a claim for specific insurance

`POST /claim/insurance/{id}`

Reponse code: 204

**After initiating a claim the client fetches `/messages`**

### Claim video / audio / photo upload

`POST {response_path}` where response_path is provided in the chat message with corresponding type

### List cashback options

#### Request body example

`GET /cashback/options`

```
{
  "id1": {
    "name": "Rädda Barnen",
    "selected": false,
    "charity": true
  },
  "id2": {
    "name": "Mitt konto",
    "selected": true,
    "charity": false
  }
}
```

### Edit cashback option via separate endpoint (used in profile view)

`POST /cashback`

#### Request body example

```
{
  "id1": {
    "name": "Rädda Barnen",
    "selected": true,
    "charity": true
  },
  "id2": {
    "name": "Mitt konto",
    "selected": false,
    "charity": false
  }
}
```

#### Response body example

```
{
  "id1": {
    "name": "Rädda Barnen",
    "selected": true,
    "charity": true
  },
  "id2": {
    "name": "Mitt konto",
    "selected": false,
    "charity": false
  }
}
```

### Send insurance letter by email

`POST /insurance/email-policy`

Response code: 204

### Chat

![image](https://user-images.githubusercontent.com/206061/30038446-f1a534e0-91c4-11e7-9ee7-74ba6bf4c976.png)

Chat messages are delivered through polling the /messages endpoint. They are delivered in timestamp order (as seen by the API-GATEWAY)
<BR>Response format is {"timestamp1":message1, "timestamp2":message2,...}
<BR><BR>
Chat messages are recieved by POSTING to the /response endpoint with the id field set to the message you are responding to. To respond to a message just alter the content and/or the Boolean select fields of the choices and post it to /response. Note the message does not include the initial timestamp so to reply to
  
```
"1507473841801":{
  "globalId":4,
  "id":"message.getname",
  "header":{
    "messageId":4,
    "fromId":1,
    "responsePath":"/response",
    "timeStamp":1507473841801},
   "body":{
    "type":"text",
    "id":4,
    "text":"Trevlig, vad heter du?"},
   "timestamp":1507473841.801000000}
```
simply POST this to /response:

```
{
  "globalId":4,
  "id":"message.getname",
  "header":{
    "messageId":4,
    "fromId":1,
    "responsePath":"/response",
    "timeStamp":1507473841801},
   "body":{
    "type":"text",
    "id":4,
   ```**``` "text":"John Doe"},```**```
   "timestamp":1507473841.801000000
}
```
<BR>Request format is {message}

#### Chat message types

* `text` - Plain text message
```
"1507042098159": {
  "id":"message.getname",
  "timestamp": 1507042098159,
  "header":{
     "fromId":1,
     "responsePath":"/response",
  },
  "body":{
     "type":"text",
     "content":"Trevlig, vad heter du?"
  }
}
```
* `number` - Numeric input
```
"1507042098159": {
  "id":"message.getname",
  "timestamp": 1507042098159,
  "header":{
     "fromId":1,
     "responsePath":"/response",
  },
  "body":{
     "type":"number",
     "content":"Trevlig, vad heter du?"
  }
}
```
* `single_select` - Single select question / answer

NOTE: Each `link` should only have one of [`appUrl`, `webUrl`, `view`]
```
"17879879179871": {
  "id":"message.hello",
  "timestamp": 17879879179871,
  "header":{
     "fromId":1,
     "responsePath":"/response"
  },
  "body":{
     "type":"single_select",
     "content":"Hej, det är jag som är Hedvig, din personliga försäkringsassistent! Vad kan jag hjälpa dig med?",
     "choices":[
        {
           "type": "selection",
           "text":"Jag vill ha en ny",
        },
        {
           "type": "link",
           "text":"I want to see my assets",
           "view": "AssetTracker",
           "appUrl": "bankid://",
           "webUrl": "http://hedvig.com"
        }
     ]
  }
}
```
* `multiple_select` - Multiple select question / answer
```
"1507042097247": {
  "id":"message.hello",
  "timestamp": 1507042097247,
  "header":{
     "fromId":1,
     "responsePath":"/response",
  },
  "body":{
     "type":"multiple_select",
     "content":"Hej, det är jag som är Hedvig, din personliga försäkringsassistent! Vad kan jag hjälpa dig med?",
     "choices":[
        {
           "text":"Jag vill ha en ny",
           "selected":false
        },
        {
           "text":"Vill byta försäkring",
           "selected":false
        },
        {
           "text":"Varför behöver jag?",
           "selected":false
        },
        {
           "text":"Vem är du, Hedvig?",
           "selected":false
        }
     ]
  }
}
```
* `datepicker` - Select a date
```
"1507474046966":{
  "globalId":7,
  "id":"message.greetings",
  "header":{
    "messageId":7,
    "fromId":1230923,
    "responsePath":"/response",
    "timeStamp":1507474046966},
   "body":{
    "type":"date_picker",
    "id":7,
    "text":"Hej John Doe, kul att du gillar försäkring :). När är du född?",
    "date":[2002,8,25,0,0]},
   "timestamp":1507474046.966000000}
```
* `video`
```
"1507042098159": {
  "id":"message.getname",
  "timestamp": 1507042098159,
  "header":{
     "fromId":1,
     "responsePath":"/response"
  },
  "body":{
     "type":"video",
     "content":"Record a video"
  }
}
```
* `hero` - A big "hero" / "jumbotron" to showcase key (marketing?) messages
```
"1507042098159": {
  "id":"message.getname",
  "timestamp": 1507042098159,
  "header":{
     "fromId":1,
     "responsePath":"/response"
  },
  "body":{
     "type":"hero",
     "content":"I'm a hero",
     "imageUri": "http://placekitten.com/g/200/300"
  }
}
```
* `photo_upload`
```
"1507042098159": {
  "id":"message.getname",
  "timestamp": 1507042098159,
  "header":{
     "fromId":1,
     "responsePath":"/response"
  },
  "body":{
     "type":"photo_upload",
     "content":"Upload a photo"
  }
}
```
* ~`link` - A link to another view~ This is now a `single_select` type with one `choices.type` set to `link`

#### Chat flow example

GET /messages
```
"1506330482691":{"id":"message.hello","header":{"fromId":1,"responsePath":"/response","timeStamp":1.506330482691E12},"body":{"type":"text","content":"Hello I am Hedvig"}}}
```

GET /messages
```
{"1506330403007":
  {"id":"message.hello","header":{"fromId":1,"responsePath":"/response","timeStamp":1.506330403007E12},"body":{"type":"multiple_choice","content":"Hej, det är jag som är Hedvig, din personliga försäkringsassistent! Vad kan jag hjälpa dig med?","links":[{"text":"Jag vill ha en ny","selected":false,"URI":"/response","param":"action.new"},{"text":"Vill byta försäkring","selected":false,"URI":"/response","param":"action.change"},{"text":"Varför behöver jag?","selected":false,"URI":"/response","param":"action.why"},{"text":"Vem är du, Hedvig?","selected":false,"URI":"/response","param":"action.who"}]}},
"1506330444463":
  {"id":"message.changecompany","header":{"fromId":1,"responsePath":"/response","timeStamp":1.506330444463E12},"body":{"type":"multiple_choice","content":"Ok, vilket bolag har du idag?","links":[{"text":"If","selected":false,"URI":"/response","param":"company.if"},{"text":"TH","selected":false,"URI":"/response","param":"company.th"},{"text":"LF","selected":false,"URI":"/response","param":"company.lf"}]}},
"1506330482691":{"id":"error","header":
  {"fromId":1,"responsePath":"/response","timeStamp":1.506330482691E12},"body":{"type":"text","content":"Oj nu blev något fel..."}}}
```

POST /message
```
To reply to a particular message just use the same id as the message you are replying to and alter the body. Time stamp and other header information is updated by the API-GATEWAY
{
  "id":"message.name",
  "header":
    {"fromId":1,"responsePath":"/response","timeStamp":1.506330482691E12},
  "body":
    {"type":"text","content":"John"}
}
```

### Authentication

For authentication we utilize the JWT tokens. The tokens should be added to the _Authorization_ header and prepended with _Bearer _.

Ex:```Authorization:Bearer AKLSJDLAJD.ASDLKJADJ.KJALJDSLA```

#### On newly started applications

Newly started application should be initiated by calling helloHedvig
endpoint and get an access token. Further calles to the backend should
include this token.


POST /helloHedvig

```
Response:
XXXX.XXXXX.XXXX
```

#### BankId authentication

The bankId authentication flow mimics the flow used by BankId.  A call
to /member/bankid/auth starts the auth process. In order to know if
the auth request succeded or not the client must poll
/member/bankid/collect.

POST /member/bankid/auth

Arguments:
* ssn - (Optional) The personnumer of the authenticating member


#### BankId collect

POST /member/bankid/collect

Response:
SUCCESS
FAILIURE
.
.
