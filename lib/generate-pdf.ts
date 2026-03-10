import jsPDF from "jspdf";
import type { BusinessIdea, BusinessPlan } from "./types";

export function downloadPlanPDF(idea: BusinessIdea, plan: BusinessPlan) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  function checkPageBreak(needed: number) {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  }

  function addHeading(text: string, size: number = 16) {
    checkPageBreak(12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.text(text, margin, y);
    y += size * 0.5 + 2;
  }

  function addSubheading(text: string) {
    checkPageBreak(10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(text, margin, y);
    y += 6;
  }

  function addBody(text: string, indent: number = 0) {
    checkPageBreak(8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(text, contentWidth - indent);
    for (const line of lines) {
      checkPageBreak(5);
      doc.text(line, margin + indent, y);
      y += 5;
    }
    y += 2;
  }

  function addSpacer(amount: number = 4) {
    y += amount;
  }

  // ── Title ──
  addHeading(idea.name, 20);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(idea.tagline, margin, y);
  y += 8;
  doc.setTextColor(0);

  // ── Overview ──
  addHeading("Overview");
  addBody(plan.overview);
  addSpacer();

  // ── Action Checklist ──
  addHeading("Action Checklist");
  plan.stepByStepChecklist.forEach((step, i) => {
    checkPageBreak(14);
    addSubheading(`${i + 1}. ${step.title}`);
    addBody(step.description, 4);
  });
  addSpacer();

  // ── Tools You'll Need ──
  addHeading("Tools You'll Need");
  addBody(plan.toolsNeeded.join("  •  "));
  addSpacer();

  // ── Get Your First Customer ──
  addHeading("Get Your First Customer");
  addBody(plan.howToGetFirstCustomer);
  addSpacer();

  // ── Pricing Guide ──
  addHeading("Pricing Guide");
  addBody(plan.pricingGuide);
  addSpacer();

  // ── Weekly Schedule ──
  addHeading("Weekly Schedule");
  addBody(plan.weeklyScheduleSuggestion);
  addSpacer(8);

  // ── Footer ──
  checkPageBreak(12);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(plan.encouragingClosing, margin, y, { maxWidth: contentWidth });
  y += 10;
  doc.setFontSize(9);
  doc.text("Made with Lemonade — lemonade.app", margin, y);

  // ── Save ──
  const safeName = idea.name.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "-").toLowerCase();
  doc.save(`${safeName}-plan.pdf`);
}
