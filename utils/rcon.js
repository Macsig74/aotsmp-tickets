const net = require('net');

function rconCommand(command) {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    const host = process.env.RCON_HOST;
    const port = parseInt(process.env.RCON_PORT) || 25575;
    const password = process.env.RCON_PASSWORD;

    let authenticated = false;
    let buffer = Buffer.alloc(0);

    const writePacket = (id, type, body) => {
      const bodyBuf = Buffer.from(body + '\0', 'utf8');
      const packetLen = 4 + 4 + bodyBuf.length + 1;
      const buf = Buffer.alloc(4 + packetLen);
      buf.writeInt32LE(packetLen, 0);
      buf.writeInt32LE(id, 4);
      buf.writeInt32LE(type, 8);
      bodyBuf.copy(buf, 12);
      buf.writeUInt8(0, 12 + bodyBuf.length);
      client.write(buf);
    };

    const timeout = setTimeout(() => {
      client.destroy();
      reject(new Error('RCON timeout'));
    }, 5000);

    client.connect(port, host, () => {
      writePacket(1, 3, password); // auth
    });

    client.on('data', (data) => {
      buffer = Buffer.concat([buffer, data]);
      while (buffer.length >= 12) {
        const len = buffer.readInt32LE(0);
        if (buffer.length < len + 4) break;
        const id = buffer.readInt32LE(4);
        const type = buffer.readInt32LE(8);
        const body = buffer.slice(12, len + 4 - 2).toString('utf8');
        buffer = buffer.slice(len + 4);

        if (!authenticated) {
          if (id === -1) { clearTimeout(timeout); client.destroy(); return reject(new Error('Mot de passe RCON incorrect')); }
          authenticated = true;
          writePacket(2, 2, command); // exec
        } else {
          clearTimeout(timeout);
          client.destroy();
          resolve(body);
        }
      }
    });

    client.on('error', (err) => { clearTimeout(timeout); reject(err); });
  });
}

module.exports = { rconCommand };