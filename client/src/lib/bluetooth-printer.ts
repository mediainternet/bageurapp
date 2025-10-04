interface ReceiptData {
  storeName: string;
  queueNumber: number;
  customerName?: string;
  items: Array<{
    name: string;
    qty: number;
    price: number;
  }>;
  total: number;
  date: Date;
}

class BluetoothPrinter {
  private device: BluetoothDevice | null = null;
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;

  async connect(): Promise<void> {
    try {
      this.device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['000018f0-0000-1000-8000-00805f9b34fb'] }],
        optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb']
      });

      if (!this.device.gatt) {
        throw new Error('GATT not available');
      }

      const server = await this.device.gatt.connect();
      const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
      this.characteristic = await service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb');
    } catch (error) {
      throw new Error(`Failed to connect: ${error}`);
    }
  }

  async print(data: ReceiptData): Promise<void> {
    if (!this.characteristic) {
      throw new Error('Printer not connected');
    }

    const commands = this.generateESCPOS(data);

    const chunkSize = 512;
    for (let i = 0; i < commands.length; i += chunkSize) {
      const chunk = commands.slice(i, i + chunkSize);
      await this.characteristic.writeValue(chunk);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  private generateESCPOS(data: ReceiptData): Uint8Array {
    const encoder = new TextEncoder();
    const commands: number[] = [];

    const ESC = 0x1B;
    const GS = 0x1D;
    const LF = 0x0A;

    commands.push(ESC, 0x40);

    commands.push(ESC, 0x61, 0x01);
    commands.push(ESC, 0x21, 0x30);
    commands.push(...encoder.encode(data.storeName));
    commands.push(LF, LF);

    commands.push(ESC, 0x21, 0x00);
    commands.push(ESC, 0x61, 0x00);

    const dateStr = new Date(data.date).toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    commands.push(...encoder.encode(dateStr));
    commands.push(LF);

    commands.push(...encoder.encode('--------------------------------'));
    commands.push(LF);

    commands.push(ESC, 0x21, 0x20);
    commands.push(ESC, 0x61, 0x01);
    commands.push(...encoder.encode(`ANTRIAN #${data.queueNumber}`));
    commands.push(LF);
    commands.push(ESC, 0x21, 0x00);
    commands.push(ESC, 0x61, 0x00);

    if (data.customerName) {
      commands.push(...encoder.encode(`Pelanggan: ${data.customerName}`));
      commands.push(LF);
    }

    commands.push(...encoder.encode('--------------------------------'));
    commands.push(LF, LF);

    for (const item of data.items) {
      const itemName = item.name.padEnd(20, ' ');
      const itemPrice = `Rp ${item.price.toLocaleString('id-ID')}`;
      const line = `${itemName}${itemPrice}`;
      commands.push(...encoder.encode(line));
      commands.push(LF);
    }

    commands.push(LF);
    commands.push(...encoder.encode('--------------------------------'));
    commands.push(LF);

    commands.push(ESC, 0x21, 0x10);
    const totalStr = `TOTAL: Rp ${data.total.toLocaleString('id-ID')}`;
    commands.push(...encoder.encode(totalStr));
    commands.push(LF);
    commands.push(ESC, 0x21, 0x00);

    commands.push(LF, LF);
    commands.push(ESC, 0x61, 0x01);
    commands.push(...encoder.encode('Terima Kasih'));
    commands.push(LF);
    commands.push(...encoder.encode('Selamat Menikmati'));
    commands.push(LF, LF, LF);

    commands.push(GS, 0x56, 0x00);

    return new Uint8Array(commands);
  }

  disconnect(): void {
    if (this.device && this.device.gatt) {
      this.device.gatt.disconnect();
      this.device = null;
      this.characteristic = null;
    }
  }

  isConnected(): boolean {
    return this.device !== null && this.device.gatt !== null && this.device.gatt.connected;
  }
}

export const bluetoothPrinter = new BluetoothPrinter();

export function isBluetoothSupported(): boolean {
  return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
}
