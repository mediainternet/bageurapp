import { ReceiptPreview } from "../receipt-preview";

export default function ReceiptPreviewExample() {
  return (
    <div className="p-8">
      <ReceiptPreview
        queueNumber={12}
        customerName="Ibu Siti"
        items={[
          { name: "Ceker", qty: 2, price: 5000 },
          { name: "Siomay", qty: 1, price: 3000 },
          { name: "Mie", qty: 1, price: 2000 },
        ]}
        total={15000}
        date={new Date()}
        onPrint={() => console.log("Printing...")}
      />
    </div>
  );
}
