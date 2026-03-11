import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const exportToPDF = (data, filename = "custom_report.pdf") => {
  const formattedData = data.map(item => ({
    ...item,
    date: formatDate(item.date)
  }));

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Custom Report", 14, 20);

  if (formattedData.length > 0) {
    const columns = Object.keys(formattedData[0]);
    const rows = formattedData.map(obj => columns.map(col => obj[col]));
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30
    });
  }

  doc.save(filename);
};

export const exportToExcel = (data, filename = "user_engagement_analytics.xlsx", options = { raw: false }) => {
  const formattedData = data.map(item => ({
    ...item,
    date: formatDate(item.date)
  }));

  const workbook = XLSX.utils.book_new();

  if (options.raw) {
    // For custom reports, only include the raw data
    const rawSheet = XLSX.utils.json_to_sheet(formattedData);
    XLSX.utils.book_append_sheet(workbook, rawSheet, "Raw Data");
  } else {
    // For the main export, include all analytics sheets
    const programStats = {};
    formattedData.forEach(user => {
      if (!programStats[user.program]) programStats[user.program] = 0;
      programStats[user.program]++;
    });
    const programSheetData = Object.keys(programStats).map(program => ({
      Program: program,
      Students: programStats[program]
    }));
    const programSheet = XLSX.utils.json_to_sheet(programSheetData);
    XLSX.utils.book_append_sheet(workbook, programSheet, "Program Engagement");

    const yearStats = {};
    formattedData.forEach(user => {
      if (!yearStats[user.year]) yearStats[user.year] = 0;
      yearStats[user.year]++;
    });
    const yearSheetData = Object.keys(yearStats).map(year => ({
      YearLevel: year,
      Students: yearStats[year]
    }));
    const yearSheet = XLSX.utils.json_to_sheet(yearSheetData);
    XLSX.utils.book_append_sheet(workbook, yearSheet, "Year Engagement");

    const dateStats = {};
    formattedData.forEach(user => {
      if (!dateStats[user.date]) dateStats[user.date] = 0;
      dateStats[user.date]++;
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
        if (!hourStats[hour]) hourStats[hour] = 0;
        hourStats[hour]++;
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
      { Metric: "Unique Programs", Value: [...new Set(formattedData.map(d => d.program))].length },
      { Metric: "Peak Login Hour", Value: peakHour ? peakHour + ":00" : "N/A" }
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