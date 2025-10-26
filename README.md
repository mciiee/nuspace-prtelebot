

## Build instruction:
### Using deno
1. Copy into the .env file
    ```bash
    cp .env.example .env
    ```
2. Fill it in with credentials
3. Run ```deno task dev```
### Using Docker
1. Build: ```docker build -t [CONTANER_NAME] .```
2. Run: ```docker run --env-file=.env [CONTANER_NAME]```
