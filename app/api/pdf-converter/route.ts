import { NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export async function POST(request: Request) {
    try {
        let html: string;
        const contentType = request.headers.get('content-type');

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

        // Configure chromium for Vercel serverless
        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true
        });

        await browser.close();

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=document.pdf'
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