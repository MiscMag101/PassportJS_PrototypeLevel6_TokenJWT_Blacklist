
# How to test it

## Download prototype

```console
$ git clone https://github.com/MiscMag101/PassportJS_PrototypeLevel6_TokenJWT_Blacklist.git
```

* Install NPM Packages

```console
$ npm install
```

## Create a self-signed certificat

```console
$ mkdir tls
$ openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout tls/key.pem \
-out tls/cert.pem
```

For this certificat, a hostname will be required (such as app.example.com).

/!\ This self-signed certificat should be used only for testing purpose.

## Register your app

Register your application on [GitHub (Developers Settings)](https://github.com/settings/developers) with the following parameters:
  - Homepage URL: https://app.example.com:3000
  - Authorization callback URL : https://app.example.com:3000:3000/signin/github/callback

And get your client Id and secret.

## Register hostname

If you don't have a local DNS, edit your host file to add static entry for "app.example.com"

## Start MongoDB

```console
$ systemctl start mongodb
```

Don't forget to enable authentication and create a user.

## Redis

* Start Redis

```console
$ systemctl start redis
```

## Start Application

```console
$ PORT=3000 HOST=app.example.com CLIENT_ID=xxxxxxxxxxxxxxxx CLIENT_SECRET=yyyyyyyyyyyyyyyyyyyyy \
MONGOURI=mongodb://username:password@hostname:27017/DatabaseName REDIS_PASSWORD=password JWT_SECRET=Secret npm start
```

## Test

Open [https://app.example.com:3000](https://app.example.com:3000) and clic on "Signin with github"
Accept the authorization request on GitHub, then you will be redirected automatically to the private page.

Clic on "Sign Out" then check your Redis server to see blacklisted token:

```console
$ redis-cli
> KEYS *
> TTL key
```
