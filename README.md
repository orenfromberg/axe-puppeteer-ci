# build
```bash
docker build -t axe-puppeteer-ci .
```

# run
scan a single page:
```bash
docker run --init -it --rm --cap-add=SYS_ADMIN axe-puppeteer-ci https://www.google.com
```

scan multiple pages:
```bash
docker run --init -it --rm --cap-add=SYS_ADMIN axe-puppeteer-ci https://www.google.com https://www.yahoo.com https://www.bing.com
```
