import { NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { PDFOptions } from 'puppeteer-core';

// Define PDF settings optimized for policy reports
const PDF_OPTIONS: PDFOptions = {
    format: 'letter',  // lowercase 'letter' is the correct type
    printBackground: true,
    margin: {
        top: '0.75in',
        right: '0.75in',
        bottom: '0.75in',
        left: '0.75in'
    },
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `
        <div style="font-size: 8pt; padding: 0 0.75in; width: 100%; border-top: 1pt solid #e2e8f0;">
            <span style="color: #2d3748;">Confidential</span>
            <span style="float: right;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
    `
};

export async function POST(request: Request) {
    try {
        let html: string;
        const contentType = request.headers.get('content-type');
        //bob was here
        // Handle different content types
        if (contentType?.includes('application/json')) {
            const body = await request.json();
            html = body.html;
        } else if (contentType?.includes('text/html')) {
            html = await request.text();
        } else {
            return NextResponse.json(
                { error: 'Content-Type must be application/json or text/html' },
                { status: 400 }
            );
        }

        if (!html) {
            return NextResponse.json(
                { error: 'HTML content is required' },
                { status: 400 }
            );
        }

        // Configure chromium for Vercel serverless with optimized viewport
        const browser = await puppeteer.launch({
            args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: {
                width: 1200,
                height: 1553,  // Letter size aspect ratio
                deviceScaleFactor: 2 // Better quality
            },
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        
        // Generate PDF with optimized options
        const pdfBuffer = await page.pdf(PDF_OPTIONS);
        
        await browser.close();

        // Generate meaningful filename
        const filename = `policy_review_${new Date().toISOString().split('T')[0]}.pdf`;

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=${filename}`,
                'Cache-Control': 'no-cache'
            }
        });
    } catch (error) {
        console.error('PDF conversion error:', error);
        return NextResponse.json(
            { error: 'Failed to convert HTML to PDF' },
            { status: 500 }
        );
    }
}
