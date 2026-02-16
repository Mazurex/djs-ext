echo Building library...
pnpm build

echo Building example bot...
cd examples/discord-bot
npx tsc

echo Build complete, starting bot...
cd ../..
node examples/discord-bot/dist/index.js