const net = require('net');

function rconCommand(command) {
  return new Promise((resolve, reject) => {
    const host = process.env.RCON_HOST;
    const port = parseInt(process.env.RCON_PORT) || 25575;
    const password = process.env.RCON_PASSWORD;

    const sock = new net.Socket();
    let authenticated = false;
    let buf = Buffer.alloc(0);

    const timeout = setTimeout(() => {
      sock.destroy();
      reject(new Error('RCON timeout'));
    }, 8000);

    const sendPacket = (id, type, body) => {
      const bodyBuf = Buffer.from(body, 'utf8');
      const length = 4 + 4 + bodyBuf.length + 2;
      const packet = Buffer.alloc(4 + length);
      packet.writeInt32LE(length, 0);
      packet.writeInt32LE(id, 4);
      packet.writeInt32LE(type, 8);
      bodyBuf.copy(packet, 12);
      packet.writeUInt8(0, 12 + bodyBuf.length);
      packet.writeUInt8(0, 12 + bodyBuf.length + 1);
      sock.write(packet);
    };

    const readPackets = () => {
      while (buf.length >= 4) {
        const length = buf.readInt32LE(0);
        if (buf.length < 4 + length) break;
        const id = buf.readInt32LE(4);
        const body = buf.slice(12, 4 + length - 2).toString('utf8');
        buf = buf.slice(4 + length);

        if (!authenticated) {
          if (id === -1) {
            clearTimeout(timeout);
            sock.destroy();
            return reject(new Error('Mot de passe RCON incorrect'));
          }
          authenticated = true;
          sendPacket(2, 2, command);
        } else {
          clearTimeout(timeout);
          sock.destroy();
          resolve(body || 'OK');
        }
      }
    };

    sock.connect(port, host, () => {
      sendPacket(1, 3, password);
    });

    sock.on('data', (data) => {
      buf = Buffer.concat([buf, data]);
      readPackets();
    });

    sock.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

module.exports = { rconCommand };