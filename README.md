### Install vue

```
npm install -g @vue/cli
```

### Install packages

```
cd server
npm i
```

```
cd ../client-good
npm i
```

### Run client and Server in different terminals

```
cd server
npm run serve
```

```
cd client-good
npm run serve
```


### Create an unsafe chrome shortcut

**Window**
```
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --ignore-certificate-errors --disable-web-security --user-data-dir="C:\chrome_dev"
```

**macOS**
```
open -na "Google Chrome" --args --ignore-certificate-errors --disable-web-security --user-data-dir="/tmp/chrome_dev"
```

**Linux**
```
google-chrome --ignore-certificate-errors --disable-web-security --user-data-dir="/tmp/chrome_dev"
```