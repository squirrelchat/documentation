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

# API Generics

>danger
> Squirrel's documentation is a heavy WIP. Information you'll find here might be inaccurate or change without
> notice. We're not accepting contributions at this time.

## Generic types
### Snowflake

### Generic error
A generic error is what the API returns in almost all cases when an error occurs. It'll most of the time include a
message, but it's not necessary. The error code will always be uppercase.

###### Example
```json
{
  "code": 403,
  "error": "SUCCESS",
  "message": "The operation failed successfully"
}
```

Specific errors you may encounter will be documented per-endpoint. Here are some common errors you can encounter
throughout the API:

###### Common error codes
| Code                     | HTTP Status Code | Description                                                                     |
|--------------------------|------------------|---------------------------------------------------------------------------------|
| AUTHENTICATION_REQUIRED  | 401              | You must provide an auth token. See [authentication](#authentication).          |
| AUTHENTICATION_FAILED    | 401              | The token you provided is invalid.                                              |
| INSUFFICIENT_PERMISSIONS | 403              | You do not have enough permissions to perform this operation.                   |
| MALFORMED_REQUEST        | 400              | The request body was invalid and couldn't be parsed.                            |
| RATE_LIMITED             | 429              | You've been rate limited. See [rate limiting](#rate-limiting).                  |
| OVERLOADED               | 503              | The resource is unavailable due to [overload protection](#overload-protection). |
| PREMIUM_REQUIRED         | 402              | The operation is reserved to people with an active premium subscription*.       |

## Authentication

## Rate limiting

### Rate limit buckets

## Overload protection
