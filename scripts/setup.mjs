import {existsSync,writeFileSync} from 'node:fs';import {randomBytes} from 'node:crypto';import {spawnSync} from 'node:child_process';
for(const dir of ['server','client']){const r=spawnSync(process.platform==='win32'?'npm.cmd':'npm',['ci'],{cwd:dir,stdio:'inherit',shell:process.platform==='win32'});if(r.status)process.exit(r.status||1)}
if(!existsSync('server/.env'))writeFileSync('server/.env',`MONGODB_URI=mongodb://127.0.0.1:27017/quickfix\nJWT_SECRET=${randomBytes(48).toString('hex')}\nPORT=5000\nCLIENT_URL=http://localhost:5173\n`);
console.log('Setup complete. Run npm run demo for the local demo, or start MongoDB and run npm run dev.');
