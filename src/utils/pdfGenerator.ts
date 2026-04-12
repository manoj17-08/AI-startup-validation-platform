import { jsPDF } from 'jspdf';
import { type AgentMessage } from '../mockData';

export const generatePDFReport = (idea: string, messages: AgentMessage[], reportData?: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 20;

    // Helper: Page Break Checker
    const checkPageBreak = (neededSpace: number) => {
        if (yPos + neededSpace > 280) {
            doc.addPage();
            yPos = 20;
        }
    };

    // Helper: Render Text with wrapping
    const renderText = (text: string, x: number, lineSpacing = 6, bold = false, size = 10, color = 0) => {
        doc.setFontSize(size);
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.setTextColor(color);
        const splitText = doc.splitTextToSize(String(text || ''), pageWidth - margin - x);
        checkPageBreak(splitText.length * lineSpacing);
        doc.text(splitText, x, yPos);
        yPos += splitText.length * lineSpacing + 2;
    };

    // Helper: Render Section Title
    const renderSectionTitle = (title: string) => {
        checkPageBreak(20);
        yPos += 5;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0);
        doc.text(title, margin, yPos);
        yPos += 3;
        doc.setDrawColor(200);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 8;
    };

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text("STARTUP FEASIBILITY REPORT", pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
    doc.setLineWidth(0.5);
    doc.setDrawColor(0);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    if (reportData && reportData.executive_summary) {
        
        // 1. Executive Summary
        renderSectionTitle("1. Executive Summary");
        
        renderText("Startup Idea:", margin, 5, true);
        renderText(reportData.executive_summary.startup_idea, margin, 5, false);
        yPos += 3;
        
        renderText("Problem Statement:", margin, 5, true);
        renderText(reportData.executive_summary.problem_statement, margin, 5, false);
        yPos += 3;
        
        renderText("Target Audience:", margin, 5, true);
        renderText(reportData.executive_summary.target_users, margin, 5, false);
        yPos += 3;
        
        renderText(`Verdict: -> ${reportData.executive_summary.verdict.toUpperCase()}`, margin, 5, true, 12, 0);
        yPos += 3;
        
        renderText("Key Reason:", margin, 5, true);
        renderText(reportData.executive_summary.key_reason, margin, 5, false);
        yPos += 3;
        
        if (reportData.executive_summary.pivot_suggestion && reportData.executive_summary.pivot_suggestion.toLowerCase() !== 'n/a') {
            renderText("Suggested Direction (if Pivot):", margin, 5, true);
            renderText(reportData.executive_summary.pivot_suggestion, margin, 5, false);
        }

        // 2. Market Opportunity Analysis
        renderSectionTitle("2. Market Opportunity Analysis");
        renderText(`Market Size: ${reportData.market_analysis?.market_size}`, margin, 5, false);
        renderText(`Growth Trend: ${reportData.market_analysis?.growth_trend}`, margin, 5, false);
        yPos += 3;
        renderText("Demand Signals:", margin, 5, true);
        (reportData.market_analysis?.demand_signals || []).forEach((sig: string) => {
            renderText(`* ${sig}`, margin + 5, 5, false);
        });
        yPos += 3;
        renderText(`Key Insight: -> ${reportData.market_analysis?.key_insight}`, margin, 5, true, 10);
        

        // 3. Competitor Analysis
        renderSectionTitle("3. Competitor Analysis");
        checkPageBreak(40);
        
        const startX = margin;
        const col1 = startX;
        const col2 = startX + 40;
        const col3 = startX + 110;
        
        // Header
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text("Competitor", col1, yPos);
        doc.text("Strength", col2, yPos);
        doc.text("Weakness", col3, yPos);
        yPos += 2;
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 6;
        
        doc.setFont('helvetica', 'normal');
        (reportData.competitor_analysis?.competitors || []).forEach((comp: any) => {
            checkPageBreak(15);
            let rowY = yPos;
            const splitName = doc.splitTextToSize(comp.name, col2 - col1 - 5);
            const splitStr = doc.splitTextToSize(comp.strength, col3 - col2 - 5);
            const splitWeak = doc.splitTextToSize(comp.weakness, pageWidth - margin - col3);
            
            const maxLines = Math.max(splitName.length, splitStr.length, splitWeak.length);
            
            doc.text(splitName, col1, rowY);
            doc.text(splitStr, col2, rowY);
            doc.text(splitWeak, col3, rowY);
            
            yPos += maxLines * 5 + 3;
            doc.setDrawColor(230);
            doc.line(margin, yPos - 2, pageWidth - margin, yPos - 2);
            doc.setDrawColor(0);
        });
        yPos += 3;
        renderText(`Competitive Insight: -> ${reportData.competitor_analysis?.competitive_insight}`, margin, 5, true, 10);

        // 4. Risk Analysis (Failure Points)
        renderSectionTitle("4. Risk Analysis (Failure Points)");
        (reportData.risk_analysis?.risks || []).forEach((risk: string) => {
            renderText(`* ${risk}`, margin + 5, 5, false);
        });
        yPos += 3;
        renderText(`Biggest Risk: -> ${reportData.risk_analysis?.biggest_risk}`, margin, 5, true, 10);

        // 5. Unique Value Proposition (UVP)
        renderSectionTitle("5. Unique Value Proposition (UVP)");
        (reportData.uvp?.points || []).forEach((pt: string) => {
            renderText(`* ${pt}`, margin + 5, 5, false);
        });
        yPos += 3;
        renderText(`Why This Can Win: -> ${reportData.uvp?.why_win}`, margin, 5, true, 10);

        // 6. Execution Roadmap
        renderSectionTitle("6. Execution Roadmap");
        renderText("Phase 1 (0-1 Month):", margin, 5, true);
        (reportData.roadmap?.phase1 || []).forEach((t: string) => renderText(`* ${t}`, margin + 5, 5, false));
        yPos += 2;
        renderText("Phase 2 (1-3 Months):", margin, 5, true);
        (reportData.roadmap?.phase2 || []).forEach((t: string) => renderText(`* ${t}`, margin + 5, 5, false));
        yPos += 2;
        renderText("Phase 3 (3-6 Months):", margin, 5, true);
        (reportData.roadmap?.phase3 || []).forEach((t: string) => renderText(`* ${t}`, margin + 5, 5, false));

        // 7. Feasibility Scoring
        renderSectionTitle("7. Feasibility Scoring");
        checkPageBreak(30);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text("Factor", margin, yPos);
        doc.text("Score (out of 10)", margin + 110, yPos);
        yPos += 2;
        doc.line(margin, yPos, margin + 150, yPos);
        yPos += 6;
        
        doc.setFont('helvetica', 'normal');
        const drawRow = (label: string, score: any) => {
            doc.text(label, margin, yPos);
            doc.text(String(score), margin + 110, yPos);
            yPos += 6;
        };
        drawRow("Market Demand", reportData.feasibility?.market_demand);
        drawRow("Competition (higher = worse)", reportData.feasibility?.competition);
        drawRow("Execution Difficulty", reportData.feasibility?.execution);
        drawRow("Monetization Potential", reportData.feasibility?.monetization);
        yPos += 3;
        renderText(`Final Feasibility Score: -> ${reportData.feasibility?.final_score} / 10`, margin, 5, true, 12);

        // 8. User Reality Check (Simulation)
        renderSectionTitle("8. User Reality Check (Simulation)");
        renderText(`User Persona: ${reportData.reality_check?.persona}`, margin, 5, false);
        renderText(`Likely Reaction: "${reportData.reality_check?.reaction}"`, margin, 5, false);
        yPos += 2;
        renderText(`Will They Pay? -> ${reportData.reality_check?.will_pay}`, margin, 5, true, 10);

        // 9. Final Recommendation
        renderSectionTitle("9. Final Recommendation");
        renderText(`Decision: -> ${reportData.recommendation?.decision.toUpperCase()}`, margin, 5, true, 12);
        yPos += 3;
        renderText("Reasoning:", margin, 5, true);
        (reportData.recommendation?.reasoning || []).forEach((r: string) => renderText(`* ${r}`, margin + 5, 5, false));
        yPos += 3;
        renderText("Next Steps:", margin, 5, true);
        (reportData.recommendation?.next_steps || []).forEach((r: string) => renderText(`* ${r}`, margin + 5, 5, false));

        // 10. One-Line Insight
        if (reportData.insight) {
            yPos += 5;
            checkPageBreak(15);
            doc.setDrawColor(0);
            doc.line(margin, yPos, pageWidth - margin, yPos);
            yPos += 10;
            renderText(`OPTIONAL (HIGH IMPACT ADD-ON)`, margin, 5, true, 12);
            renderText(`10. One-Line Insight`, margin, 5, true, 12);
            renderText(`-> "${reportData.insight}"`, margin, 5, true, 11);
        }

    } else {
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text("Report generation is incomplete. Wait for Planner to finish.", margin, yPos);
    }
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
            `Generated by AI Startup Validator - Page ${i} of ${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }

    doc.save(`${idea.replace(/\s+/g, '_').substring(0, 20)}_ConsultingReport.pdf`);
};
