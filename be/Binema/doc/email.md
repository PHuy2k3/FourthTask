# Email configuration

The application can send booking confirmation emails after a successful checkout. The
SMTP credentials are now fully configurable through `config/default.json` (or any
other [`node-config`](https://github.com/node-config/node-config#configuration-files)
environment file).

```
{
  "email": {
    "from": "no-reply@example.com",
    "transport": {
      "host": "smtp.gmail.com",
      "port": 465,
      "secure": true,
      "auth": {
        "user": "your-account@example.com",
        "pass": "application-specific-password"
      }
    }
  }
}
```

Set the `from` address to the sender you want recipients to see. Provide a valid
transport configuration for your SMTP provider. If you are using Gmail, you must
create an [App password](https://support.google.com/accounts/answer/185833) because
regular account passwords are rejected by Google for SMTP access.

### Environment variable overrides

When deploying to environments where editing `config/*.json` is inconvenient, you
can override the transport settings through environment variables:

| Variable | Purpose |
| --- | --- |
| `EMAIL_FROM` | Sender address shown to recipients |
| `SMTP_HOST` | SMTP host (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | SMTP port (e.g. `587`) |
| `SMTP_SECURE` | Set to `true`/`1` to enable TLS, `false`/`0` otherwise |
| `SMTP_SERVICE` | Optional Nodemailer service name (e.g. `gmail`) |
| `SMTP_USER` | Username/login for SMTP |
| `SMTP_PASS` | Password or app password |

Only the variables you provide are overridden, so you can mix JSON configuration
and environment secrets as needed.

When either the transport configuration or the credentials are missing, the backend
skips the email step so that local development continues to work without valid SMTP
credentials. The server logs a warning in that case so you can notice the missing
configuration.