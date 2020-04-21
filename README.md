# build
```bash
docker build -t axe-puppeteer-ci .
```

# run
```bash
docker run --init -it --rm --cap-add=SYS_ADMIN axe-puppeteer-ci https://www.google.com
```
