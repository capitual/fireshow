Fireshow client
===============

Firefox OS and Android client for Fireshow.

Download now from:

* Firefox Marketplace (waiting approval)
* Google Play (soon)

Servers
-------

Fireshow API is open, so anyone can create a server for it.

Currently, we have the following servers:

| Project name | Platform | Download | Source code |
|--------------|----------|----------|-------------|
| Fireshow Server (official) | Windows | [Download]() | [See on GitHub](http://github.com/jesobreira/fireshow-server) |

If you want to contribute, you can also create your very own Fireshow server. The whole API is documented [here](https://github.com/jesobreira/fireshow/wiki/API).

How to build
------------

For Firefox OS: Just zip everything :)

For Android/iOS (...): Use Phonegap/Cordova.

```
cordova create yourproject com.example.yourproject YourProjectName
cd yourproject
cordova platform add android
cordova platform add ios
cordova platform add ...
```

At this point, copy all this folder's content into "www" folder of your Cordova project.

Finally, run:

```
cordova build --release
```

Platform-related additional steps are told on [official Cordova documentation](https://cordova.apache.org/docs/en/latest/guide/cli/index.html).

How to contribute
-----------------

If you're a coder, feel free to pull request :)

If you want to create your own Fireshow client or server (for other platforms, for example), welcome to the team! [Here](https://github.com/jesobreira/fireshow/wiki/API) are the API standards!

If you want to translate Fireshow client to your language, feel free to edit our languages file. It will automatically fork. Then just pull request it to us. [Click here to start](lang.ini).