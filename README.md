# build
```bash
docker build -t axe-puppeteer-ci .
```

# run
```bash
docker run --init -it --rm --cap-add=SYS_ADMIN axe-puppeteer-ci
pptruser@a6a6616d5f80:~/app$ node index.js https://www.google.com
```
