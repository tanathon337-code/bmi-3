
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "daily";

  try {
    const records = await prisma.bMI_Record.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'asc' }
    });

    const groupedData = new Map();

    records.forEach(record => {
      const date = new Date(record.date);
      let key = "";

      if (period === 'daily') {
        key = date.toISOString().split('T')[0]; // YYYY-MM-DD
      } else if (period === 'weekly') {
        // Simple week calculation
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDays = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        const weekNum = Math.ceil((pastDays + firstDayOfYear.getDay() + 1) / 7);
        key = `${date.getFullYear()}-W${weekNum.toString().padStart(2, '0')}`;
      } else if (period === 'monthly') {
        key = date.toISOString().slice(0, 7); // YYYY-MM
      } else if (period === 'yearly') {
        key = date.getFullYear().toString(); // YYYY
      }

      if (!groupedData.has(key)) {
        groupedData.set(key, {
          key,
          count: 0,
          totalBMI: 0,
          totalWeight: 0,
          records: []
        });
      }

      const group = groupedData.get(key);
      group.count += 1;
      group.totalBMI += record.bmi;
      group.totalWeight += record.weight;
      group.records.push(record);
    });

    const result = Array.from(groupedData.values()).map(group => ({
      period: group.key,
      avgBMI: parseFloat((group.totalBMI / group.count).toFixed(2)),
      avgWeight: parseFloat((group.totalWeight / group.count).toFixed(2)),
      count: group.count
    }));

    return NextResponse.json(result);

  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
