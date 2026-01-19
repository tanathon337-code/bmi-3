import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { weight, height } = await req.json();

  if (!weight || !height) {
    return NextResponse.json({ message: "Missing weight or height" }, { status: 400 });
  }

  const weightNum = parseFloat(weight);
  const heightNum = parseFloat(height);

  // Calculate BMI (height in cm converted to meters)
  const heightInMeters = heightNum / 100;
  const bmi = weightNum / (heightInMeters * heightInMeters);
  
  let result = "Normal";
  if (bmi < 18.5) result = "Underweight";
  else if (bmi < 25) result = "Normal";
  else if (bmi < 30) result = "Overweight";
  else result = "Obese";

  try {
    // Note: Prisma model is BMI_Record, client property is likely bMI_Record or bmi_Record
    // We'll try bMI_Record based on standard naming convention for BMI_Record
    const record = await prisma.bMI_Record.create({
      data: {
        userId: session.user.id,
        weight: weightNum,
        height: heightNum,
        bmi: parseFloat(bmi.toFixed(2)),
        result,
      },
    });
    return NextResponse.json(record);
  } catch (error) {
    console.error("Error saving BMI record:", error);
    return NextResponse.json({ message: "Error saving record" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const records = await prisma.bMI_Record.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching BMI records:", error);
    return NextResponse.json({ message: "Error fetching records" }, { status: 500 });
  }
}
