// frontend/src/utils/pdfGenerator.js

import jsPDF from 'jspdf';

export const generateRiskReport = (prediction) => {
  const doc = new jsPDF();
  let yPos = 20;

  const checkPageBreak = (additionalHeight = 20) => {
    if (yPos + additionalHeight > 280) {
      doc.addPage();
      yPos = 20;
      return true;
    }
    return false;
  };

  // Header
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, 210, 45, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('JalChetna', 20, 28);
  doc.setFontSize(10);
  doc.text('Water-Borne Disease Risk Assessment Report', 20, 38);
  
  // Report Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  yPos = 55;
  doc.text(`Region: ${prediction.region}`, 20, yPos);
  yPos += 6;
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, yPos);
  yPos += 6;
  doc.text(`Report ID: JAL-${Date.now().toString().slice(-8)}`, 20, yPos);
  
  // Risk Summary Section
  yPos += 12;
  checkPageBreak(40);
  doc.setFillColor(245, 245, 245);
  doc.rect(20, yPos - 5, 170, 30, 'F');
  doc.setFontSize(12);
  doc.setTextColor(79, 70, 229);
  doc.text('RISK SUMMARY', 20, yPos);
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  yPos += 8;
  doc.text(`Risk Level: ${prediction.risk_level}`, 25, yPos);
  yPos += 6;
  doc.text(`Risk Score: ${prediction.risk_score}/100`, 25, yPos);
  
  // Environmental Conditions
  yPos += 15;
  checkPageBreak(50);
  doc.setFontSize(12);
  doc.setTextColor(79, 70, 229);
  doc.text('ENVIRONMENTAL CONDITIONS', 20, yPos);
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  yPos += 8;
  const env = prediction.environmental_conditions;
  doc.text(`Temperature: ${env.temperature}°C`, 25, yPos);
  yPos += 6;
  doc.text(`Rainfall: ${env.rainfall} mm`, 25, yPos);
  yPos += 6;
  doc.text(`Humidity: ${env.humidity}%`, 25, yPos);
  yPos += 6;
  doc.text(`Water pH: ${env.water_ph}`, 25, yPos);
  yPos += 6;
  doc.text(`Turbidity: ${env.water_turbidity} NTU`, 25, yPos);
  
  // Predicted Diseases
  yPos += 12;
  checkPageBreak(40);
  doc.setFontSize(12);
  doc.setTextColor(79, 70, 229);
  doc.text('PREDICTED DISEASES', 20, yPos);
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  yPos += 8;
  prediction.predicted_diseases?.forEach((d, i) => {
    if (checkPageBreak(10)) {
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
    }
    doc.text(`${i+1}. ${d.disease} - ${d.probability}% probability`, 25, yPos);
    yPos += 6;
  });
  
  // Analysis Summary
  yPos += 8;
  checkPageBreak(30);
  doc.setFontSize(12);
  doc.setTextColor(79, 70, 229);
  doc.text('ANALYSIS SUMMARY', 20, yPos);
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  yPos += 8;
  const splitSummary = doc.splitTextToSize(prediction.analysis_summary, 170);
  if (checkPageBreak(splitSummary.length * 5 + 10)) {
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
  }
  doc.text(splitSummary, 20, yPos);
  yPos += splitSummary.length * 5;
  
  // Recommendations
  yPos += 8;
  checkPageBreak(20);
  doc.setFontSize(12);
  doc.setTextColor(79, 70, 229);
  doc.text('RECOMMENDATIONS', 20, yPos);
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  yPos += 8;
  prediction.recommendations?.forEach((rec, i) => {
    if (checkPageBreak(10)) {
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
    }
    const splitRec = doc.splitTextToSize(`${i+1}. ${rec}`, 160);
    doc.text(splitRec, 25, yPos);
    yPos += splitRec.length * 5;
  });
  
  // Footer
  if (yPos > 270) {
    doc.addPage();
    yPos = 20;
  }
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('This report is AI-generated for informational purposes. Always consult a healthcare professional.', 20, 285);
  
  doc.save(`JalChetna_Risk_Report_${prediction.region}_${Date.now()}.pdf`);
};

export const generateHealthReport = (result, symptoms, region) => {
  const doc = new jsPDF();
  let yPos = 20;

  const checkPageBreak = (additionalHeight = 20) => {
    if (yPos + additionalHeight > 280) {
      doc.addPage();
      yPos = 20;
      return true;
    }
    return false;
  };

  // Header
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, 210, 45, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('JalChetna', 20, 28);
  doc.setFontSize(10);
  doc.text('AI Health Assessment Report', 20, 38);
  
  // Report Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  yPos = 55;
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, yPos);
  yPos += 6;
  doc.text(`Location: ${region || 'Not specified'}`, 20, yPos);
  yPos += 12;
  
  // Symptoms
  checkPageBreak(30);
  doc.setFontSize(12);
  doc.setTextColor(79, 70, 229);
  doc.text('SYMPTOMS REPORTED', 20, yPos);
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  yPos += 8;
  const splitSymptoms = doc.splitTextToSize(symptoms || 'No symptoms specified', 170);
  doc.text(splitSymptoms, 20, yPos);
  yPos += splitSymptoms.length * 5 + 12;
  
  // Diagnoses
  checkPageBreak(40);
  doc.setFontSize(12);
  doc.setTextColor(79, 70, 229);
  doc.text('AI DIAGNOSIS', 20, yPos);
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  yPos += 8;
  result.diagnoses?.forEach((d, i) => {
    if (checkPageBreak(15)) {
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
    }
    doc.text(`${i+1}. ${d.disease} - ${d.probability}% probability`, 25, yPos);
    yPos += 5;
    if (d.key_symptoms_matched) {
      doc.setFontSize(8);
      doc.text(`   Matched: ${d.key_symptoms_matched.join(', ')}`, 25, yPos);
      yPos += 5;
      doc.setFontSize(10);
    }
  });
  
  yPos += 5;
  if (checkPageBreak(10)) {
    doc.setFontSize(10);
  }
  doc.text(`Severity: ${result.severity}`, 20, yPos);
  
  // Immediate Actions
  yPos += 10;
  checkPageBreak(30);
  doc.setFontSize(12);
  doc.setTextColor(79, 70, 229);
  doc.text('IMMEDIATE ACTIONS', 20, yPos);
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  yPos += 8;
  result.immediate_actions?.forEach((action, i) => {
    if (checkPageBreak(10)) {
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
    }
    const splitAction = doc.splitTextToSize(`${i+1}. ${action}`, 160);
    doc.text(splitAction, 25, yPos);
    yPos += splitAction.length * 5;
  });
  
  // Seek Medical Help
  yPos += 5;
  checkPageBreak(30);
  doc.setFontSize(12);
  doc.setTextColor(79, 70, 229);
  doc.text('WHEN TO SEEK MEDICAL HELP', 20, yPos);
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  yPos += 8;
  result.seek_medical_if?.forEach((item, i) => {
    if (checkPageBreak(10)) {
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
    }
    const splitItem = doc.splitTextToSize(`${i+1}. ${item}`, 160);
    doc.text(splitItem, 25, yPos);
    yPos += splitItem.length * 5;
  });
  
  // Footer
  if (yPos > 270) {
    doc.addPage();
    yPos = 20;
  }
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('This is an AI-generated report. Always consult a healthcare professional for medical advice.', 20, 285);
  
  doc.save(`JalChetna_Health_Report_${Date.now()}.pdf`);
};