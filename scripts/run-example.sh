echo Building library...
rm -r dist
pnpm build

echo Building example bot...
cd examples/discord-bot
rm -r dist
npx tsc

echo Build complete, starting bot...
cd ../..
node examples/discord-bot/dist/index.js