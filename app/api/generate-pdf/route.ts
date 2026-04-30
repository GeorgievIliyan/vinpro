import { NextRequest } from "next/server";
import PDFDocument from "pdfkit";
import { PassThrough } from "stream";

interface CarData {
  id?: string;
  vin: string;
  brand: string;
  model: string;
  year: string;
  mileage: string;
  price: string;
  currency: string;
  registrationCountry: string;
  fuelType: string;
  color: string;
  bodyType: string;
  version: string;
  vehicleHistory: string;
  stolencheck: string;
  vinDecoder: string;
}

export async function POST(req: NextRequest) {
  const data: CarData = await req.json();

  const stream = new PassThrough();
  const doc = new PDFDocument();

  doc.pipe(stream);
  
  doc.fontSize(18).text("Car Report", { underline: true });
  doc.moveDown();

  doc.fontSize(12);
  doc.text(`VIN: ${data.vin}`);
  doc.text(`Brand: ${data.brand}`);
  doc.text(`Model: ${data.model}`);
  doc.text(`Year: ${data.year}`);
  doc.text(`Mileage: ${data.mileage}`);
  doc.text(`Price: ${data.price} ${data.currency}`);
  doc.text(`Country: ${data.registrationCountry}`);
  doc.text(`Fuel: ${data.fuelType}`);
  doc.text(`Color: ${data.color}`);
  doc.text(`Body: ${data.bodyType}`);
  doc.text(`Version: ${data.version}`);
  doc.moveDown();

  doc.text(`History: ${data.vehicleHistory}`);
  doc.text(`Stolen Check: ${data.stolencheck}`);
  doc.text(`VIN Decoder: ${data.vinDecoder}`);

  doc.end();

  return new Response(stream as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=car-report.pdf",
    },
  });
}