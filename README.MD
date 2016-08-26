#Collectivist

Collectivist is the successor to [CDJ Messenger](https://github.com/viruzx/cdj-messenger) which was crippled by it's own excessive and redundant security measures and proceedures.

Collectivist attempts to give another go at the idea of a distraction-free forum/messenger app but with a better design, cleaner code and supperior performance. As opposed to CDJ, Collectivist not longer relies on Orchestrate.io but instead stores all the data it using in `.json` files.

##Screenshot:

![Collectivist](https://i.sli.mg/fdOee3.png)

##Live Demo:

View at https://collectivist-demo.herokuapp.com/

Username: user1 OR user2

Password: (leave empty)


#Why would I want to use Collectivist?

I developed Collectivist as a way for my friends and I to organise easier. The reality is that no other app thought of sticking a live chat and real-time forum side-by-side on a single page. I find this layout extremely comfortable: no need to private message every single person to do a survey or asking it on a group chat while half of your collegues miss it, just make a thread for it. No need to ask a short question on a forum, you got a live chat on the side - it's great!

See? Very comfortable.

##What it shouldn't be used for

 - Groups with large amounts of people: like any group chat, after a certain point, there are too many messages.
 - Anything you would use Slack for, it is simply not the same and cannot furfill that purpose.

#Hmm.. Sounds great, but how do I get it??

##Quick Start

If you just want to get it up and running quickly and hassle-free!

```
git clone https://github.com/viruzx/Collectivist.git
npm install
export PORT=80
npm start
#Listening on *:80
```
##Recommended Install

This is the slightly harder but preferred installation allowing you to use SSL.

```
git clone https://github.com/viruzx/Collectivist.git
npm install
npm start
#Listening on *:3000
```

###Using Nginx

```
server {
    listen 0.0.0.0:80;
    server_name *your-domain-name*;
    access_log /var/log/nginx/*your-domain-name*.log;

    #You better have some certs
    #listen 443 ssl;
    #ssl_certificate certs.crt;
    #ssl_certificate_key certs.key;
    #rewrite     ^   https://$server_name$request_uri? permanent;

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header HOST $http_host;
        proxy_set_header X-NginX-Proxy true;

        proxy_pass http://127.0.0.1:3000;
        proxy_redirect off;
    }
}
```

###Using Apache2

```
<VirtualHost *:80>
    ServerName *your-domain-name*

#   Got some SSL??
#   Redirect permanent / https://*your-domain-name*

    ProxyRequests off
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http:/127.0.0.1:3000/     
</VirtualHost>

<VirtualHost *:443>

   ServerName *your-domain-name*

   SSLEngine on
   SSLCertificateFile /certs.crt
   SSLCertificateKeyFile /certs.key

   ProxyPass / http://127.0.0.1:3000/
   ProxyPassReverse / http:/127.0.0.1:3000/
   ProxyPreserveHost   On

</VirtualHost>
```
