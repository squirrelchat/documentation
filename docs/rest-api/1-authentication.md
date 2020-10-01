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

# Authentication

>danger
> Squirrel's documentation is a heavy WIP. Information you'll find here might be inaccurate or change without
> notice. We're not accepting contributions at this time.

## Rate limits
To prevent abuse, the authentication endpoints have a stronger rate limiting policy in place to protect user accounts
and avoid spam.

 - Each IP may only register one account per hour.
 - Each IP is allowed 10 failed login per hour, and 25 per day. Passed those limits, the API will respond with `429 Too Many Requests`.

## Register
%% POST /auth/register

###### Request body
| Field         | Type         | Description                                                                          |
|---------------|--------------|--------------------------------------------------------------------------------------|
| email         | string       | Email address. One email address can only be used for a single account.              |
| username      | string       | The username to use for the new account. Minimum 4 chars, must be unique.            |
| display_name  | string       | The display name to use for the new account. Minimum 2 chars.                        |
| password      | string       | The password for the new account. Minimum 4 chars. Will be encrypted using Argon2id. |
| date_of_birth | ISO8601 date | Date of birth. Used to comply with [legal requirements](/legal#child-protection).    |
| tos_agreed    | boolean      | If the user agrees to the Terms of Service and related legal documents.              |

When creating an account, you or the person you're creating an account for must agree to the Terms of Service. If
you're creating an account for someone else, for example through a custom client, you may not set `tos_agreed` to
`true` without the user indicating their agreement first.

The `date_of_birth` field must not be filled with arbitrary data. This data is used for [legal purposes](/legal#child-protection).

Responds with `200 OK` and a [user object](#) along with an extra key `token` holding an authentication token, or
with a 4xx error code and a [generic error](/api-generics#generic-error).

###### Errors returned
| Code                  | HTTP Status Code | Description                                                       |
|-----------------------|------------------|-------------------------------------------------------------------|
| REGISTRATION_DISABLED | 403              | Registration has been disabled by the administrators.             |
| INVALID_EMAIL         | 400              | The email is invalid.                                             |
| INVALID_USERNAME      | 400              | The username is invalid.                                          |
| INVALID_DISPLAY_NAME  | 400              | The display name is invalid.                                      |
| INVALID_PASSWORD      | 400              | The password is invalid.                                          |
| EMAIL_TAKEN           | 400              | The email is already in use for another account.                  |
| USERNAME_TAKEN        | 400              | The username is already in use for another account.               |
| TOS_UNREAD            | 400              | You did not agree to the Terms of Service.                        |
| DOB_PRIVACY_LAW       | 403              | The registration is impossible due to regulation in place*.       |
| DOB_BLATANT_LIE       | 418              | We see you. Triggered if the user would be 128 years old or more. |

*Once this has been triggered once, the administrators may disable registering altogether for you at their sole
discretion. In this case, you'll always get the `DOB_PRIVACY_LAW` error, even if you try again with a different date
of birth.

## Email confirmation
>warn
> This endpoint must **not** be automated. Internal systems may catch abnormal activity and flag the account for
> suspicious activity, requiring manual administrator review to unlock the account.

## Login

## Multi-factor authentication
>warn
> This endpoint must **not** be automated. Internal systems may catch abnormal activity and flag the account for
> suspicious activity, requiring manual administrator review to unlock the account.

## Remote authentication
Remote authentication (RA) lets you authenticate a device using an already authenticated one (for example, your phone).

On squirrel.chat, we're running [Borkenware's Remote Authentication Server](https://github.com/borkenware/remote-auth-server)
and we recommend 3rd party enthusiasts who wants to host a Squirrel instance and provide RA to do the same. The
protocol documentation can be found [here](https://github.com/borkenware/remote-auth-server/blob/mistress/PROTOCOL.md).

The RA server endpoint can be found using [Service Discovery](/service-discovery).

## Password reset
>warn
> Those endpoints must **not** be automated. Internal systems may catch abnormal activity and flag the account for
> suspicious activity, requiring manual administrator review to unlock the account.

### Request a reset
### Execute a reset

## Logout
To logout, the client simply drops the token and doesn't do anything more. There is no dedicated procedure to log out
of a specific device.

However, you can invalidate all active sessions which will log you out of all other active devices. You can request
the API to automatically re-generate a token for you to stay logged in.

%% DELETE /auth/logout

###### Request body
| Field             | Type    | Description                                                    |
|-------------------|---------|----------------------------------------------------------------|
| regenerate_token? | boolean | Whether the API should generate a new token to stay logged in. |

On success, returns `200 OK` if `regenerate_token` was set to `true`, `204 No Content` otherwise.

###### Example response
```json
{ "token": "xxxxxxxxxxxxxxxxxxxx.xxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" }
```
