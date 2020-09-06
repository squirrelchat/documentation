<!--
  Copyright (c) 2020 Squirrel Chat, All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

  1. Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  2. Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.
  3. Neither the name of the copyright holder nor the names of its contributors
    may be used to endorse or promote products derived from this software without
    specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
  FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
  OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
-->

# Service Discovery

>danger
> Squirrel's documentation is a heavy WIP. Information you'll find here might be inaccurate or change without
> notice. We're not accepting contributions at this time.

Since Squirrel can be deployed by anyone and may have many different configurations, there is no easy way for a client
to know how it should connect to Squirrel (Where's the gateway? Where's the CDN? Where's (...)).

This is where Service Discovery kicks in. If you are targeting a properly configured Squirrel instance, you only need
to know where the API runs, and you'll be able to get a list of all the backend services and where they are located.

Service Discovery also lets you retrieve the instance configuration and enable or disable feature based on what the
administrators decided. For example, you can know in advance if a user will be able to register or not.

%% GET /service-discovery

###### Example response
```json
{
  "endpoints": {
    "cdn": "https://cdn.squirrelchat.net",
    "gateway": "https://gateway.squirrelchat.net",
    "remote_auth": "https://ra.squirrelchat.net",
    "wind": "https://wind.squirrelchat.net",
    "leaf": "https://leaf.squirrelchat.net",
    "invite": "https://squirrel.chat/l",
    "gift": "https://squirrel.chat/l"
  },
  "services": {
    "registration": true,
    "remote_auth": true,
    "voice": true,
    "video": true,
    "payments": true
  },
  "environment": {
    "mode": "production",
    "stripe_key": "pk_live_xxxxxxxxxx",
    "paypal_key": "production_xxxxxxx",
    "sentry_dsn": "https://xxxxxxxxxxxxxxx@xxxx.ingest.sentry.io/00001"
  },
  "metadata": {
    "version": "69.69.69"
  }
}
```

Notes:
 - If remote auth is disabled, the remote auth endpoint will not be provided.
 - Both Wind and Leaf are optional microservices in the Squirrel infrastructure. Their endpoints may be missing.
 - The environment mode can be anything, with the exception for a production server which must always be `production`.
 - If payments are disabled, Stripe and PayPal keys will not be provided.
 - If payments are enabled, only one key may be present. It's not required to have both payment processors enabled.
