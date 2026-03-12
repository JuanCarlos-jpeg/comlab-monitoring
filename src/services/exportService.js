import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return String(dateString);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const exportToPDF = (data, filename = "time_log_report.pdf") => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Computer Lab Usage Report", 14, 20);

  if (!data || !Array.isArray(data) || data.length === 0) {
    doc.setFontSize(12);
    doc.text("No data available for the selected period.", 14, 30);
    doc.save(filename);
    return;
  }

  const tableColumn = ["ID", "Name", "Program", "Year", "Date", "Time In"];
  const tableRows = data.map(item => [
    item.id || "",
    item.name || "",
    item.program || "",
    item.year || "",
    formatDate(item.date),
    item.timeIn || ""
  ]);

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    theme: "grid",
    headStyles: { fillColor: [185, 28, 28] },
    styles: { fontSize: 8, cellPadding: 2 }
  });

  doc.save(filename);
};

export const exportToExcel = (data, filename = "user_engagement_analytics.xlsx", options = { raw: false }) => {
  if (!data || !Array.isArray(data) || data.length === 0) return;
  const formattedData = data.map(item => ({
    ...item,
    date: formatDate(item.date)
  }));
  const workbook = XLSX.utils.book_new();
  if (options.raw) {
    const rawSheet = XLSX.utils.json_to_sheet(formattedData);
    XLSX.utils.book_append_sheet(workbook, rawSheet, "Raw Data");
  } else {
    const programStats = {};
    formattedData.forEach(user => {
      if (user.program) {
        programStats[user.program] = (programStats[user.program] || 0) + 1;
      }
    });
    const programSheetData = Object.keys(programStats).map(program => ({
      Program: program,
      Students: programStats[program]
    }));
    const programSheet = XLSX.utils.json_to_sheet(programSheetData);
    XLSX.utils.book_append_sheet(workbook, programSheet, "Program Engagement");
    const yearStats = {};
    formattedData.forEach(user => {
      if (user.year) {
        yearStats[user.year] = (yearStats[user.year] || 0) + 1;
      }
    });
    const yearSheetData = Object.keys(yearStats).map(year => ({
      YearLevel: year,
      Students: yearStats[year]
    }));
    const yearSheet = XLSX.utils.json_to_sheet(yearSheetData);
    XLSX.utils.book_append_sheet(workbook, yearSheet, "Year Engagement");
    const dateStats = {};
    formattedData.forEach(user => {
      if (user.date) {
        dateStats[user.date] = (dateStats[user.date] || 0) + 1;
      }
    });
    const dailyUsageData = Object.keys(dateStats).map(date => ({
      Date: date,
      StudentsLogged: dateStats[date]
    }));
    const dailySheet = XLSX.utils.json_to_sheet(dailyUsageData);
    XLSX.utils.book_append_sheet(workbook, dailySheet, "Daily Usage");
    const hourStats = {};
    formattedData.forEach(d => {
      if (d.timeIn) {
        const hour = d.timeIn.split(":")[0];
        hourStats[hour] = (hourStats[hour] || 0) + 1;
      }
    });
    let max = 0;
    let peakHour = "";
    Object.keys(hourStats).forEach(h => {
      if (hourStats[h] > max) {
        max = hourStats[h];
        peakHour = h;
      }
    });
    const summaryData = [
      { Metric: "Total Students Logged", Value: formattedData.length },
      { Metric: "Unique Programs", Value: [...new Set(formattedData.map(d => d.program))].filter(Boolean).length },
      { Metric: "Peak Login Hour", Value: peakHour ? `${peakHour}:00` : "N/A" }
    ];
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
    const rawSheet = XLSX.utils.json_to_sheet(formattedData);
    XLSX.utils.book_append_sheet(workbook, rawSheet, "Raw Data");
  }
  XLSX.writeFile(workbook, filename);
};

export const exportToJSON = (data, filename = "custom_report.json") => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};
