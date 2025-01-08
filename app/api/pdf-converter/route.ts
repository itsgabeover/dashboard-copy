import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

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

        const browser = await puppeteer.launch({
            headless: 'true',
            executablePath: '/usr/bin/chromium-browser',
            args: ['--no-sandbox']
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
