FROM denoland/deno:2.5.4

EXPOSE 8000

WORKDIR /app

RUN chown -R deno:deno .
# Prefer not to run as root.
USER deno

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
COPY deno.json .
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
RUN deno install --allow-import

COPY . .
COPY .env .env

CMD ["deno", "task", "start" ]
